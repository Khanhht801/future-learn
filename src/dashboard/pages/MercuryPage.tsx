import { DashboardLayout } from "../components/DashboardLayout";
import { useMercury } from "./Mercury";

type Props = { m: ReturnType<typeof useMercury> };
function MercuryHero({ m }: Props) {
  return (
    <section className="mercury-hero" aria-labelledby="planet-title">
      <img
        className="mercury-hero__art"
        src="./assets/mercury-banner.webp?v=2"
        width="1536"
        height="512"
        alt=""
        fetchPriority="high"
      />
      <div className="mercury-hero__intro">
        <h1 id="planet-title">{"Sao Thủy"}</h1>
        <p className="mercury-hero__subtitle">{"Làm quen với con số"}</p>
      </div>
      <div className="journey-goals">
        <h2>
          <span aria-hidden="true">{"🎯"}</span>
          {" Mục tiêu hành trình"}
        </h2>
        <ul>
          <li>{"Nhận biết và đọc các số từ 0 đến 10"}</li>
          <li>{"Đếm, so sánh và sắp xếp các số"}</li>
          <li>{"Chinh phục thử thách Sao Thủy"}</li>
        </ul>
      </div>
    </section>
  );
}

function MissionPanel({ m }: Props) {
  return (
    <aside className="mission-panel">
      <h2>{"Hành trình học tập"}</h2>
      <nav aria-label="Các nhiệm vụ Sao Thủy" id="missions">
        {m.missions}
      </nav>
      <a className="back-link" href="../">
        {"‹ Quay lại Hành tinh Toán"}
      </a>
    </aside>
  );
}

function ExercisePanel({ m }: Props) {
  return (
    <section className={m.exerciseClass} aria-labelledby="exercise-title">
      <div className="exercise-meta">
        <span className="mission-chip" id="mission-label">
          {m.missionLabel}
        </span>
        <span id="question-count">{m.questionCount}</span>
      </div>
      <h2 id="exercise-title" tabIndex={-1} ref={m.heading}>
        {m.title}
      </h2>
      <p className="exercise-instruction" id="instruction">
        {m.instruction}
      </p>
      <div id="activity">{m.activity}</div>
      <p
        className={"feedback" + (m.checked ? " is-success" : "")}
        id="feedback"
        role="status"
        aria-live="polite"
      >
        {m.feedback}
      </p>
      <button
        className="button button--primary check-button"
        id="check"
        type="button"
        onClick={m.check}
        hidden={m.checkHidden}
        ref={m.checkButton}
      >
        {m.checkLabel}
      </button>
    </section>
  );
}

function LearningSupport({ m }: Props) {
  return (
    <aside className="learning-support">
      <section className="support-panel">
        <h2>
          {"Tiến độ nhiệm vụ "}
          <span id="score">{m.score}/10</span>
        </h2>
        <progress
          id="mission-progress"
          value={m.score}
          max={10}
          aria-label="Số câu đã hoàn thành"
        ></progress>
        <p id="progress-note">{m.progressNote}</p>
        <p className="journey-count" id="journey-count">
          {m.journeyCount}
        </p>
      </section>
      <section className={m.hintClass}>
        <h2>{"💡 Gợi ý cho bé"}</h2>
        {m.hint}
        <img
          id="group-hint-robot"
          className="group-hint-robot"
          src="./assets/chibi-robot.webp"
          width="132"
          height="132"
          alt=""
          hidden={!m.showRobot}
        />
      </section>
    </aside>
  );
}
export function MercuryPage() {
  const m = useMercury();
  return (
    <DashboardLayout area="math" journey="../#math-path">
      <main className="dashboard-main mercury-main" id="main-content">
        <div className="dashboard-main__inner">
          <nav className="breadcrumbs" aria-label="Đường dẫn">
            <a href="../">{"Hành tinh Toán"}</a>
            <span aria-hidden="true">{"›"}</span>
            <span aria-current="page">{"Sao Thủy"}</span>
          </nav>
          <MercuryHero m={m} />
          <div className="learning-layout">
            <MissionPanel m={m} />
            <ExercisePanel m={m} />
            <LearningSupport m={m} />
          </div>
          <p className="storage-note" id="storage-note">
            {m.storageNote}
          </p>
        </div>
      </main>
    </DashboardLayout>
  );
}
