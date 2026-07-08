// Live GitHub telemetry — unauthenticated public API, sessionStorage-cached
// so casual browsing never trips the 60 req/hr anonymous limit.

const USER = "poncema4";
const TTL = 4 * 60 * 1000;

export type GhData = {
  user: { public_repos: number; followers: number; created_at: string };
  repos: Array<{ name: string; html_url: string; description: string | null; stargazers_count: number; language: string | null; pushed_at: string }>;
  events: Array<{ type: string; repo: { name: string }; created_at: string }>;
};

export async function fetchGitHub(): Promise<GhData> {
  const cached = sessionStorage.getItem("ponceos-gh");
  if (cached) {
    const { at, data } = JSON.parse(cached);
    if (Date.now() - at < TTL) return data;
  }
  const [u, r, e] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`),
    fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6`),
    fetch(`https://api.github.com/users/${USER}/events/public?per_page=10`),
  ]);
  if (!u.ok || !r.ok) throw new Error(`uplink ${u.status}/${r.status}`);
  const data: GhData = { user: await u.json(), repos: await r.json(), events: e.ok ? await e.json() : [] };
  sessionStorage.setItem("ponceos-gh", JSON.stringify({ at: Date.now(), data }));
  return data;
}

export function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function eventVerb(t: string): string {
  const map: Record<string, string> = {
    PushEvent: "pushed to", CreateEvent: "created", PullRequestEvent: "opened PR on",
    IssuesEvent: "filed issue on", WatchEvent: "starred", ForkEvent: "forked",
    DeleteEvent: "cleaned branch on", ReleaseEvent: "released on", PublicEvent: "open-sourced",
  };
  return map[t] || t.replace("Event", "").toLowerCase();
}
