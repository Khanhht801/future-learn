import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useDialog } from "../components/Dialog";
import { useSpeech } from "../hooks/useSpeech";
import { useFullscreen } from "../hooks/useFullscreen";
import { useDragScroll } from "../hooks/useDragScroll";
import {
  progressKey,
  readProgress,
  saveProgress,
  topicWords,
  type ExerciseMode,
  type LessonProgress,
  type TopicId,
} from "../lib/progress";
import { remember } from "../lib/navigation";
type Mode = "learn" | ExerciseMode;
const topics = {
  animals: {
    title: "Thế giới động vật",
    label: "Động vật",
    noun: "động vật",
    description: "Luyện nghe và chọn hình để nhớ các bạn động vật lâu hơn nhé!",
  },
  fruit: {
    title: "Vườn trái cây",
    label: "Trái cây",
    noun: "trái cây",
    description:
      "Luyện nghe và chọn hình để nhớ các loại trái cây lâu hơn nhé!",
  },
  colors: {
    title: "Thế giới màu sắc",
    label: "Màu sắc",
    noun: "màu sắc",
    description: "Luyện nghe và chọn hình để nhớ các màu lâu hơn nhé!",
  },
};
function AnswerDialog({
  feedback,
  dismiss,
  last,
}: {
  feedback: { correct: boolean; en: string; vi: string } | null;
  dismiss: () => void;
  last: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useDialog(feedback !== null, dismiss, ref);
  return (
    <dialog
      ref={ref}
      className="answer-dialog"
      data-answer-dialog
      data-correct={String(feedback?.correct ?? false)}
      aria-labelledby="answer-dialog-title"
      aria-describedby="answer-dialog-message"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
    >
      <div
        className="answer-dialog__symbol"
        data-answer-symbol
        aria-hidden="true"
      >
        {feedback?.correct ? "✓" : "↻"}
      </div>
      <h2 id="answer-dialog-title" data-answer-title>
        {feedback?.correct ? "Đúng rồi! Giỏi lắm!" : "Chưa đúng rồi!"}
      </h2>
      <p id="answer-dialog-message" data-answer-message>
        {feedback?.correct
          ? `${feedback.en} – ${feedback.vi}`
          : "Bé nghe lại và chọn một hình khác nhé!"}
      </p>
      <button
        type="button"
        className="button button--primary"
        data-answer-action
        onClick={dismiss}
      >
        {feedback?.correct
          ? last
            ? "Xem kết quả"
            : "Câu tiếp theo"
          : "Chọn lại"}
      </button>
    </dialog>
  );
}
export function useVocabulary() {
  const routeTopic = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((item) => item !== "index.html")
    .at(-1);
  const topic: TopicId =
    routeTopic === "fruit" || routeTopic === "colors" ? routeTopic : "animals";
  const words = topicWords[topic];
  const [progress, setProgress] = useState(() => readProgress(topic));
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      words.findIndex((word) => word.id === progress.current),
    ),
  );
  const [mode, updateMode] = useState<Mode>("learn");
  const [completion, setCompletion] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0),
    [score, setScore] = useState(0),
    [session, setSession] = useState(0);
  const [answered, setAnswered] = useState(false),
    [attempted, setAttempted] = useState(false);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{
    correct: boolean;
    en: string;
    vi: string;
  } | null>(null);
  const [notice, setNotice] = useState("");
  const speech = useSpeech(setNotice),
    fullscreen = useFullscreen();
  const wordGrid = useRef<HTMLDivElement>(null),
    steps = useRef<HTMLElement>(null),
    exerciseSpeaker = useRef<HTMLButtonElement>(null),
    completionTitle = useRef<HTMLHeadingElement>(null);
  const [scrollDisabled, setScrollDisabled] = useState(false);
  useDragScroll(wordGrid);
  useDragScroll(steps);
  const result = questionIndex >= words.length;
  const count = progress.learned.length,
    word = words[index],
    target = words[Math.min(questionIndex, words.length - 1)];
  const choices = useMemo(() => {
    if (questionIndex >= words.length) return [];
    return [
      words[questionIndex],
      words[(questionIndex + 1) % 10],
      words[(questionIndex + 3) % 10],
      words[(questionIndex + 6) % 10],
    ].sort(() => Math.random() - 0.5);
  }, [words, questionIndex, session]);
  const persist = (next: LessonProgress) => {
    setProgress(next);
    if (!saveProgress(topic, next))
      setNotice(
        "Không thể lưu trên trình duyệt này. Tiến độ chỉ được giữ trong lần học hiện tại.",
      );
  };
  const resetQuestion = () => {
    setAnswered(false);
    setAttempted(false);
    setChoiceId(null);
    setAnswerFeedback(null);
  };
  const setMode = (next: Mode) => {
    if (next !== "learn" && count < words.length) return;
    if (next !== "learn" && next === mode && !result) return;
    speech.stop();
    updateMode(next);
    setCompletion(false);
    resetQuestion();
    if (next !== "learn") {
      setQuestionIndex(0);
      setScore(0);
      setSession((value) => value + 1);
    }
  };
  const selectWord = (nextIndex: number) => {
    speech.stop();
    setIndex(nextIndex);
    updateMode("learn");
    setCompletion(false);
    setAnswerFeedback(null);
    persist({ ...progress, current: words[nextIndex].id });
  };
  const nextWord = () => {
    speech.stop();
    const learned = progress.learned.includes(word.id)
      ? progress.learned
      : [...progress.learned, word.id];
    const next = {
      ...progress,
      learned,
      rewarded: learned.length === words.length || progress.rewarded,
    };
    if (learned.length === words.length && !progress.rewarded)
      setNotice("Tuyệt vời! Bạn đã học đủ 10 từ và nhận 20 sao cho bài này.");
    if (count < words.length && learned.length === words.length) {
      persist({ ...next, current: word.id });
      setCompletion(true);
      return;
    }
    if (index === words.length - 1 && learned.length === words.length) {
      persist(next);
      setMode("practice");
      return;
    }
    const nextIndex =
      index < words.length - 1
        ? index + 1
        : words.findIndex((word) => !learned.includes(word.id));
    setIndex(nextIndex);
    persist({ ...next, current: words[nextIndex].id });
    if (nextIndex <= index) setNotice("Cùng học nốt những từ còn lại nhé!");
  };
  const nextQuestion = () => {
    if (mode === "learn" || !answered || result) return;
    speech.stop();
    resetQuestion();
    const next = questionIndex + 1;
    setQuestionIndex(next);
    if (next === words.length)
      persist({
        ...progress,
        results: {
          ...progress.results,
          [mode]: { score, completedAt: new Date().toISOString() },
        },
      });
  };
  const choose = (id: string) => {
    if (answered || answerFeedback || result) return;
    const correct = id === target.id;
    setChoiceId(id);
    if (mode === "practice") {
      speech.stop();
      if (correct && !attempted) setScore((value) => value + 1);
      setAttempted(true);
      setAnswered(correct);
      setAnswerFeedback({ correct, en: target.en, vi: target.vi });
    } else {
      setAnswered(true);
      if (correct) setScore((value) => value + 1);
    }
  };
  const dismissAnswer = () => {
    if (answerFeedback?.correct) nextQuestion();
    else {
      setAnswerFeedback(null);
      setChoiceId(null);
    }
  };
  useEffect(() => {
    remember("english", topic);
    const refresh = (event: StorageEvent) => {
      if (event.key !== progressKey(topic) && event.key !== null) return;
      const next = readProgress(topic);
      speech.stop();
      setProgress(next);
      setIndex(
        Math.max(
          0,
          words.findIndex((word) => word.id === next.current),
        ),
      );
      updateMode("learn");
      setCompletion(false);
      setAnswerFeedback(null);
      setNotice(
        "Tiến độ đã thay đổi ở tab khác. Đã cập nhật; hãy chọn bước để tiếp tục.",
      );
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [topic]);
  const updateScroll = () => {
    const grid = wordGrid.current;
    if (grid)
      setScrollDisabled(
        grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1,
      );
  };
  useEffect(() => {
    updateScroll();
    window.addEventListener("resize", updateScroll);
    const observer = new ResizeObserver(updateScroll);
    if (wordGrid.current) observer.observe(wordGrid.current);
    return () => {
      window.removeEventListener("resize", updateScroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (completion) completionTitle.current?.focus();
    else if (mode !== "learn" && !result) exerciseSpeaker.current?.focus();
  }, [completion, mode, questionIndex]);
  const happy = score >= 6;
  const questionTitle = result
    ? mode === "practice"
      ? "Hoàn thành!"
      : happy
        ? "Chúc mừng bé!"
        : "Cùng cố gắng nhé!"
    : mode === "practice"
      ? `Nghe và chọn hình · ${questionIndex + 1}/10`
      : `Chọn nghĩa của “${target.en}” · ${questionIndex + 1}/10`;
  const feedback = result
    ? mode === "practice"
      ? "Bé đã luyện tập 10 từ mới!"
      : `Bé đã đạt ${score} điểm!`
    : mode === "quiz" && answered
      ? `${choiceId === target.id ? "Đúng rồi! " : "Đáp án đúng: "}${target.en} – ${target.vi}`
      : "";
  const exampleParts = word.example.split(word.id);
  return {
    topic: topics[topic],
    word,
    index,
    mode,
    count,
    progress,
    setMode,
    completion,
    result,
    happy,
    score,
    notice,
    speaking: speech.speaking,
    speak: () => speech.speak(word.en),
    exerciseSpeak: () => speech.speak(target.en),
    previous: () => {
      if (index > 0) selectWord(index - 1);
    },
    nextWord,
    selectWord,
    nextQuestion,
    wordGrid,
    steps,
    exerciseSpeaker,
    completionTitle,
    fullscreen,
    example: (
      <>
        {exampleParts[0]}
        <strong>{word.id}</strong>
        {exampleParts.slice(1).join(word.id)}
      </>
    ),
    ringStyle: { "--percent": `${count * 10}%` } as CSSProperties,
    tiles: words.map((item, i) => (
      <button
        key={item.id}
        type="button"
        className="word-tile"
        aria-current={i === index}
        aria-label={`${item.en}, ${item.vi}, ${progress.learned.includes(item.id) ? "đã học" : "chưa học"}`}
        onClick={() => selectWord(i)}
      >
        <img
          src={item.image}
          alt=""
          width="120"
          height="80"
          draggable={false}
        />
        <strong>{item.en}</strong>
        <small>{item.vi}</small>
        {progress.learned.includes(item.id) && (
          <span className="learned-check">✓</span>
        )}
      </button>
    )),
    dots: words.map((item, i) => (
      <button
        key={item.id}
        type="button"
        className="word-dot"
        aria-current={i === index}
        aria-label={`Từ ${i + 1}: ${item.en}`}
        onClick={() => selectWord(i)}
      />
    )),
    scrollDisabled,
    updateScroll,
    scrollWords: () =>
      wordGrid.current?.scrollBy({
        left: wordGrid.current.clientWidth * 0.8,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      }),
    questionTitle,
    feedback,
    answered,
    lastQuestion: questionIndex === words.length - 1,
    answers: choices.map((item) => (
      <button
        key={item.id}
        type="button"
        className={
          choiceId === item.id
            ? item.id === target.id
              ? "correct"
              : "incorrect"
            : undefined
        }
        disabled={answered}
        onClick={() => choose(item.id)}
      >
        {mode === "practice" ? <img src={item.image} alt={item.vi} /> : item.vi}
      </button>
    )),
    answerDialog: (
      <AnswerDialog
        feedback={answerFeedback}
        dismiss={dismissAnswer}
        last={questionIndex === words.length - 1}
      />
    ),
    review: () => selectWord(0),
  };
}
