# How ponce-os is tested

Latest pass/fail numbers live in [`TEST_RESULTS.md`](./TEST_RESULTS.md). This file is the
*how* and the *why*. ponce-os owns its test dependencies outright — it never borrows from
another project.

## Run everything

```bash
npm test            # unit + e2e (this is the pre-push gate)
```

## Run one layer

```bash
npm run test:unit   # Vitest — pure logic, ~1s
npm run test:e2e    # Playwright — real browser, desktop + mobile, ~5-7 min
```

`test:e2e` builds the **production bundle** and serves it, so what gets tested is what
Vercel actually ships. `vite dev` tolerates things the production build rejects — that is
why the e2e suite never points at the dev server.

## Also run before pushing

```bash
npx tsc --noEmit -p tsconfig.app.json   # typecheck
npm run build                            # production build must succeed
```

## The two local servers are NOT interchangeable

| Port | Command | Serves `/api`? | Use for |
|---|---|---|---|
| **:8080** | `npm run dev` | ❌ **no** | UI / game work (fast HMR) |
| **:3100** | `npx vercel dev --listen 3100` | ✅ **yes** | anything touching the leaderboard |

**The trap:** on `:8080` the leaderboard does not error. It silently falls back to
localStorage — the board populates, scores persist, everything *looks* correct. That
fallback is deliberate (the game must survive a backend outage), but it means **:8080 can
never tell you whether the backend works.** Use `:3100`, or:

```bash
curl -s http://localhost:3100/api/leaderboard
```

`vercel dev` needs the project linked first, or it 503s:

```bash
npx vercel link --project poncema4-github-io
npx vercel env pull .env.local     # never hand-paste secrets
```

Do **not** run `vercel dev --yes` unlinked — it silently *creates a new junk project*
rather than linking, and the function then runs with an empty env.

## Test layers, and why each exists

**Unit (Vitest) — `src/**/*.test.ts`**
Pure, deterministic logic only. The catch table, weighted selection, board ranking, name
sanitising. The load-bearing one is the **difficulty→points invariant**: a harder fish must
always score more. That rule is easy to break silently while tuning, and no visual check
would catch it.

**E2E (Playwright) — `tests/e2e/`**
Every test runs on **both** projects: `desktop` (Desktop Chrome) and `mobile` (Pixel 5).
Covers the shell, the cast minigame, the mobile tap→focus chain, the leaderboard's offline
fallback, third-party degradation, and regressions on what already shipped (`breach`, the
`resume` PDF, a clean console).

**Backend — manual, against real Upstash**
`vite preview` has no `/api`, so the e2e suite cannot reach the function. The API is
verified through `vercel dev` against the real database. Results in `TEST_RESULTS.md`.

## The GitHub API is stubbed, on purpose

The site fetches profile/repos/events from `api.github.com` on **every load**, unauthenticated
— GitHub allows **60 req/hr per IP**. Running the suite a few times exhausts that quota and
the run starts 403ing, which makes "did it pass?" a question about GitHub's rate limiter
rather than about this site. `boot()` stubs those endpoints so runs are hermetic.

The real-failure path is not ignored — it is asserted deliberately in
**third-party degradation**: the site must boot and stay fully usable when GitHub 403s or is
unreachable. That is a real scenario (shared/corporate NAT, GitHub outage).

This distinction matters: stubbing a flaky dependency is not the same as loosening an
assertion until it stops complaining. Never "fix" a red test by weakening what it checks.

## What these tests do NOT prove

Stated plainly so nobody reads more into a green run than is there:

1. **That a phone's on-screen keyboard physically appears.** That is an OS surface Playwright
   cannot observe. What IS proven is the chain that causes it — a tap must land focus on the
   input, since mobile browsers open the keyboard when `.focus()` runs inside a trusted user
   gesture. A regression (an overlay eating the tap, a z-index change) WOULD be caught. This
   is exactly how the launch-button bug was found: the depth gauge was silently swallowing
   taps on mobile.
2. **Real iOS Safari.** `mobile` is Pixel 5 = Chromium. For genuine Safari coverage:
   `npx playwright install webkit`, then switch to `devices["iPhone 13"]` in
   `playwright.config.ts`.
3. **That scores are trustworthy.** The leaderboard is public and unauthenticated, so it is
   spoofable. Mitigated (max score 5000, 10 submissions/IP/60s, sanitised names) — not
   prevented. It is a portfolio toy, not a tournament.

## Artifacts

Traces/screenshots from failures land in `tests/test-results/` (gitignored). On a failure,
Playwright writes an `error-context.md` per test — read it before guessing at a cause.
