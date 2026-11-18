import { useEffect, useState } from "react";
import { data } from "../data/math";
import { Dialog } from "../components/Dialog";
import { remember } from "../lib/navigation";
type Lesson = (typeof data.lessons)[number];
function MathStages({ open }: { open: (id: string) => void }) {
  return (
    <>
      {data.stages.map((stage) => {
        const locked = stage.state === "locked";
        const Tag = locked ? "div" : "button";
        return (
          <Tag
            key={stage.id}
            type={locked ? undefined : "button"}
            className={`path-stage is-${stage.state}`}
            aria-label={`Chặng ${stage.number}, ${stage.planetName}: ${stage.title}, ${locked ? "chưa mở khóa" : stage.state === "current" ? "đang học" : "đã hoàn thành"}`}
            aria-disabled={locked || undefined}
            aria-current={stage.state === "current" ? "step" : undefined}
            onClick={
              locked
                ? undefined
                : () => {
                    if (stage.id === "numbers") location.assign("./mercury/");
                    else
                      open(
                        data.lessons.some((lesson) => lesson.id === stage.id)
                          ? stage.id
                          : data.lessons[0].id,
                      );
                  }
            }
          >
            <span className="path-stage__planet" aria-hidden="true">
              <img
                src={`./assets/planet-${stage.planet}.svg`}
                alt=""
                width="96"
                height="96"
              />
              {(stage.state === "completed" || locked) && (
                <span className="path-stage__badge">
                  {locked ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="5" y="10" width="14" height="11" rx="3" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
                    </svg>
                  ) : (
                    "✓"
                  )}
                </span>
              )}
            </span>
            <span className="path-stage__label">
              <strong className="path-stage__name">{stage.planetName}</strong>
              <span className="path-stage__title">{stage.title}</span>
            </span>
          </Tag>
        );
      })}
    </>
  );
}
function LessonCards({ open }: { open: (id: string) => void }) {
  return (
    <>
      {data.lessons.map((lesson) => (
        <article key={lesson.id} className="lesson-card">
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>
          <button
            type="button"
            className="lesson-card__open"
            data-open-lesson={lesson.id}
            aria-label={`Mở bài ${lesson.title}`}
            onClick={() => open(lesson.id)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </button>
          <div className="lesson-card__visual" aria-hidden="true">
            {lesson.visual === "equation"
              ? ["2", "+", "3"].map((symbol) => (
                  <span key={symbol} className="equation-block">
                    {symbol}
                  </span>
                ))
              : ["triangle", "square", "circle"].map((shape) => (
                  <span key={shape} className={`shape shape--${shape}`} />
                ))}
          </div>
        </article>
      ))}
    </>
  );
}
export function useMath() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const openLesson = (id: string) => {
    const item = data.lessons.find((item) => item.id === id);
    if (item) {
      remember("math", id);
      setLesson(item);
    }
  };
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("lesson");
    const id = data.lessons.some((item) => item.id === query)
      ? query!
      : data.currentStageId;
    remember("math", id);
    if (query === id)
      setLesson(data.lessons.find((item) => item.id === id) || null);
  }, []);
  const challenge = data.quickChallenge;
  const completed = data.stages.filter(
    (stage) => stage.state === "completed",
  ).length;
  return {
    openLesson,
    stages: <MathStages open={openLesson} />,
    lessons: <LessonCards open={openLesson} />,
    challenge,
    options: challenge.options.map((answer) => (
      <button
        key={answer}
        type="button"
        className={`answer-button${answer === wrong ? " is-wrong" : answer === challenge.answer && correct ? " is-correct" : ""}`}
        onClick={() => {
          if (answer === challenge.answer) {
            setCorrect(true);
            setWrong(null);
          } else setWrong(answer);
        }}
      >
        {answer}
      </button>
    )),
    feedback:
      wrong !== null
        ? "Chưa đúng, thử lại một lần nữa nhé!"
        : correct
          ? `Chính xác! ${challenge.left} + ${challenge.right} = ${challenge.answer}.`
          : "Chọn đáp án đúng nhé!",
    currentStage: data.stages.find(
      (stage) => stage.id === data.currentStageId && stage.state === "current",
    ),
    completed,
    total: data.stages.length,
    progressNote: `Đã hoàn thành ${completed}/${data.stages.length} chặng.`,
    goal: data.dailyGoal,
    isDemo: data.isDemo,
    segments: Array.from({ length: data.dailyGoal.total }, (_, index) => (
      <span
        key={index}
        className={`math-goal__segment${index < data.dailyGoal.completed ? " is-complete" : ""}`}
      />
    )),
    dialog: (
      <Dialog
        open={lesson !== null}
        onClose={() => setLesson(null)}
        title={lesson?.title || ""}
        id="math-dialog-title"
        dataAttribute="data-math-dialog"
        backLabel="Quay lại hành tinh"
      >
        <p className="math-dialog__summary">{lesson?.detail}</p>
      </Dialog>
    ),
  };
}
