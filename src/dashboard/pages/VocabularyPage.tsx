import { DashboardLayout } from "../components/DashboardLayout";
import { useVocabulary } from "./Vocabulary";

type Props = { m: ReturnType<typeof useVocabulary> };
function LessonSteps({ m }: Props) {
  return (
    <nav className="lesson-steps" aria-label="Các bước học" ref={m.steps}>
      <button
        type="button"
        className={m.mode === "learn" ? "is-active" : undefined}
        data-mode="learn"
        aria-current={m.mode === "learn" ? "step" : undefined}
        disabled={false}
        onClick={() => m.setMode("learn")}
      >
        <svg className="lesson-icon" aria-hidden="true">
          <use href="#icon-book"></use>
        </svg>
        <span>{"1. Học từ mới"}</span>
      </button>
      <button
        type="button"
        data-mode="practice"
        disabled={m.count < 10}
        className={m.mode === "practice" ? "is-active" : undefined}
        aria-current={m.mode === "practice" ? "step" : undefined}
        onClick={() => m.setMode("practice")}
      >
        <svg className="lesson-icon" aria-hidden="true">
          <use href="#icon-game"></use>
        </svg>
        <span>{"2. Luyện tập"}</span>
        <svg
          className="lock-icon"
          data-lock=""
          aria-label="Chưa mở khóa"
          style={{ display: m.count === 10 ? "none" : undefined }}
        >
          <use href="#icon-lock"></use>
        </svg>
      </button>
      <button
        type="button"
        data-mode="quiz"
        disabled={m.count < 10}
        className={m.mode === "quiz" ? "is-active" : undefined}
        aria-current={m.mode === "quiz" ? "step" : undefined}
        onClick={() => m.setMode("quiz")}
      >
        <svg className="lesson-icon" aria-hidden="true">
          <use href="#icon-cup"></use>
        </svg>
        <span>{"3. Kiểm tra"}</span>
        <svg
          className="lock-icon"
          data-lock=""
          aria-label="Chưa mở khóa"
          style={{ display: m.count === 10 ? "none" : undefined }}
        >
          <use href="#icon-lock"></use>
        </svg>
      </button>
    </nav>
  );
}

function VocabularyFlashcard({ m }: Props) {
  return (
    <section
      className={"flashcard" + (m.fullscreen.expanded ? " is-expanded" : "")}
      aria-label="Thẻ từ vựng"
      ref={m.fullscreen.card}
    >
      <button
        type="button"
        className="fullscreen-toggle"
        data-fullscreen=""
        aria-label={
          m.fullscreen.expanded
            ? "Thoát toàn màn hình"
            : "Phóng to toàn màn hình"
        }
        aria-pressed={m.fullscreen.expanded}
        title={m.fullscreen.expanded ? "Thu nhỏ (Esc)" : "Toàn màn hình"}
        ref={m.fullscreen.button}
        onClick={m.fullscreen.toggle}
        hidden={m.fullscreen.native}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            className="fullscreen-expand"
            d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"
          ></path>
        </svg>
        <span className="fullscreen-exit-label">{"Thoát"}</span>
      </button>
      <div data-learning="" hidden={m.mode !== "learn" || m.completion}>
        <div className="word-content" aria-live="polite" aria-atomic="true">
          <img
            className="animal-illustration"
            data-animal-image=""
            width="360"
            height="290"
            alt={"Hình minh họa " + m.word.vi.toLowerCase()}
            fetchPriority="high"
            src={m.word.image}
          />
          <div className="word-title">
            <div className="word-definition">
              <h2 data-word="">{m.word.en}</h2>
              <p className="translation" data-translation="">
                {m.word.vi}
              </p>
            </div>
            <div className="pronunciation">
              <button
                type="button"
                className={"speaker" + (m.speaking ? " is-speaking" : "")}
                aria-label={"Nghe phát âm " + m.word.en}
                data-speak=""
                onClick={m.speak}
              >
                <svg aria-hidden="true">
                  <use href="#icon-volume"></use>
                </svg>
              </button>
            </div>
          </div>
          <p className="example">
            <svg aria-hidden="true">
              <use href="#icon-chat"></use>
            </svg>
            <span data-example="">{m.example}</span>
          </p>
        </div>
        <div className="word-controls">
          <button
            type="button"
            className="button button--secondary"
            data-prev=""
            disabled={m.index === 0}
            onClick={m.previous}
          >
            <svg className="arrow-back" aria-hidden="true">
              <use href="#icon-arrow"></use>
            </svg>
            {"Quay lại"}
          </button>
          <div
            className="word-dots"
            role="group"
            aria-label="Chọn từ vựng"
            data-word-dots=""
          >
            {m.dots}
          </div>
          <button
            type="button"
            className="button button--primary"
            data-next=""
            onClick={m.nextWord}
          >
            <span>{"Tiếp theo"}</span>
            <svg aria-hidden="true">
              <use href="#icon-arrow"></use>
            </svg>
          </button>
        </div>
      </div>
      <div
        className="lesson-completion"
        data-completion=""
        hidden={!m.completion}
        aria-labelledby="completion-title"
      >
        <svg className="completion-star" aria-hidden="true">
          <use href="#icon-star"></use>
        </svg>
        <h2 id="completion-title" tabIndex={-1} ref={m.completionTitle}>
          {"Chúc mừng bé!"}
        </h2>
        <p>{`Bé đã khám phá đủ 10 từ về ${m.topic.noun}.`}</p>
        <p className="completion-reward">{"+20 sao cho bài học này"}</p>
        <p className="completion-description">{m.topic.description}</p>
        <div className="completion-actions">
          <button
            type="button"
            className="button button--primary"
            data-completion-practice=""
            onClick={() => m.setMode("practice")}
          >
            {"Luyện tập ngay"}
          </button>
          <button
            type="button"
            className="button button--secondary"
            data-completion-review=""
            onClick={m.review}
          >
            {"Ôn lại 10 từ"}
          </button>
        </div>
      </div>
      <div
        data-exercise=""
        hidden={m.mode === "learn" || m.completion}
        className={m.result ? "practice-result" : undefined}
        data-result-mood={
          m.result && m.mode === "quiz"
            ? m.happy
              ? "happy"
              : "sad"
            : undefined
        }
      >
        <div
          className="practice-celebration"
          data-practice-celebration=""
          hidden={!m.result || (m.mode === "quiz" && !m.happy)}
          aria-hidden="true"
        >
          <svg viewBox="0 0 40 40">
            <use href="#icon-star"></use>
          </svg>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div
          className="quiz-sad-face"
          data-quiz-sad=""
          hidden={!m.result || m.mode !== "quiz" || m.happy}
          aria-hidden="true"
        >
          <svg viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="66"
              fill="#e5efff"
              stroke="#91b2e8"
              strokeWidth="4"
            ></circle>
            <path
              d="m43 62 16-6m42 0 16 6"
              fill="none"
              stroke="#52739d"
              strokeWidth="5"
              strokeLinecap="round"
            ></path>
            <circle cx="56" cy="75" r="6" fill="#52739d"></circle>
            <circle cx="104" cy="75" r="6" fill="#52739d"></circle>
            <path
              d="M60 112q20-22 40 0"
              fill="none"
              stroke="#52739d"
              strokeWidth="5"
              strokeLinecap="round"
            ></path>
            <path
              className="quiz-tear"
              d="M115 82q-16 20 0 20t0-20"
              fill="#73b8ee"
            ></path>
          </svg>
        </div>
        <h2 data-question="" tabIndex={m.result ? -1 : undefined}>
          {m.questionTitle}
        </h2>
        <button
          type="button"
          className="button button--secondary"
          data-exercise-speak=""
          ref={m.exerciseSpeaker}
          onClick={m.exerciseSpeak}
          hidden={m.result}
        >
          <svg aria-hidden="true">
            <use href="#icon-volume"></use>
          </svg>
          {"Nghe từ cần chọn"}
        </button>
        <div className="answer-grid" data-answers="">
          {m.answers}
        </div>
        <p data-feedback="" role="status">
          {m.feedback}
        </p>
        <p
          className="quiz-encouragement"
          data-quiz-encouragement=""
          hidden={!m.result || m.mode !== "quiz" || m.score >= 8}
        >
          {m.happy
            ? "Vẫn còn một vài từ chưa nhớ, bé cần cố gắng hơn nữa nhé!"
            : "Bé cần cố gắng hơn nữa nhé!"}
        </p>
        <div
          className="completion-actions quiz-result-actions"
          data-quiz-actions=""
          hidden={!m.result || m.mode !== "quiz"}
        >
          <button
            type="button"
            className="button button--primary"
            data-quiz-retry=""
            onClick={() => m.setMode("practice")}
          >
            {"Luyện tập lại"}
          </button>
          <a
            className="button button--secondary"
            href="../#topics"
            data-quiz-new-topic=""
            hidden={m.score < 8}
          >
            {"Sang chủ đề mới"}
            <svg aria-hidden="true">
              <use href="#icon-arrow"></use>
            </svg>
          </a>
        </div>
        <button
          type="button"
          className="button button--primary"
          data-practice-quiz=""
          hidden={!m.result || m.mode !== "practice"}
          onClick={() => m.setMode("quiz")}
        >
          {"Làm bài kiểm tra"}
          <svg aria-hidden="true">
            <use href="#icon-arrow"></use>
          </svg>
        </button>
        <button
          type="button"
          className="button button--primary"
          data-question-next=""
          hidden={m.mode !== "quiz" || !m.answered || m.result}
          onClick={m.nextQuestion}
        >
          {m.lastQuestion ? "Xem kết quả" : "Câu tiếp theo →"}
        </button>
      </div>
      {m.answerDialog}
    </section>
  );
}

function TopicSummary({ m }: Props) {
  return (
    <section className="topic-summary">
      <h2>{"Tiến độ chủ đề"}</h2>
      <div
        className="animal-ring"
        role="progressbar"
        aria-label="Tiến độ học từ"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={m.count}
        style={m.ringStyle}
      >
        <strong data-ring-count="">{m.count}/10</strong>
      </div>
      <p className="summary-note" data-summary="">
        {`Đã học ${m.count} từ`}
      </p>
      <p className="reward">
        <svg aria-hidden="true">
          <use href="#icon-star"></use>
        </svg>
        <span data-reward="">
          <strong>+20 sao</strong>
          {m.progress.rewarded ? " đã nhận" : " khi hoàn thành"}
        </span>
      </p>
    </section>
  );
}

function NextActivities({ m }: Props) {
  return (
    <section className="next-activities">
      <h2>{"Sau khi học từ mới"}</h2>
      <button
        type="button"
        className="activity-link"
        data-activity-mode="practice"
        disabled={m.count < 10}
        onClick={() => m.setMode("practice")}
      >
        <svg className="activity-icon activity-icon--game" aria-hidden="true">
          <use href="#icon-game"></use>
        </svg>
        <span>{"Nghe và chọn hình"}</span>
        <svg
          className="lock-icon"
          data-lock=""
          aria-label="Chưa mở khóa"
          style={{ display: m.count === 10 ? "none" : undefined }}
        >
          <use href="#icon-lock"></use>
        </svg>
        <span className="activity-chevron" aria-hidden="true">
          {"›"}
        </span>
      </button>
      <button
        type="button"
        className="activity-link"
        data-activity-mode="practice"
        disabled={m.count < 10}
        onClick={() => m.setMode("practice")}
      >
        <svg className="activity-icon activity-icon--listen" aria-hidden="true">
          <use href="#icon-headphones"></use>
        </svg>
        <span>{"Luyện nghe từ mới"}</span>
        <svg
          className="lock-icon"
          data-lock=""
          aria-label="Chưa mở khóa"
          style={{ display: m.count === 10 ? "none" : undefined }}
        >
          <use href="#icon-lock"></use>
        </svg>
        <span className="activity-chevron" aria-hidden="true">
          {"›"}
        </span>
      </button>
      <button
        type="button"
        className="activity-link"
        data-activity-mode="quiz"
        disabled={m.count < 10}
        onClick={() => m.setMode("quiz")}
      >
        <svg className="activity-icon activity-icon--cup" aria-hidden="true">
          <use href="#icon-cup"></use>
        </svg>
        <span>{`Đố vui ${m.topic.noun}`}</span>
        <svg
          className="lock-icon"
          data-lock=""
          aria-label="Chưa mở khóa"
          style={{ display: m.count === 10 ? "none" : undefined }}
        >
          <use href="#icon-lock"></use>
        </svg>
        <span className="activity-chevron" aria-hidden="true">
          {"›"}
        </span>
      </button>
      <button
        type="button"
        className="button button--primary practice-button"
        data-start-practice=""
        disabled={m.count < 10}
        onClick={() => m.setMode("practice")}
      >
        <svg
          className="lock-icon"
          data-lock=""
          aria-label="Chưa mở khóa"
          style={{ display: m.count === 10 ? "none" : undefined }}
        >
          <use href="#icon-lock"></use>
        </svg>
        <span>{"Luyện tập"}</span>
      </button>
    </section>
  );
}

function WordLibrary({ m }: Props) {
  return (
    <section className="word-library" aria-labelledby="words-title">
      <h2 id="words-title">{"Các từ trong chủ đề"}</h2>
      <div className="word-carousel">
        <div
          id="topic-words"
          className="word-grid"
          data-word-grid=""
          ref={m.wordGrid}
          onScroll={m.updateScroll}
        >
          {m.tiles}
        </div>
        <button
          type="button"
          className="word-scroll-next"
          data-scroll-words=""
          aria-label="Xem các từ tiếp theo"
          aria-controls="topic-words"
          onClick={m.scrollWords}
          disabled={m.scrollDisabled}
        >
          <svg aria-hidden="true">
            <use href="#icon-arrow"></use>
          </svg>
        </button>
      </div>
    </section>
  );
}
export function VocabularyPage() {
  const m = useVocabulary();
  return (
    <DashboardLayout area="english" stars={0}>
      <svg
        className="icon-definitions"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <symbol id="icon-book" viewBox="0 0 24 24">
            <path d="M12 5C9 3 6 3 3 4v15c3-1 6-1 9 1m0-15c3-2 6-2 9-1v15c-3-1-6-1-9 1V5Z"></path>
            <path d="M6 7h3m-3 4h3m6-4h3m-3 4h3"></path>
          </symbol>
          <symbol id="icon-game" viewBox="0 0 24 24">
            <path d="M7 7h10c2 0 3 2 4 6l1 4c.5 3-2 4-4 2l-3-3H9l-3 3c-2 2-4.5 1-4-2l1-4c1-4 2-6 4-6Z"></path>
            <path d="M7 10v5m-2.5-2.5h5M16 11h.1M19 14h.1"></path>
          </symbol>
          <symbol id="icon-cup" viewBox="0 0 24 24">
            <path d="M7 3h10v6a5 5 0 0 1-10 0V3Zm5 11v6m-4 1h8M7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4"></path>
          </symbol>
          <symbol id="icon-lock" viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="11" rx="2"></rect>
            <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"></path>
          </symbol>
          <symbol id="icon-volume" viewBox="0 0 24 24">
            <path d="M3 9h4l5-4v14l-5-4H3V9Z"></path>
            <path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"></path>
          </symbol>
          <symbol id="icon-chat" viewBox="0 0 24 24">
            <path d="M21 11a9 9 0 0 1-9 9H8l-5 2 1-6A9 9 0 1 1 21 11Z"></path>
            <path d="M8 11h.1m4 0h.1m4 0h.1"></path>
          </symbol>
          <symbol id="icon-arrow" viewBox="0 0 24 24">
            <path d="M4 12h16m-6-6 6 6-6 6"></path>
          </symbol>
          <symbol id="icon-headphones" viewBox="0 0 24 24">
            <path d="M4 14v-3a8 8 0 0 1 16 0v3"></path>
            <rect x="3" y="12" width="5" height="9" rx="2"></rect>
            <rect x="16" y="12" width="5" height="9" rx="2"></rect>
          </symbol>
          <symbol id="icon-star" viewBox="0 0 40 40">
            <path
              d="m20 3 5.2 10.3 11.4 1.8-8.2 8.1 1.8 11.5L20 29.3 9.8 34.7l1.8-11.5-8.2-8.1 11.4-1.8Z"
              fill="#ffd43b"
              stroke="#f4b000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            ></path>
            <circle cx="16" cy="19" r="1.6" fill="#795313"></circle>
            <circle cx="24" cy="19" r="1.6" fill="#795313"></circle>
            <path
              d="M17 24q3 3 6 0"
              fill="none"
              stroke="#795313"
              strokeWidth="1.8"
              strokeLinecap="round"
            ></path>
          </symbol>
        </defs>
      </svg>
      <main className="dashboard-main" id="main-content">
        <div className="dashboard-main__inner">
          <div className="animal-layout">
            <div className="lesson-column">
              <nav className="lesson-breadcrumb" aria-label="Đường dẫn">
                <a href="../">{"Đảo tiếng Anh"}</a>
                <span aria-hidden="true">{" / "}</span>
                <span aria-current="page">{m.topic.label}</span>
              </nav>
              <h1 className="lesson-title">{m.topic.title}</h1>
              <LessonSteps m={m} />
              <VocabularyFlashcard m={m} />
            </div>
            <aside>
              <TopicSummary m={m} />
              <NextActivities m={m} />
            </aside>
          </div>
          <WordLibrary m={m} />
          <p
            className="lesson-notice"
            role="status"
            data-notice=""
            hidden={!m.notice}
          >
            {m.notice}
          </p>
        </div>
      </main>
    </DashboardLayout>
  );
}
