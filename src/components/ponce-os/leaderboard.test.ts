import { describe, it, expect } from "vitest";
import { mergeBoard, cleanName } from "./leaderboard";

// Ranking + name handling. Both are the kind of logic that looks fine on screen and is
// quietly wrong — a stable sort you assumed, a name that was actually markup.

describe("mergeBoard", () => {
  it("sorts high to low", () => {
    const r = mergeBoard([{ name: "a", score: 5 }, { name: "b", score: 50 }, { name: "c", score: 20 }]);
    expect(r.map((e) => e.name)).toEqual(["b", "c", "a"]);
  });

  it("keeps only each player's BEST score", () => {
    const r = mergeBoard([
      { name: "marco", score: 10 },
      { name: "marco", score: 90 },
      { name: "marco", score: 40 },
    ]);
    expect(r).toHaveLength(1);
    expect(r[0].score).toBe(90);
  });

  it("caps at 10 entries", () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ name: `p${i}`, score: i }));
    expect(mergeBoard(many)).toHaveLength(10);
  });

  it("keeps the TOP 10, not the first 10", () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ name: `p${i}`, score: i }));
    const top = mergeBoard(many);
    expect(top[0].score).toBe(39);
    expect(top[9].score).toBe(30);
  });

  it("breaks ties deterministically (no jitter between renders)", () => {
    const a = mergeBoard([{ name: "zoe", score: 10 }, { name: "abe", score: 10 }]);
    const b = mergeBoard([{ name: "abe", score: 10 }, { name: "zoe", score: 10 }]);
    expect(a).toEqual(b);
    expect(a[0].name).toBe("abe");
  });

  it("handles an empty board", () => {
    expect(mergeBoard([])).toEqual([]);
  });
});

describe("cleanName", () => {
  it("strips markup so a name can never inject", () => {
    expect(cleanName('<img src=x onerror=alert(1)>')).not.toContain("<");
    expect(cleanName('"><script>')).not.toContain("<");
  });

  it("caps length", () => {
    expect(cleanName("a".repeat(100)).length).toBeLessThanOrEqual(14);
  });

  it("falls back to anon for empty/whitespace", () => {
    expect(cleanName("")).toBe("anon");
    expect(cleanName("   ")).toBe("anon");
  });

  it("leaves a normal name alone", () => {
    expect(cleanName("marco")).toBe("marco");
  });
});
