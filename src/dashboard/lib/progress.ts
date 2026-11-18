import { words as animals } from "../data/animals";
import { words as fruit } from "../data/fruit";
import { words as colors } from "../data/colors";
export const topicWords = { animals, fruit, colors };
export type TopicId = keyof typeof topicWords;
export type Word = (typeof animals)[number];
export type ExerciseMode = "practice" | "quiz";
export type LessonProgress = {
  learned: string[];
  current: string;
  rewarded: boolean;
  results: Partial<
    Record<ExerciseMode, { score: number; completedAt: string }>
  >;
};
export const progressKey = (topic: TopicId) =>
  `futurelearn.english.${topic}.v1`;
export function normalizeProgress(
  topic: TopicId,
  value: unknown,
): LessonProgress {
  const ids = topicWords[topic].map((word) => word.id);
  const source = (
    value && typeof value === "object" ? value : {}
  ) as Partial<LessonProgress>;
  const learned = [
    ...new Set(
      Array.isArray(source.learned)
        ? source.learned.filter((id) => ids.includes(id))
        : [],
    ),
  ];
  const results: LessonProgress["results"] = {};
  for (const mode of ["practice", "quiz"] as const) {
    const result = source.results?.[mode];
    if (
      learned.length === ids.length &&
      result &&
      Number.isInteger(result.score) &&
      result.score >= 0 &&
      result.score <= ids.length &&
      typeof result.completedAt === "string" &&
      Number.isFinite(Date.parse(result.completedAt))
    )
      results[mode] = result;
  }
  return {
    learned,
    current:
      typeof source.current === "string" && ids.includes(source.current)
        ? source.current
        : ids[0],
    rewarded: learned.length === ids.length && source.rewarded === true,
    results,
  };
}
export function readProgress(topic: TopicId) {
  try {
    return normalizeProgress(
      topic,
      JSON.parse(localStorage.getItem(progressKey(topic)) || "null"),
    );
  } catch {
    return normalizeProgress(topic, null);
  }
}
export function saveProgress(topic: TopicId, state: LessonProgress) {
  try {
    localStorage.setItem(
      progressKey(topic),
      JSON.stringify(normalizeProgress(topic, state)),
    );
    return true;
  } catch {
    return false;
  }
}
