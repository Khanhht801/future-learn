import { useEffect, useState, type CSSProperties } from "react";
import { data } from "../data/english";
import { readProgress, type TopicId } from "../lib/progress";
import { remember } from "../lib/navigation";
import { Dialog } from "../components/Dialog";
type Topic = (typeof data.topics)[number];
function topicsWithProgress() {
  return data.topics.map((topic) => ({
    ...topic,
    completed: readProgress(topic.id as TopicId).learned.length,
  }));
}
function openTopic(topic: Topic) {
  remember("english", topic.id);
  location.assign(`./${topic.id}/`);
}
function TopicCard({ topic }: { topic: Topic }) {
  const completed = topic.completed >= topic.total;
  const label = completed
    ? "Đã hoàn thành"
    : topic.completed > 0
      ? "Đang học"
      : "Chưa bắt đầu";
  return (
    <article className="topic-card" id={`topic-${topic.id}`}>
      <button
        className="topic-card__open"
        type="button"
        aria-label={`Học chủ đề ${topic.title}, ${topic.completed}/${topic.total} từ`}
        onClick={() => openTopic(topic)}
      >
        <div className="topic-card__media">
          <img
            className="topic-card__image"
            src={topic.image}
            alt=""
            width="720"
            height="480"
            loading="lazy"
          />
          <span
            className={`topic-status${completed ? " topic-status--completed" : topic.completed ? "" : " topic-status--new"}`}
          >
            {label}
          </span>
        </div>
        <div className="topic-card__body">
          <h3>{topic.title}</h3>
          <p className="topic-card__description">{topic.description}</p>
          <div className="topic-card__progress">
            <progress
              value={topic.completed}
              max={topic.total}
              aria-label={`Tiến độ chủ đề ${topic.title}`}
            />
            <span className="topic-card__count">
              {topic.completed}/{topic.total} từ
            </span>
          </div>
        </div>
        <span className="topic-card__action">
          <span data-topic-action>
            {completed
              ? "Ôn lại chủ đề"
              : topic.completed
                ? "Tiếp tục khám phá"
                : "Khám phá chủ đề"}
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5" />
          </svg>
        </span>
      </button>
    </article>
  );
}
export function useEnglish() {
  const [topics, setTopics] = useState(topicsWithProgress);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const refresh = () => setTopics(topicsWithProgress());
    const query = new URLSearchParams(location.search).get("topic");
    const topic = topics.find((item) => item.id === query);
    remember("english", topic?.id || data.resumeTopicId);
    if (topic) openTopic(topic);
    window.addEventListener("storage", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);
  const topic =
    topics.find((item) => item.id === data.resumeTopicId) || topics[0];
  const remaining = Math.max(0, topic.total - topic.completed);
  const goal = data.dailyGoal;
  return {
    cards: topics.map((topic) => <TopicCard key={topic.id} topic={topic} />),
    topic,
    count: `${topic.completed}/${topic.total} từ`,
    note: remaining
      ? `Còn ${remaining} từ nữa để hoàn thành chủ đề ${topic.title}.`
      : "Bạn đã hoàn thành chủ đề này. Cùng ôn lại để nhớ lâu hơn nhé!",
    resume: () => openTopic(topic),
    showTopics: () => setShowAll(true),
    goal,
    wordsLearned: data.wordsLearned,
    goalText: `${goal.completed} trên ${goal.total} chủ đề`,
    goalStyle: {
      "--goal-percent": goal.total
        ? Math.min(100, (goal.completed / goal.total) * 100)
        : 0,
    } as CSSProperties,
    goalNote:
      goal.completed >= goal.total
        ? "Bạn đã hoàn thành mục tiêu hôm nay!"
        : `Còn ${goal.total - goal.completed} chủ đề nữa, cố lên nào!`,
    isDemo: data.isDemo,
    dialog: (
      <Dialog
        open={showAll}
        onClose={() => setShowAll(false)}
        title="Tất cả chủ đề"
        id="topic-dialog-title"
        dataAttribute="data-topic-dialog"
        backLabel="Quay lại đảo"
      >
        <div className="topic-dialog__list">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className="topic-dialog__topic"
              onClick={() => openTopic(topic)}
            >
              <img src={topic.image} alt="" width="720" height="480" />
              <span>
                {topic.title} · {topic.total} từ
              </span>
            </button>
          ))}
        </div>
      </Dialog>
    ),
  };
}
