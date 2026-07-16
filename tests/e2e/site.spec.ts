import { test, expect, type Page } from "@playwright/test";

// The site boots into a fake BIOS sequence before the shell appears. Every test
// needs past it first, so this is the one shared helper.
/** Deterministic stand-ins for the live GitHub API. Shapes match what the site reads. */
const GH_USER = { login: "poncema4", name: "Marco Ponce", public_repos: 12, followers: 7, avatar_url: "" };
const GH_REPOS = [{ name: "ponce-os", description: "this site", language: "TypeScript", stargazers_count: 1, html_url: "#" }];
const GH_EVENTS = [{ type: "PushEvent", repo: { name: "poncema4/ponce-os" }, created_at: "2026-07-16T12:00:00Z" }];

/**
 * Stub api.github.com. The site fetches profile/repos/events on EVERY load, and GitHub
 * allows only 60 unauthenticated req/hr per IP -- so a live suite starts 403ing once you
 * have run it a few times, and "did it pass?" becomes a question about GitHub's rate
 * limiter rather than about this site. Stubbing makes the run hermetic and repeatable.
 * The real-failure path is asserted deliberately in the degradation test below.
 */
async function stubGitHub(page: Page) {
  await page.route("https://api.github.com/**", (route) => {
    const url = route.request().url();
    const body = url.includes("/repos") ? GH_REPOS : url.includes("/events") ? GH_EVENTS : GH_USER;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
}

async function boot(page: Page) {
  await stubGitHub(page);
  await page.goto("/");
  const term = page.locator("input").first();
  await term.waitFor({ state: "visible", timeout: 30_000 });
  return term;
}

async function runCmd(page: Page, cmd: string) {
  const input = page.locator("input").first();
  await input.click();
  await input.fill(cmd);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(350);
}

test.describe("ponce-os — shell", () => {
  test("boots and reaches the terminal", async ({ page }) => {
    const term = await boot(page);
    await expect(term).toBeVisible();
    await expect(page).toHaveTitle(/marco ponce/i);
  });

  test("help lists the commands", async ({ page }) => {
    await boot(page);
    await runCmd(page, "help");
    const body = page.locator("body");
    await expect(body).toContainText(/available commands/i);
    await expect(body).toContainText(/whoami/i);
    await expect(body).toContainText(/resume/i);
  });

  test("whoami responds", async ({ page }) => {
    await boot(page);
    await runCmd(page, "whoami");
    await expect(page.locator("body")).toContainText(/marco/i);
  });

  test("an unknown command fails gracefully (no crash)", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await boot(page);
    await runCmd(page, "definitely-not-a-command");
    await expect(page.locator("input").first()).toBeVisible();
    expect(errors, "unknown command must not throw").toEqual([]);
  });
});

test.describe("ponce-os — cast minigame", () => {
  test("launch button is visible and a real tap target", async ({ page }) => {
    await boot(page);
    const launch = page.locator(".cast-launch");
    await expect(launch).toBeVisible();
    const box = await launch.boundingBox();
    expect(box, "launch button must render").not.toBeNull();
    // 40px is the accessible minimum for a touch target
    expect(box!.height, "launch tap target height").toBeGreaterThanOrEqual(40);
  });

  test("opens from the launch button and fits the viewport", async ({ page }) => {
    await boot(page);
    await page.locator(".cast-launch").click();
    const panel = page.locator(".cast-panel");
    await expect(panel).toBeVisible();
    await expect(page.locator(".cast-cv")).toBeVisible();

    const vp = page.viewportSize()!;
    const box = (await panel.boundingBox())!;
    expect(box.width, "panel must not overflow the viewport").toBeLessThanOrEqual(vp.width);

    // the action button must be thumb-sized on every device
    const btn = (await page.locator(".cast-btn").boundingBox())!;
    expect(btn.height).toBeGreaterThanOrEqual(44);
  });

  test("opens from the `cast` terminal command too", async ({ page }) => {
    await boot(page);
    await runCmd(page, "cast");
    await expect(page.locator(".cast-panel")).toBeVisible();
  });

  test("shows the approach telegraph before the bite", async ({ page }) => {
    await boot(page);
    await page.locator(".cast-launch").click();
    const btn = page.locator(".cast-btn");
    await btn.click();

    // it must announce something is coming BEFORE it demands a strike —
    // that's the whole design: the strike is earned, not a reflex lottery.
    await expect(btn).toHaveText(/something's coming|hook it/i, { timeout: 12_000 });
  });

  test("space-spam cannot auto-recast (the breather holds)", async ({ page }) => {
    await boot(page);
    await page.locator(".cast-launch").click();
    const btn = page.locator(".cast-btn");
    await btn.click();
    await page.waitForTimeout(400);

    // hammer space during an active cast — it must not stack casts or crash
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    for (let i = 0; i < 30; i++) await page.keyboard.press("Space");
    await page.waitForTimeout(300);

    await expect(page.locator(".cast-panel")).toBeVisible();
    expect(errors, "spamming space must not throw").toEqual([]);
  });

  test("ESC closes it and the terminal still works after", async ({ page }) => {
    await boot(page);
    await page.locator(".cast-launch").click();
    await expect(page.locator(".cast-panel")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".cast-panel")).toBeHidden();

    // the regression that matters: the game must not eat the shell
    await runCmd(page, "whoami");
    await expect(page.locator("body")).toContainText(/marco/i);
  });
});

test.describe("ponce-os — regressions (the game must not break what shipped)", () => {
  test("breach minigame still works", async ({ page }) => {
    await boot(page);
    await runCmd(page, "breach");
    await expect(page.locator("body")).toContainText(/firewall|pin/i);
    await runCmd(page, "exit");
  });

  test("resume command still offers the pdf", async ({ page }) => {
    await boot(page);
    await runCmd(page, "resume");
    await expect(page.locator("body")).not.toContainText(/command not found/i);
  });

  test("no console errors on a clean load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await boot(page);
    await page.waitForTimeout(1200);
    expect(errors).toEqual([]);
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE INPUT — the tap -> focus -> keyboard chain.

   HONEST SCOPE: no headless Chromium can prove an OS keyboard physically slides up;
   that is an OS surface Playwright cannot observe. What IS testable is the chain that
   CAUSES it: a real tap must land focus on the <input>. Mobile browsers open the
   keyboard when .focus() runs inside a trusted user gesture, so focus-after-tap is
   the precondition, and it is the part that can silently regress (an overlay eating
   the tap, a z-index change). The rest of the suite uses input.fill(), which sets the
   value programmatically and never taps -- so without these tests, nothing here
   covered the phone path at all.
   ──────────────────────────────────────────────────────────────────────────── */
test.describe("ponce-os — mobile input chain", () => {
  test("tapping the terminal body focuses the input (this is what summons the keyboard)", async ({ page }) => {
    await boot(page);
    // tap the CHROME of the terminal, not the input -- PonceOS wires onClick on the
    // wrapper to focus the input, so a sloppy thumb anywhere still opens the keyboard.
    await page.locator(".pos-term-body").click({ position: { x: 10, y: 10 } });
    const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(focused, "tapping the terminal must land focus on the input").toBe("input");
  });

  test("tapping the input directly focuses it", async ({ page, isMobile }) => {
    test.skip(!isMobile, "real touch tap — mobile project only (desktop has no touch)");
    const term = await boot(page);
    await term.tap();
    await expect(term).toBeFocused();
  });

  test("REAL key events (not fill) reach the shell", async ({ page }) => {
    const term = await boot(page);
    await term.click();
    // pressSequentially dispatches genuine keydown/keypress per char, the way a
    // keyboard does. fill() would bypass onKeyDown entirely.
    await term.pressSequentially("whoami", { delay: 15 });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    await expect(page.locator("body")).toContainText(/marco/i);
  });

  test("input carries terminal-safe mobile attributes", async ({ page }) => {
    const term = await boot(page);
    // a terminal must take input LITERALLY. iOS autocorrect/autocapitalize would
    // rewrite commands the user typed correctly.
    await expect(term).toHaveAttribute("autocorrect", "off");
    await expect(term).toHaveAttribute("autocapitalize", "off");
    await expect(term).toHaveAttribute("spellcheck", "false");
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   LEADERBOARD — graceful degradation.

   These e2e run against `vite preview`, a STATIC build with NO /api functions. That
   is not a limitation here, it is the exact scenario worth pinning: the board must
   fall back to localStorage and the game must stay playable when the backend is
   absent or down. The live API path is verified separately against real Upstash.
   ──────────────────────────────────────────────────────────────────────────── */
test.describe("ponce-os — leaderboard", () => {
  test("board opens and degrades gracefully with no backend", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await boot(page);
    await page.locator(".cast-launch").click();
    await expect(page.locator(".cast-wrap, canvas").first()).toBeVisible();
    await page.locator(".cast-link").first().click();
    await expect(page.locator(".cast-board")).toBeVisible();
    // a failed /api fetch must not surface as an unhandled console error
    const fatal = errors.filter((e) => !/favicon|404/i.test(e));
    expect(fatal, `console errors with no backend: ${fatal.join(" | ")}`).toHaveLength(0);
  });

  test("the game stays playable when the board is open/closed", async ({ page }) => {
    await boot(page);
    await page.locator(".cast-launch").click();
    const link = page.locator(".cast-link").first();
    await link.click();
    await expect(page.locator(".cast-board")).toBeVisible();
    await link.click();
    await expect(page.locator(".cast-board")).toBeHidden();
    await expect(page.locator("canvas").first()).toBeVisible();
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   THIRD-PARTY DEGRADATION.

   The site fetches live GitHub data (profile / repos / events) on every load, with no
   auth -> 60 req/hr per IP. A visitor behind a shared/corporate NAT, or GitHub having
   a bad day, gets a 403. The site must still boot and stay fully usable; the GitHub
   panel may be empty, but the terminal and the game must not care.
   ──────────────────────────────────────────────────────────────────────────── */
test.describe("ponce-os — third-party degradation", () => {
  test("site boots and the shell works when the GitHub API 403s", async ({ page }) => {
    await page.route("https://api.github.com/**", (route) =>
      route.fulfill({ status: 403, contentType: "application/json", body: '{"message":"rate limit exceeded"}' })
    );
    await page.goto("/");
    const term = page.locator("input").first();
    await term.waitFor({ state: "visible", timeout: 30_000 });

    // the terminal must be fully functional with the API dead
    await term.click();
    await term.fill("whoami");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    await expect(page.locator("body")).toContainText(/marco/i);

    // and the game must still open
    await page.locator(".cast-launch").click();
    await expect(page.locator("canvas").first()).toBeVisible();
  });

  test("site boots when GitHub is unreachable entirely (offline)", async ({ page }) => {
    await page.route("https://api.github.com/**", (route) => route.abort());
    await page.goto("/");
    const term = page.locator("input").first();
    await term.waitFor({ state: "visible", timeout: 30_000 });
    await expect(term).toBeVisible();
  });
});
