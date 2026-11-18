export const mercuryKey = "futurelearn.math.mercury.v3";
export function readMercuryScores(): number[] {
  const scores = [0, 0, 0, 0, 0, 0];
  try {
    const current = localStorage.getItem(mercuryKey);
    const previous =
      current === null
        ? localStorage.getItem("futurelearn.math.mercury.v2")
        : null;
    const legacy = current === null && previous === null;
    const saved: unknown = JSON.parse(
      current !== null
        ? current
        : previous !== null
          ? previous
          : localStorage.getItem("futurelearn.math.mercury.v1") || "null",
    );
    if (Array.isArray(saved) && saved.length === scores.length) {
      for (let i = 0; i < saved.length; i++) {
        const n: unknown = saved[i];
        const limit = current !== null ? 10 : legacy || i !== 0 ? 5 : 10;
        scores[i] =
          typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= limit
            ? current === null && n === limit
              ? 10
              : n
            : 0;
        if (i > 0 && scores[i - 1] < 10) scores[i] = 0;
      }
    }
  } catch {
    /* Storage is optional. */
  }
  return scores;
}
