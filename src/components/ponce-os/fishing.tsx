// cast — the deck-side fishing minigame. Lives OUTSIDE the terminal so visitors who
// don't want to type still get something to play with. Self-contained: one canvas
// overlay, no deps, no imports from the rest of ponce-os. Nothing else can break.
//
// loop: CAST -> WAIT -> APPROACH (you SEE the fish swim up) -> BITE -> HOOK
//       -> REEL (tension) -> LANDED/LOST -> [cooldown] -> CAST AGAIN (explicit)
//
// deliberate design notes:
//  - the approach is the telegraph: you watch it come, so the strike is earned, not luck.
//  - every run varies: side, depth, speed, and sometimes it's a false alarm that noses
//    the bait and turns away. that's what keeps it from being a metronome.
//  - after a catch you must press CAST AGAIN. no space-spam auto-recast. breathe, read
//    the line, then go again.

import { useEffect, useRef, useState, useCallback } from "react";
import { fetchBoard, submitScore, getName, setName as saveName, type Entry } from "./leaderboard";

type Phase =
  | "idle" | "casting" | "waiting" | "approach" | "bite"
  | "reeling" | "landed" | "lost";

type Catch = {
  name: string; art: string; pts: number;
  rarity: "junk" | "common" | "rare" | "relic" | "legendary" | "phish";
  line: string;
  // 1..7 — drives the SHORTER bite window, the HARDER fight, and the LONGER reel.
  // points scale with it: nothing valuable should be easy.
  diff: number;
};

// exported so the roll can be unit-tested — a rigged probability table is the kind of
// bug you never see by playing, only by asserting.
// 22 species. INVARIANT (unit-tested): points scale with difficulty — nothing valuable
// is easy, nothing easy is valuable. `diff` shortens the bite window, strengthens the
// fight, and lengthens the reel, so a whale genuinely feels different from a sardine.
export const TABLE: { c: Catch; w: number }[] = [
  // --- junk: instant, worthless, mildly funny ---
  { w: 9, c: { name: "old boot", art: "🥾", pts: 1, diff: 1, rarity: "junk", line: "someone's been here before." } },
  { w: 8, c: { name: "tangled cable", art: "🔌", pts: 2, diff: 1, rarity: "junk", line: "cat5. still terminated wrong." } },
  { w: 7, c: { name: "driftwood", art: "🪵", pts: 2, diff: 1, rarity: "junk", line: "older than the ship. keeping it." } },
  { w: 6, c: { name: "kelp tangle", art: "🌿", pts: 3, diff: 1, rarity: "junk", line: "the ocean's cable management. no notes." } },
  // --- common: the bread and butter ---
  { w: 16, c: { name: "sardine", art: "🐟", pts: 4, diff: 1, rarity: "common", line: "small. honest work." } },
  { w: 12, c: { name: "shrimp", art: "🦐", pts: 5, diff: 1, rarity: "common", line: "barely resisted. barely counts." } },
  { w: 14, c: { name: "reef snapper", art: "🐠", pts: 7, diff: 2, rarity: "common", line: "fought harder than expected." } },
  { w: 10, c: { name: "crab", art: "🦀", pts: 8, diff: 2, rarity: "common", line: "sideways to the end. respect." } },
  { w: 9, c: { name: "pufferfish", art: "🐡", pts: 10, diff: 2, rarity: "common", line: "inflated its own threat model." } },
  // --- rare: you have to actually reel ---
  { w: 7, c: { name: "jellyfish", art: "🪼", pts: 12, diff: 3, rarity: "rare", line: "no brain, no spine, still won an argument." } },
  { w: 7, c: { name: "squid", art: "🦑", pts: 13, diff: 3, rarity: "rare", line: "ink deployed. countermeasure noted." } },
  { w: 5, c: { name: "sea turtle", art: "🐢", pts: 15, diff: 3, rarity: "rare", line: "released, obviously. she was here first." } },
  { w: 5, c: { name: "lobster", art: "🦞", pts: 16, diff: 3, rarity: "rare", line: "came up swinging. dinner-adjacent." } },
  { w: 4, c: { name: "seal", art: "🦭", pts: 18, diff: 4, rarity: "rare", line: "it was playing with you the whole time." } },
  { w: 4, c: { name: "dolphin", art: "🐬", pts: 20, diff: 4, rarity: "rare", line: "released. it seemed amused by the attempt." } },
  // --- relic: the wreck gives up its things ---
  { w: 4, c: { name: "wreck relic", art: "⚓", pts: 22, diff: 4, rarity: "relic", line: "off the hull down there. still holding." } },
  { w: 3, c: { name: "data packet", art: "📦", pts: 26, diff: 4, rarity: "relic", line: "unencrypted, in open water. rookie mistake." } },
  { w: 2, c: { name: "ancient key", art: "🗝️", pts: 32, diff: 5, rarity: "relic", line: "opens something. not saying what." } },
  // --- legendary: these will break your line ---
  { w: 2, c: { name: "SHARK", art: "🦈", pts: 45, diff: 5, rarity: "legendary", line: "you didn't catch it. it allowed this." } },
  { w: 2, c: { name: "treasure chest", art: "💰", pts: 55, diff: 6, rarity: "legendary", line: "the real treasure was the contact section. but this helps." } },
  { w: 1, c: { name: "WHALE", art: "🐋", pts: 70, diff: 6, rarity: "legendary", line: "the whole boat leaned. you let it go." } },
  { w: 1, c: { name: "THE KRAKEN", art: "🐙", pts: 100, diff: 7, rarity: "legendary", line: "you woke it. the ship is fine. probably." } },
  // --- the one you're supposed to NOT take ---
  { w: 6, c: { name: "phish", art: "📧", pts: -8, diff: 2, rarity: "phish", line: "\"URGENT: verify your credentials\" — you struck at it. we don't click it." } },
];

const RARITY_COLOR: Record<Catch["rarity"], string> = {
  junk: "#5f7a6e", common: "#34d399", rare: "#22d3ee",
  relic: "#a5f3fc", legendary: "#fbbf24", phish: "#f87171",
};
export const rarityColor = (r: Catch["rarity"]) => RARITY_COLOR[r];

// pure + deterministic for a given r in [0,1] — that's what makes it testable.
// Math.random() is injected by the caller, never called in here.
export function pickFrom(table: { c: Catch; w: number }[], r: number): Catch {
  const total = table.reduce((s, e) => s + e.w, 0);
  let n = Math.min(Math.max(r, 0), 0.999999) * total;
  for (const e of table) { n -= e.w; if (n < 0) return e.c; }
  return table[table.length - 1].c;
}

const roll = (): Catch => pickFrom(TABLE, Math.random());

// --- difficulty curves (exported: unit-tested so the tuning can't silently invert) ---
// harder fish give you LESS time to strike...
export const biteWindowMs = (diff: number) => Math.max(420, 1250 - diff * 120);
// ...pull HARDER against the reel...
export const fightMul = (diff: number) => 0.85 + diff * 0.16;
// ...and take LONGER to bring in.
export const reelTargetMs = (diff: number) => 1500 + diff * 320;

const BEST_KEY = "ponce-os:cast:best";
const CAUGHT_KEY = "ponce-os:cast:caught";

// the swimmer we draw during the approach
type Swimmer = {
  x: number; y: number; tx: number; ty: number;
  dir: 1 | -1; speed: number; wob: number;
  size: number; fake: boolean; turning: boolean;
  hooked?: boolean;   // on the line — drawn fighting, dragged toward the boat
};

export function Fishing({ onClose, onFlag }: { onClose: () => void; onFlag?: (flag: string) => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem(BEST_KEY) || 0));
  const [last, setLast] = useState<Catch | null>(null);
  const [tension, setTension] = useState(50);
  const [ready, setReady] = useState(true);   // the breather gate
  const [flagged, setFlagged] = useState(false);
  const [early, setEarly] = useState(false);  // struck before the bite = spooked it
  const [board, setBoard] = useState<Entry[] | null>(null);
  const [online, setOnline] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [nameInput, setNameInput] = useState(() => getName());
  const [submitted, setSubmitted] = useState(false);

  const phaseR = useRef(phase); phaseR.current = phase;
  const tensionR = useRef(tension); tensionR.current = tension;
  const readyR = useRef(ready); readyR.current = ready;
  const holdR = useRef(false);
  const spaceDownR = useRef(false);           // kills key auto-repeat spam
  const pendingR = useRef<Catch | null>(null);
  const swimR = useRef<Swimmer | null>(null);
  const timerR = useRef<number | null>(null);
  const reelR = useRef(0);
  // the catch arcing out of the water into the basket on the deck
  const flightR = useRef<{ x0: number; y0: number; start: number; art: string } | null>(null);

  const clearTimer = () => { if (timerR.current) { window.clearTimeout(timerR.current); timerR.current = null; } };

  // every result ends with a forced breather, then an explicit CAST AGAIN
  const rest = useCallback((ms = 900) => {
    setReady(false);
    clearTimer();
    timerR.current = window.setTimeout(() => setReady(true), ms);
  }, []);

  const land = useCallback((c: Catch) => {
    // don't vanish the fish — launch it out of the water into the basket
    const s = swimR.current;
    flightR.current = { x0: s ? s.x : 0, y0: s ? s.y : 0, start: performance.now(), art: c.art };
    swimR.current = null;
    setLast(c);
    setPhase("landed");
    setScore((s) => {
      const next = Math.max(0, s + c.pts);
      setBest((b) => {
        if (next > b) { localStorage.setItem(BEST_KEY, String(next)); return next; }
        return b;
      });
      return next;
    });
    if (c.rarity === "phish") setStreak(0); else setStreak((k) => k + 1);
    try {
      const seen = new Set<string>(JSON.parse(localStorage.getItem(CAUGHT_KEY) || "[]"));
      seen.add(c.name);
      localStorage.setItem(CAUGHT_KEY, JSON.stringify([...seen]));
      if (seen.size >= 6 && !flagged) { setFlagged(true); onFlag?.("ponce{d33p-w4t3r-4ngl3r}"); }
    } catch { /* storage blocked — game still plays, flag just won't persist */ }
    rest(950);
  }, [flagged, onFlag, rest]);

  const miss = useCallback((why: Phase = "lost") => {
    swimR.current = null; pendingR.current = null;
    setStreak(0); setPhase(why); rest(750);
  }, [rest]);

  const cast = useCallback(() => {
    const p = phaseR.current;
    if (!readyR.current) return;                                  // breather
    if (p !== "idle" && p !== "landed" && p !== "lost") return;
    setLast(null); swimR.current = null; pendingR.current = null;
    setPhase("casting");
    clearTimer();
    timerR.current = window.setTimeout(() => {
      setPhase("waiting");
      scheduleApproach();
    }, 520);
  }, []);

  // a fish decides to come look. sometimes it's a tyre-kicker.
  const scheduleApproach = useCallback(() => {
    clearTimer();
    timerR.current = window.setTimeout(() => {
      const fake = Math.random() < 0.28;                          // false alarm
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      swimR.current = {
        x: 0, y: 0, tx: 0, ty: 0, dir,
        speed: 0.55 + Math.random() * 0.9,                        // varies every run
        wob: Math.random() * Math.PI * 2,
        size: 0.8 + Math.random() * 0.9,
        fake, turning: false,
      };
      if (!fake) pendingR.current = roll();
      setPhase("approach");
    }, 900 + Math.random() * 3400);                               // the wait varies too
  }, []);

  const hook = useCallback(() => {
    const p = phaseR.current;
    // STRIKING EARLY SPOOKS IT. you have to wait for the bobber to actually go down.
    // this is what makes the telegraph a skill test instead of a "mash space" button.
    if (p === "approach" || p === "waiting") {
      clearTimer();
      setEarly(true);
      miss("lost");
      return;
    }
    if (p !== "bite" || !pendingR.current) return;
    clearTimer();
    setEarly(false);
    reelR.current = 0; setTension(50);
    // the fish is ON THE LINE now — keep it alive so it can be seen fighting
    if (swimR.current) { swimR.current.hooked = true; swimR.current.turning = false; }
    setPhase("reeling");
  }, [miss]);

  // reel: hold to pull, release to ease. keep it off both rails.
  useEffect(() => {
    if (phase !== "reeling") return;
    let raf = 0, prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - prev); prev = now;
      const c = pendingR.current;
      // the fight scales with difficulty — a whale genuinely fights back
      const fight = c ? fightMul(c.diff) : 1;
      const target = c ? reelTargetMs(c.diff) : 2100;
      const t = tensionR.current + (holdR.current ? 0.055 : -0.045) * dt * fight;
      if (t <= 0 || t >= 100) { miss(); return; }
      setTension(t);
      reelR.current += dt * (t > 28 && t < 78 ? 1 : 0.18);
      if (reelR.current >= target) { const got = pendingR.current; pendingR.current = null; if (got) land(got); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, land, miss]);

  // canvas — water, boat, line, and the fish you can actually watch coming
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);

    let biteAt = 0;
    const draw = (t: number) => {
      const r = c.getBoundingClientRect(), W = r.width, H = r.height;
      const surf = H * 0.40;
      const bobX = W * 0.62;
      const p = phaseR.current;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#050a08"; ctx.fillRect(0, 0, W, surf);
      const g = ctx.createLinearGradient(0, surf, 0, H);
      g.addColorStop(0, "#0a2a24"); g.addColorStop(1, "#030705");
      ctx.fillStyle = g; ctx.fillRect(0, surf, W, H - surf);

      ctx.fillStyle = "rgba(234,255,245,.5)";
      ctx.beginPath(); ctx.arc(W - 40, 30, 10, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = "rgba(52,211,153,.28)"; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const y = surf + i * 8 + Math.sin(x * 0.028 + t * 0.0013 + i) * 2.2;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // the deck you're standing on
      ctx.fillStyle = "#16211b";
      ctx.beginPath();
      ctx.moveTo(20, surf - 3); ctx.lineTo(88, surf - 3);
      ctx.lineTo(78, surf + 10); ctx.lineTo(30, surf + 10);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#33473e"; ctx.beginPath();
      ctx.moveTo(54, surf - 3); ctx.lineTo(54, surf - 30); ctx.stroke();

      // the basket on the deck — where the catch lands
      const bkX = 32, bkY = surf - 8;
      ctx.strokeStyle = "#33473e"; ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(bkX - 8, bkY); ctx.lineTo(bkX - 6, bkY + 7);
      ctx.lineTo(bkX + 6, bkY + 7); ctx.lineTo(bkX + 8, bkY);
      ctx.stroke();
      ctx.beginPath(); ctx.ellipse(bkX, bkY, 8, 2.4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1;

      // ambient fish, far below — the water is never empty
      ctx.fillStyle = "rgba(52,211,153,.13)";
      for (let i = 0; i < 4; i++) {
        const fx = (((t * 0.018 * (i % 2 ? 1 : -1) + i * 100) % (W + 60)) + W + 60) % (W + 60) - 30;
        const fy = H - 34 - i * 11 + Math.sin(t * 0.002 + i) * 3;
        ctx.beginPath(); ctx.ellipse(fx, fy, 5.5, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      }

      const inWater = p === "waiting" || p === "approach" || p === "bite" || p === "reeling";
      let bobY = surf;

      // --- the swimmer: telegraph on approach, then it FIGHTS on the line ---
      const s = swimR.current;
      if (s && p === "reeling") {
        // dragged toward the boat as you make progress; thrashes the whole way
        const prog = Math.min(1, reelR.current / 2100);
        const tgtX = bobX + (56 - bobX) * prog * 0.75;
        const tgtY = surf + 8 - prog * 4;
        s.x += (tgtX - s.x) * 0.06;
        s.y += (tgtY - s.y) * 0.06;
        const thrash = Math.sin(t * 0.045) * (5 - prog * 2);
        ctx.save();
        ctx.translate(s.x, s.y + thrash * 0.35);
        ctx.rotate(Math.sin(t * 0.05) * 0.4);
        ctx.scale(s.dir, 1);
        ctx.fillStyle = "rgba(110,231,183,.95)";
        ctx.beginPath(); ctx.ellipse(0, 0, 9 * s.size, 4 * s.size, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-8 * s.size, 0); ctx.lineTo(-14 * s.size, -4 * s.size); ctx.lineTo(-14 * s.size, 4 * s.size);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#050a08";
        ctx.beginPath(); ctx.arc(4 * s.size, -1, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // splash flecks while it fights near the surface
        if (s.y < surf + 14) {
          ctx.fillStyle = "rgba(199,214,207,.5)";
          for (let i = 0; i < 3; i++) {
            const a = t * 0.02 + i * 2.1;
            ctx.fillRect(s.x + Math.cos(a) * 9, surf - 2 + Math.sin(a) * 3, 1.5, 1.5);
          }
        }
      }
      if (s && (p === "approach" || p === "bite")) {
        if (!s.tx) { // init on first frame, now that we know the canvas size
          s.tx = bobX; s.ty = surf + 6;
          s.x = s.dir === 1 ? -20 : W + 20;
          s.y = surf + 40 + Math.random() * (H - surf - 70);
        }
        if (p === "approach") {
          const dx = s.tx - s.x, dy = s.ty - s.y;
          const d = Math.hypot(dx, dy) || 1;
          if (s.turning) { s.x -= (dx / d) * s.speed * 2.2; s.y += 0.5; }
          else { s.x += (dx / d) * s.speed * 1.6; s.y += (dy / d) * s.speed * 1.6; }
          if (!s.turning && d < 12) {
            if (s.fake) { s.turning = true; setTimeout(() => { if (phaseR.current === "approach") { swimR.current = null; setPhase("waiting"); scheduleApproach(); } }, 700); }
            else {
              biteAt = t; setPhase("bite"); clearTimer();
              // harder fish give you a shorter window to react
              const win = pendingR.current ? biteWindowMs(pendingR.current.diff) : 1150;
              timerR.current = window.setTimeout(() => miss(), win);
            }
          }
          if (s.turning && (s.x < -40 || s.x > W + 40)) swimR.current = null;
        }
        // draw it — body + tail, facing travel
        const face = s.turning ? -s.dir : s.dir;
        const wob = Math.sin(t * 0.012 + s.wob) * 2;
        ctx.save();
        ctx.translate(s.x, s.y + wob);
        ctx.scale(face, 1);
        ctx.fillStyle = s.fake ? "rgba(95,122,110,.75)" : "rgba(110,231,183,.85)";
        ctx.beginPath(); ctx.ellipse(0, 0, 9 * s.size, 4 * s.size, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-8 * s.size, 0); ctx.lineTo(-14 * s.size, -4 * s.size); ctx.lineTo(-14 * s.size, 4 * s.size);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#050a08";
        ctx.beginPath(); ctx.arc(4 * s.size, -1, 1.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      if (inWater) {
        // THE LINE FOLLOWS THE FISH. once hooked, the bobber IS wherever the fish is —
        // it gets dragged back toward the rod as you win, which is the whole point of reeling.
        const hookedS = p === "reeling" ? swimR.current : null;
        const lineX = hookedS ? hookedS.x : bobX;
        const dip = p === "bite" ? Math.sin((t - biteAt) * 0.03) * 5 + 5 : Math.sin(t * 0.004) * 1.5;
        bobY = hookedS ? hookedS.y - 5 : surf + dip;

        // rod tip bends toward the fight
        const tipX = 56, tipY = surf - 30;
        const bend = p === "reeling" ? 10 : 0;
        ctx.strokeStyle = p === "reeling" ? "rgba(199,214,207,.75)" : "rgba(199,214,207,.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.quadraticCurveTo((tipX + lineX) / 2, tipY - 16 + bend, lineX, bobY);
        ctx.stroke();

        // bobber rides the line; while hooked it sits on the fish
        ctx.fillStyle = p === "bite" ? "#f87171" : p === "reeling" ? "#6ee7b7" : "#fbbf24";
        ctx.beginPath(); ctx.arc(lineX, bobY, p === "reeling" ? 2.6 : 4, 0, Math.PI * 2); ctx.fill();

        if (p === "bite") {
          const rr = (((t - biteAt) * 0.06) % 20) + 4;
          ctx.strokeStyle = `rgba(248,113,113,${Math.max(0, 0.55 - rr / 42)})`;
          ctx.beginPath(); ctx.arc(lineX, bobY, rr, 0, Math.PI * 2); ctx.stroke();
        }
      } else if (p === "casting") {
        ctx.strokeStyle = "rgba(199,214,207,.35)";
        ctx.beginPath(); ctx.moveTo(56, surf - 30); ctx.lineTo(bobX * 0.8, surf - 20); ctx.stroke();
      }

      // --- the catch leaps out of the water and drops into the basket ---
      const fl = flightR.current;
      if (fl) {
        const DUR = 780;
        const k = Math.min(1, (performance.now() - fl.start) / DUR);
        if (k >= 1) { flightR.current = null; }
        else {
          const fx = fl.x0 + (bkX - fl.x0) * k;
          // parabola: up and over, landing in the basket mouth
          const fy = fl.y0 + (bkY - fl.y0) * k - Math.sin(k * Math.PI) * 46;
          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(k * Math.PI * 1.6);           // it tumbles through the air
          ctx.font = "16px system-ui, sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.globalAlpha = k > 0.92 ? (1 - k) / 0.08 : 1;
          ctx.fillText(fl.art, 0, 0);
          ctx.restore();
          ctx.globalAlpha = 1;
          // splash where it broke the surface
          if (k < 0.22) {
            ctx.strokeStyle = `rgba(199,214,207,${0.55 - k * 2})`;
            const rr = 4 + k * 40;
            ctx.beginPath(); ctx.arc(fl.x0, surf, rr, Math.PI, Math.PI * 2); ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [miss, scheduleApproach]);

  useEffect(() => () => clearTimer(), []);

  // pull the board when it's opened (never blocks the game — falls back to local)
  const loadBoard = useCallback(async () => {
    const { top, online: on } = await fetchBoard();
    setBoard(top); setOnline(on);
  }, []);
  useEffect(() => { if (showBoard && !board) void loadBoard(); }, [showBoard, board, loadBoard]);

  const postScore = useCallback(async () => {
    if (!nameInput.trim() || score <= 0) return;
    saveName(nameInput.trim());
    setSubmitted(true);
    await submitScore(nameInput.trim(), score);
    setBoard(null);            // force a refetch so you see your new rank
    setShowBoard(true);
    void loadBoard();
  }, [nameInput, score, loadBoard]);

  // keyboard: space is contextual, esc closes. auto-repeat is ignored.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.code !== "Space") return;
      e.preventDefault();
      if (spaceDownR.current) return;        // no auto-repeat spam
      spaceDownR.current = true;
      const p = phaseR.current;
      if (p === "bite") hook();
      else if (p === "reeling") holdR.current = true;
      else cast();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      spaceDownR.current = false; holdR.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [cast, hook, onClose]);

  const resting = phase === "landed" || phase === "lost";
  const label =
    phase === "bite" ? "HOOK IT" :
    phase === "reeling" ? "HOLD TO REEL" :
    phase === "approach" ? "something's coming..." :
    phase === "waiting" ? "waiting for a bite..." :
    phase === "casting" ? "casting..." :
    resting ? (ready ? "CAST AGAIN" : "...") : "CAST";

  const armed = phase === "bite" || (resting && ready) || phase === "idle";

  return (
    <div className="cast-wrap" role="dialog" aria-label="cast — fishing minigame">
      <div className="cast-panel">
        <div className="cast-head">
          <span className="cast-title">cast<span className="cast-sub"> — off the port bow</span></span>
          <button className="cast-x" onClick={onClose} aria-label="close">✕</button>
        </div>

        <div className="cast-stats">
          <span>score <b>{score}</b></span>
          <span>streak <b>{streak}</b></span>
          <span>best <b>{best}</b></span>
          <button className="cast-link" onClick={() => setShowBoard((v) => !v)}>
            {showBoard ? "back to the water" : "leaderboard"}
          </button>
        </div>

        {showBoard && (
          <div className="cast-board">
            <div className="cast-board-head">
              <span>top anglers</span>
              <span className="dim">{online ? "global" : "this device"}</span>
            </div>
            {board === null ? (
              <div className="dim cast-board-empty">hauling the board up...</div>
            ) : board.length === 0 ? (
              <div className="dim cast-board-empty">no one's landed anything yet. be first.</div>
            ) : (
              <ol className="cast-board-list">
                {board.map((e, i) => (
                  <li key={e.name + i}>
                    <span className="cast-rank">{i + 1}</span>
                    <span className="cast-who">{e.name}</span>
                    <span className="cast-pts">{e.score}</span>
                  </li>
                ))}
              </ol>
            )}
            {score > 0 && (
              <div className="cast-submit">
                <input
                  className="cast-name"
                  value={nameInput}
                  maxLength={14}
                  placeholder="your name"
                  onChange={(e) => setNameInput(e.target.value)}
                  aria-label="your name for the leaderboard"
                />
                <button className="cast-post" onClick={() => void postScore()} disabled={!nameInput.trim() || submitted}>
                  {submitted ? "posted" : `post ${score}`}
                </button>
              </div>
            )}
            {!online && board !== null && (
              <div className="dim cast-board-note">offline — showing this device's scores.</div>
            )}
          </div>
        )}

        <div className="cast-stage" style={showBoard ? { display: "none" } : undefined}>
          <canvas ref={cv} className="cast-cv" />
          {phase === "reeling" && (
            <div className="cast-tension" aria-hidden="true">
              <div className="cast-band" />
              <div className="cast-needle" style={{ left: `${tension}%` }} />
            </div>
          )}
        </div>

        <div className="cast-msg" aria-live="polite">
          {last ? (
            <span style={{ color: RARITY_COLOR[last.rarity] }}>
              {last.art} {last.name} {last.pts >= 0 ? `+${last.pts}` : last.pts} — <i>{last.line}</i>
            </span>
          ) : phase === "lost" ? (
            early
              ? <span style={{ color: "#f87171" }}>you struck too early — spooked it. wait for the bobber to go red.</span>
              : <span className="dim">it got away. the sea keeps its own.</span>
          ) : phase === "approach" ? (
            <span className="dim">something's nosing the bait — not all of them commit. wait for the take.</span>
          ) : (
            <span className="dim">cast, watch the water, strike when the bobber goes red.</span>
          )}
        </div>

        <button
          className={`cast-btn ${phase === "bite" ? "hot" : ""} ${!armed && !["reeling"].includes(phase) ? "waiting" : ""}`}
          disabled={resting && !ready}
          onPointerDown={(e) => { e.preventDefault(); if (phase === "reeling") holdR.current = true; }}
          onPointerUp={() => { holdR.current = false; }}
          onPointerLeave={() => { holdR.current = false; }}
          onPointerCancel={() => { holdR.current = false; }}
          onClick={() => { if (phase === "bite") hook(); else cast(); }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export const FISHING_CSS = `
.cast-wrap { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center;
  background: rgba(3,7,5,.72); backdrop-filter: blur(3px); animation: cast-in .18s ease-out; padding: 12px; }
@keyframes cast-in { from { opacity: 0 } to { opacity: 1 } }
.cast-panel { width: min(94vw, 560px); max-height: 94vh; overflow: auto; background: var(--panel);
  border: 1px solid var(--line); border-radius: 10px; padding: 14px;
  box-shadow: 0 0 0 1px rgba(52,211,153,.12), 0 24px 60px rgba(0,0,0,.6); }
.cast-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.cast-title { color: var(--green-hi); font-weight: 600; letter-spacing: .04em; }
.cast-sub { color: var(--dim); font-weight: 400; }
.cast-x { background: none; border: 1px solid var(--line); color: var(--dim); border-radius: 6px;
  cursor: pointer; width: 34px; height: 34px; line-height: 1; font-size: 14px; }
.cast-x:hover { color: var(--green); border-color: var(--green); }
.cast-stats { display: flex; gap: 16px; align-items: center; color: var(--dim); font-size: 12px; margin-bottom: 8px; }
.cast-stats b { color: var(--green); }
.cast-link { margin-left: auto; background: none; border: none; color: var(--cyan); cursor: pointer;
  font: inherit; font-size: 12px; text-decoration: underline; padding: 4px; }
.cast-link:hover { color: var(--green-hi); }
.cast-board { border: 1px solid var(--line); border-radius: 8px; padding: 10px; min-height: 210px; }
.cast-board-head { display: flex; justify-content: space-between; color: var(--green-hi);
  font-size: 12px; margin-bottom: 6px; letter-spacing: .05em; }
.cast-board-empty, .cast-board-note { font-size: 12px; padding: 6px 2px; }
.cast-board-list { list-style: none; margin: 0; padding: 0; }
.cast-board-list li { display: flex; align-items: center; gap: 8px; padding: 3px 2px;
  font-size: 12.5px; border-bottom: 1px solid rgba(18,36,28,.6); }
.cast-rank { color: var(--dim); width: 20px; }
.cast-who { color: var(--txt); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cast-pts { color: var(--green); font-weight: 600; }
.cast-submit { display: flex; gap: 8px; margin-top: 10px; }
.cast-name { flex: 1; min-width: 0; background: #050a08; border: 1px solid var(--line);
  color: var(--txt); border-radius: 6px; padding: 8px 10px; font: inherit; font-size: 12px; }
.cast-name:focus { outline: none; border-color: var(--green); }
.cast-post { background: transparent; border: 1px solid var(--green); color: var(--green);
  border-radius: 6px; padding: 8px 12px; cursor: pointer; font: inherit; font-size: 12px;
  min-height: 38px; touch-action: manipulation; }
.cast-post:disabled { opacity: .4; cursor: default; }
.cast-post:not(:disabled):hover { background: rgba(52,211,153,.12); }
.cast-stage { position: relative; }
.cast-cv { width: 100%; height: 210px; display: block; border: 1px solid var(--line);
  border-radius: 8px; background: #050a08; touch-action: manipulation; }
.cast-tension { position: absolute; left: 8px; right: 8px; bottom: 8px; height: 8px;
  background: rgba(3,7,5,.75); border: 1px solid var(--line); border-radius: 999px; }
.cast-band { position: absolute; left: 28%; width: 50%; top: 0; bottom: 0; background: rgba(52,211,153,.25); }
.cast-needle { position: absolute; top: -3px; width: 2px; height: 14px; background: var(--amber);
  box-shadow: 0 0 6px var(--amber); transform: translateX(-1px); }
.cast-msg { min-height: 38px; display: flex; align-items: center; font-size: 12.5px; margin: 8px 2px; line-height: 1.35; }
.cast-btn { width: 100%; min-height: 48px; padding: 12px; background: transparent;
  border: 1px solid var(--green); color: var(--green); border-radius: 8px; cursor: pointer;
  font: inherit; letter-spacing: .08em; transition: background .12s, color .12s, opacity .12s;
  user-select: none; touch-action: manipulation; }
.cast-btn:hover { background: rgba(52,211,153,.12); }
.cast-btn:disabled { opacity: .35; cursor: default; }
.cast-btn.waiting { border-color: var(--line); color: var(--dim); }
.cast-btn.hot { border-color: #f87171; color: #f87171; animation: cast-pulse .45s infinite alternate; }
@keyframes cast-pulse { to { background: rgba(248,113,113,.18) } }
/* bottom-LEFT on purpose: .pos-depth (the depth gauge) owns bottom-right at z-index 55.
   they were colliding in the same corner. left keeps both readable and nothing overlaps. */
.cast-launch { position: fixed; left: 16px; bottom: 16px; z-index: 40; background: var(--panel);
  border: 1px solid var(--line); color: var(--dim); border-radius: 999px; padding: 10px 15px;
  min-height: 42px; cursor: pointer; font: inherit; font-size: 12px; letter-spacing: .05em;
  transition: color .15s, border-color .15s, transform .15s; touch-action: manipulation; }
.cast-launch:hover { color: var(--green); border-color: var(--green); transform: translateY(-2px); }
@media (max-width: 640px) {
  .cast-cv { height: 168px; }
  /* phones are tight — keep it clear of the depth gauge AND any thumb reach */
  .cast-launch { bottom: 10px; left: 10px; padding: 9px 13px; font-size: 11px; }
  .cast-stats { gap: 12px; font-size: 11px; }
}
@media (prefers-reduced-motion: reduce) { .cast-wrap, .cast-btn.hot { animation: none; } }
`;
