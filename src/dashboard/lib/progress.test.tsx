import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  normalizeProgress,
  readProgress,
  saveProgress,
  topicWords,
} from "./progress";
import { mercuryKey, readMercuryScores } from "./mercury-progress";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});
describe("vocabulary progress", () => {
  it("rejects unknown words, duplicates and unearned rewards/results", () => {
    const progress = normalizeProgress("animals", {
      learned: ["dog", "dog", "unknown"],
      current: "unknown",
      rewarded: true,
      results: { quiz: { score: 10, completedAt: "2026-10-22T00:00:00Z" } },
    });
    expect(progress).toEqual({
      learned: ["dog"],
      current: "dog",
      rewarded: false,
      results: {},
    });
  });
  it("preserves completed lessons and valid results across reloads", () => {
    const progress = normalizeProgress("fruit", {
      learned: topicWords.fruit.map((word) => word.id),
      current: "pear",
      rewarded: true,
      results: {
        practice: { score: 9, completedAt: "2026-10-22T00:00:00Z" },
        quiz: { score: 99, completedAt: "invalid" },
      },
    });
    expect(saveProgress("fruit", progress)).toBe(true);
    expect(readProgress("fruit")).toEqual(progress);
    expect(readProgress("fruit").results.quiz).toBeUndefined();
    expect(readProgress("animals").learned).toEqual([]);
  });
  it("recovers from malformed data and blocked storage", () => {
    localStorage.setItem("futurelearn.english.colors.v1", "{broken");
    expect(readProgress("colors").learned).toEqual([]);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw Error("blocked");
    });
    expect(readProgress("colors").current).toBe("red");
    expect(saveProgress("colors", normalizeProgress("colors", null))).toBe(
      false,
    );
  });
});
describe("Mercury progress migration", () => {
  it("preserves completed missions from both earlier scoring versions", () => {
    localStorage.setItem("futurelearn.math.mercury.v1", "[5,5,2,4,5,5]");
    expect(readMercuryScores()).toEqual([10, 10, 2, 0, 0, 0]);
    localStorage.clear();
    localStorage.setItem("futurelearn.math.mercury.v2", "[10,5,5,1,0,0]");
    expect(readMercuryScores()).toEqual([10, 10, 10, 1, 0, 0]);
  });
  it("enforces ordered unlocks and validates score bounds", () => {
    localStorage.setItem(mercuryKey, "[10,10,3,10,10,10]");
    expect(readMercuryScores()).toEqual([10, 10, 3, 0, 0, 0]);
    localStorage.setItem(mercuryKey, '[10,11,-1,0.5,"10",null]');
    expect(readMercuryScores()).toEqual([10, 0, 0, 0, 0, 0]);
    localStorage.setItem(mercuryKey, "broken");
    expect(readMercuryScores()).toEqual([0, 0, 0, 0, 0, 0]);
  });
});
