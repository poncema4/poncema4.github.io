# ponce-os — test results

Last full run: **2026-07-16**. Regenerate with `npm test` (unit + e2e).

| Suite | Runner | Count | Result |
|---|---|---|---|
| Unit — fishing | Vitest | 17 | ✅ pass |
| Unit — leaderboard | Vitest | 10 | ✅ pass |
| E2E — desktop (Chrome) | Playwright | 20 | ✅ pass |
| E2E — mobile (Pixel 5) | Playwright | 21 | ✅ pass |
| **Total** | | **68** | ✅ **68 pass, 1 skipped** |

The 1 skip is intentional: a real-touch `tap()` assertion that only the mobile
project can run (the desktop context has no touch support).

## Commands

```bash
npm run test:unit    # vitest
npm run test:e2e     # playwright (builds + serves the real production bundle)
npm test             # both
```

## What is covered

### Backend — `api/leaderboard.ts`
Verified **against the real Upstash database** via `npx vercel dev` (2026-07-16).
`vite dev` and `vite preview` do NOT serve `/api`, so this cannot be covered by the
e2e suite — it must be run through `vercel dev`.

| Check | Result |
|---|---|
| `GET` returns the board | ✅ `200 {"top":[...]}` |
| `POST` submits, returns rank | ✅ `{"ok":true,"rank":1}` |
| Name with a space preserved | ✅ `"marco p"` round-trips intact |
| Score `0` rejected | ✅ `400 bad score` |
| Score `99999` rejected | ✅ `400 implausible score` |
| XSS name sanitised | ✅ angle brackets stripped |
| Lower re-submit cannot lower a best | ✅ `zadd {gt:true}` holds |
| `DELETE` | ✅ `405 method not allowed` |
| Missing env | ✅ `503` + localStorage fallback (never 500s) |

Env vars `KV_REST_API_URL` / `KV_REST_API_TOKEN` are present in Vercel
**Production, Preview, and Development**, so the deployed site has them.

### Frontend — unit
Pure logic only, so it stays deterministic: the catch table, the difficulty→points
invariant (**harder fish must score more** — the rule that is easy to silently break),
weighted `pickFrom` selection, and board ranking / name sanitising.

### Frontend — e2e (desktop AND mobile, every test runs on both)
- **Shell** — boots past BIOS, `help`, `whoami`, unknown commands fail without crashing
- **Cast minigame** — launch button is a real ≥40px tap target, opens from button and
  from the `cast` command, fits the viewport, shows the approach telegraph before the
  bite, space-spam cannot auto-recast, ESC closes and the terminal still works after
- **Mobile input chain** — tapping the terminal body (not just the input) lands focus
  on the input; real key events (`pressSequentially`, not `fill`) reach the shell;
  the input carries `autocorrect=off` / `autocapitalize=off` / `spellcheck=false`
- **Leaderboard** — opens and degrades gracefully with no backend present
- **Third-party degradation** — the site boots and stays fully usable when the GitHub
  API 403s (rate limit) or is unreachable entirely
- **Regressions** — the `breach` minigame, the `resume` PDF, and a clean console

## Known limits (stated, not hidden)

1. **No automated test can prove a phone's on-screen keyboard physically appears** —
   that is an OS surface Playwright cannot observe. What IS tested is the chain that
   causes it: a tap must land focus on the input, because mobile browsers open the
   keyboard when `.focus()` runs inside a trusted user gesture. A regression here
   (an overlay eating the tap, a z-index change) WOULD be caught.
2. **Mobile = Pixel 5 (Chromium), not real iOS Safari.** WebKit is not installed.
   `npx playwright install webkit` then swap to `devices["iPhone 13"]` in
   `playwright.config.ts` for real Safari coverage.
3. **The e2e suite runs against a static preview, which has no `/api`.** It therefore
   proves the localStorage fallback, not the live API path. The API is verified
   separately (see above). These are complementary, not redundant.
4. **The leaderboard is public and unauthenticated, so scores are spoofable.** Mitigated
   (max score 5000, 10 submissions/IP/60s, sanitised names) — not prevented. This is a
   portfolio toy, not a tournament.

## Why the GitHub API is stubbed

The site fetches profile/repos/events from `api.github.com` on **every load**, with no
auth — GitHub allows **60 req/hr per IP**. Running the suite a few times exhausts that
quota and the run starts 403ing, which made "did it pass?" a question about GitHub's
rate limiter rather than about this site. `boot()` stubs those endpoints so runs are
hermetic and repeatable. The real-failure path is asserted deliberately in the
third-party degradation tests instead of being left to chance.
