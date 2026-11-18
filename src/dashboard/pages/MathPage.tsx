import { DashboardLayout } from "../components/DashboardLayout";
import { useMath } from "./Math";

type Props = { m: ReturnType<typeof useMath> };
function MathHero({ m }: Props) {
  return (
    <section className="math-hero" aria-labelledby="math-hero-title">
      <img
        className="math-hero__art"
        src="./assets/math-space-hero.webp"
        width="2172"
        height="724"
        alt=""
        fetchPriority="high"
      />
      <div className="math-hero__content">
        <h2 id="math-hero-title">{"Cùng khám phá những con số!"}</h2>
        <p>{"Tiếp tục chặng Phép cộng và thu thập thêm sao nhé."}</p>
        <button
          className="button button--primary"
          type="button"
          data-open-lesson="addition"
          onClick={() => m.openLesson("addition")}
        >
          {"Bắt đầu học "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}

function MathJourney({ m }: Props) {
  return (
    <section
      className="math-path"
      id="math-path"
      aria-labelledby="math-path-title"
    >
      <h2 id="math-path-title">{"Hành trình của bạn"}</h2>
      <div className="math-path__track" data-math-path="">
        {m.stages}
      </div>
    </section>
  );
}

function QuickChallenge({ m }: Props) {
  return (
    <section className="quick-challenge" aria-labelledby="challenge-title">
      <header>
        <span className="quick-challenge__bolt" aria-hidden="true">
          {"ϟ"}
        </span>
        <h2 id="challenge-title">{"Thử thách nhanh"}</h2>
      </header>
      <div className="quick-challenge__scene" aria-hidden="true">
        <svg viewBox="0 0 240 100">
          <path
            className="quick-cloud"
            d="M0 75c8-20 29-23 42-9 12-32 58-32 70 1 19-18 50-7 50 17H0Z"
          ></path>
          <path
            className="quick-cloud quick-cloud--right"
            d="M145 89c5-15 24-21 36-9 9-28 50-24 55 9h-91Z"
          ></path>
          <path
            className="quick-star"
            d="m120 13 10 21 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3 10-21Z"
          ></path>
          <circle cx="112" cy="45" r="2.5"></circle>
          <circle cx="128" cy="45" r="2.5"></circle>
          <path className="quick-smile" d="M112 53c5 6 11 6 16 0"></path>
        </svg>
      </div>
      <p className="quick-challenge__question">
        <span data-challenge-left="">{m.challenge.left}</span>
        {" + "}
        <span data-challenge-right="">{m.challenge.right}</span>
        {" = ?"}
      </p>
      <div className="quick-challenge__answers" data-challenge-options="">
        {m.options}
      </div>
      <p
        className="quick-challenge__feedback"
        aria-live="polite"
        data-challenge-feedback=""
      >
        {m.feedback}
      </p>
    </section>
  );
}

function ContinueMath({ m }: Props) {
  return (
    <section
      className="math-continue"
      aria-labelledby="math-continue-title"
      data-math-continue=""
      hidden={!m.currentStage}
    >
      <img
        className="math-continue__image"
        src="./assets/math-space-hero.webp"
        width="112"
        height="112"
        alt=""
        loading="lazy"
      />
      <div className="math-continue__content">
        <h2 id="math-continue-title">{"Tiếp tục hành trình"}</h2>
        <p className="math-continue__topic">
          <strong data-continue-stage="">{m.currentStage?.title}</strong>
        </p>
        <p className="math-continue__note" data-continue-note="">
          {m.progressNote}
        </p>
        <progress
          value={m.completed}
          max={m.total}
          aria-label="Tiến độ hành trình Toán"
          data-continue-progress=""
        ></progress>
      </div>
      <button
        className="button button--primary math-continue__button"
        type="button"
        data-open-lesson="addition"
        data-continue-lesson=""
        onClick={() => m.openLesson("addition")}
      >
        {"Học tiếp "}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14m-5-5 5 5-5 5"></path>
        </svg>
      </button>
    </section>
  );
}

function MathGoal({ m }: Props) {
  return (
    <section className="math-goal" aria-labelledby="math-goal-title">
      <div className="math-goal__heading">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="15" cy="17" r="12"></circle>
          <circle cx="15" cy="17" r="7"></circle>
          <path d="m15 17 12-12m-1-3v5h5"></path>
        </svg>
        <div>
          <h2 id="math-goal-title">{"Mục tiêu hôm nay"}</h2>
          <p>
            {"Hoàn thành "}
            <span data-goal-total="">{m.goal.total}</span>
            {" bài học bất kỳ"}
          </p>
        </div>
      </div>
      <div
        className="math-goal__progress"
        data-goal-progress=""
        aria-label="Tiến độ mục tiêu hôm nay"
        role={"progressbar"}
        aria-valuemin={0}
        aria-valuemax={m.goal.total}
        aria-valuenow={m.goal.completed}
      >
        {m.segments}
      </div>
      <strong className="math-goal__count">
        <span data-goal-completed="">{m.goal.completed}</span>
        {"/"}
        <span data-goal-total="">{m.goal.total}</span>
      </strong>
    </section>
  );
}
export function MathPage() {
  const m = useMath();
  return (
    <DashboardLayout area="math">
      <main className="dashboard-main math-main" id="main-content">
        <div className="dashboard-main__inner">
          <header className="page-heading math-heading">
            <div className="math-heading__mark" aria-hidden="true">
              <img
                src="../shared/assets/math-planet.svg"
                width="48"
                height="48"
                alt=""
              />
            </div>
            <div>
              <h1>{"Hành tinh Toán"}</h1>
              <p>{"Chinh phục từng thử thách nhỏ!"}</p>
            </div>
          </header>
          <MathHero m={m} />
          <div className="math-dashboard-grid">
            <MathJourney m={m} />
            <section
              className="lesson-grid"
              aria-label="Chủ đề Toán nổi bật"
              data-lesson-grid=""
            >
              {m.lessons}
            </section>
            <QuickChallenge m={m} />
            <ContinueMath m={m} />
            <MathGoal m={m} />
          </div>
          <p className="preview-note" hidden={!m.isDemo}>
            {"Bản xem thử · Điểm sao và tiến độ đang dùng dữ liệu minh họa."}
          </p>
        </div>
      </main>
      {m.dialog}
    </DashboardLayout>
  );
}
