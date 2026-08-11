import { describe, it, expect } from "vitest";
import { TABLE, pickFrom, rarityColor, biteWindowMs, fightMul, reelTargetMs } from "./fishing";

// Unit tests for the parts that can be WRONG WHILE GREEN — the catch table and the
// weighted roll. A rendering bug you see; a rigged probability table you don't.
// (This is the FlightDeck pricing lesson: a passing test proves the code matches the
// expectation, never that the expectation is right. So assert against intent, out loud.)

describe("catch table", () => {
  it("every entry is well formed", () => {
    for (const { c, w } of TABLE) {
      expect(w, `${c.name} weight`).toBeGreaterThan(0);
      expect(c.name.length, `${c.name} has a name`).toBeGreaterThan(0);
      expect(c.art.length, `${c.name} has art`).toBeGreaterThan(0);
      expect(c.line.length, `${c.name} has a flavour line`).toBeGreaterThan(0);
    }
  });

  it("the kraken is genuinely rare — rarer than everything else", () => {
    const kraken = TABLE.find((e) => e.c.name === "THE KRAKEN")!;
    const others = TABLE.filter((e) => e.c.name !== "THE KRAKEN");
    for (const o of others) {
      expect(kraken.w, `kraken must be rarer than ${o.c.name}`).toBeLessThanOrEqual(o.w);
    }
  });

  it("the phish is the only negative — striking it should cost you", () => {
    const negatives = TABLE.filter((e) => e.c.pts < 0);
    expect(negatives).toHaveLength(1);
    expect(negatives[0].c.rarity).toBe("phish");
  });

  it("rarer catches are worth more than common ones", () => {
    const common = Math.max(...TABLE.filter((e) => e.c.rarity === "common").map((e) => e.c.pts));
    const legendary = Math.min(...TABLE.filter((e) => e.c.rarity === "legendary").map((e) => e.c.pts));
    expect(legendary).toBeGreaterThan(common);
  });

  it("has enough species for the flag to be earnable", () => {
    // the flag gates on 6 unique species — the table must be able to deliver that
    expect(TABLE.length).toBeGreaterThanOrEqual(6);
  });

  it("ships ~20+ distinct species with unique art", () => {
    expect(TABLE.length).toBeGreaterThanOrEqual(20);
    const names = TABLE.map((e) => e.c.name);
    const art = TABLE.map((e) => e.c.art);
    expect(new Set(names).size, "no duplicate names").toBe(names.length);
    expect(new Set(art).size, "every species looks different").toBe(art.length);
  });

  it("⭐ POINTS SCALE WITH DIFFICULTY — nothing valuable is easy", () => {
    // this is THE design invariant. if someone adds a 90-point sardine, this fails.
    const real = TABLE.filter((e) => e.c.rarity !== "phish");  // the phish is negative by design
    for (const a of real) {
      for (const b of real) {
        if (a.c.diff < b.c.diff) {
          expect(a.c.pts, `${a.c.name}(d${a.c.diff}) must be worth less than ${b.c.name}(d${b.c.diff})`)
            .toBeLessThan(b.c.pts);
        }
      }
    }
  });

  it("every species has a sane difficulty (1..7)", () => {
    for (const { c } of TABLE) {
      expect(c.diff, `${c.name} diff`).toBeGreaterThanOrEqual(1);
      expect(c.diff, `${c.name} diff`).toBeLessThanOrEqual(7);
    }
  });
});

describe("difficulty curves", () => {
  it("harder fish give you LESS time to strike", () => {
    expect(biteWindowMs(7)).toBeLessThan(biteWindowMs(1));
    // but never so little that it's unfair/impossible for a human
    expect(biteWindowMs(7)).toBeGreaterThanOrEqual(400);
  });

  it("harder fish fight HARDER", () => {
    expect(fightMul(7)).toBeGreaterThan(fightMul(1));
  });

  it("harder fish take LONGER to reel", () => {
    expect(reelTargetMs(7)).toBeGreaterThan(reelTargetMs(1));
  });

  it("the curves are monotonic across the whole range", () => {
    for (let d = 1; d < 7; d++) {
      expect(biteWindowMs(d + 1)).toBeLessThanOrEqual(biteWindowMs(d));
      expect(fightMul(d + 1)).toBeGreaterThan(fightMul(d));
      expect(reelTargetMs(d + 1)).toBeGreaterThan(reelTargetMs(d));
    }
  });

  it("every rarity has a colour", () => {
    for (const { c } of TABLE) {
      expect(rarityColor(c.rarity), `${c.rarity} colour`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("weighted roll", () => {
  it("always returns a real entry from the table", () => {
    const names = new Set(TABLE.map((e) => e.c.name));
    for (let i = 0; i < 500; i++) {
      expect(names.has(pickFrom(TABLE, Math.random()).name)).toBe(true);
    }
  });

  it("is deterministic for a given roll value (so it is testable at all)", () => {
    expect(pickFrom(TABLE, 0).name).toBe(pickFrom(TABLE, 0).name);
    expect(pickFrom(TABLE, 0.999).name).toBe(pickFrom(TABLE, 0.999).name);
  });

  it("respects the weights — common fish beat the kraken over many rolls", () => {
    const counts: Record<string, number> = {};
    for (let i = 0; i < 4000; i++) {
      const c = pickFrom(TABLE, i / 4000);   // sweep the whole 0..1 range evenly
      counts[c.name] = (counts[c.name] || 0) + 1;
    }
    expect(counts["sardine"] ?? 0).toBeGreaterThan(counts["THE KRAKEN"] ?? 0);
  });

  it("never returns undefined at the extremes", () => {
    expect(pickFrom(TABLE, 0)).toBeDefined();
    expect(pickFrom(TABLE, 1)).toBeDefined();
  });
});
