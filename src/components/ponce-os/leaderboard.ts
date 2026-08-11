// Leaderboard client. Talks to /api/leaderboard when it exists (Vercel), and falls
// back to a LOCAL board otherwise — so `vite dev`, an Upstash outage, or a blocked
// request can never break the game. The site stays playable with zero backend.

export type Entry = { name: string; score: number };

const LOCAL_BOARD = "ponce-os:cast:board";
const NAME_KEY = "ponce-os:cast:name";
const API = "/api/leaderboard";

export const getName = () => localStorage.getItem(NAME_KEY) || "";
export const setName = (n: string) => localStorage.setItem(NAME_KEY, n.slice(0, 14));

/** Sanitise like the server does, so local and remote agree on what a name is. */
export function cleanName(s: string): string {
  return s.replace(/[<>&"'`]/g, "").trim().slice(0, 14) || "anon";
}

/** Merge + sort + top 10. Exported for unit tests — the ranking is easy to get wrong. */
export function mergeBoard(entries: Entry[]): Entry[] {
  const best = new Map<string, number>();
  for (const e of entries) {
    const cur = best.get(e.name);
    if (cur === undefined || e.score > cur) best.set(e.name, e.score);
  }
  return [...best.entries()]
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 10);
}

function readLocal(): Entry[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_BOARD) || "[]"); } catch { return []; }
}
function writeLocal(list: Entry[]) {
  try { localStorage.setItem(LOCAL_BOARD, JSON.stringify(list)); } catch { /* private mode */ }
}

/** Top 10. Tries the server; on any failure returns the local board instead. */
export async function fetchBoard(): Promise<{ top: Entry[]; online: boolean }> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 3500);
    const r = await fetch(API, { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(String(r.status));
    const data = (await r.json()) as { top?: Entry[] };
    if (!Array.isArray(data.top)) throw new Error("bad shape");
    return { top: mergeBoard(data.top), online: true };
  } catch {
    return { top: mergeBoard(readLocal()), online: false };
  }
}

/** Submit a score. Always records locally too, so the board works offline. */
export async function submitScore(name: string, score: number): Promise<{ online: boolean }> {
  const n = cleanName(name);
  writeLocal(mergeBoard([...readLocal(), { name: n, score }]));
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 3500);
    const r = await fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: n, score }),
      signal: ctl.signal,
    });
    clearTimeout(t);
    return { online: r.ok };
  } catch {
    return { online: false };
  }
}
