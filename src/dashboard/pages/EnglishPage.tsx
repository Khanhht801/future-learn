import { DashboardLayout } from "../components/DashboardLayout";
import { useEnglish } from "./English";

type Props = { m: ReturnType<typeof useEnglish> };
function EnglishHero({ m }: Props) {
  return (
    <section className="journey-banner" aria-labelledby="journey-title">
      <img
        className="journey-banner__art"
        src="./assets/english-island-v2.webp"
        width="2172"
        height="724"
        alt=""
        fetchPriority="high"
      />
      <div className="journey-banner__content">
        <h2 id="journey-title">{"Sẵn sàng khám phá?"}</h2>
        <p>
          {
            " Cùng những người bạn đáng yêu khám phá thế giới tiếng Anh qua những chủ đề thú vị! "
          }
        </p>
        <button
          className="button button--primary"
          type="button"
          data-resume-topic=""
          onClick={m.resume}
        >
          {" Tiếp tục học "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}

function ContinueEnglish({ m }: Props) {
  return (
    <section
      className="continue-journey"
      aria-labelledby="continue-journey-title"
      data-continue-card=""
    >
      <img
        className="continue-journey__image"
        src={m.topic.image}
        alt=""
        width="720"
        height="480"
        loading="lazy"
        data-continue-image=""
      />
      <div className="continue-journey__content">
        <h2 id="continue-journey-title">{"Tiếp tục hành trình"}</h2>
        <p className="continue-journey__topic">
          <strong data-continue-title="">{m.topic.title}</strong>
          <span aria-hidden="true">{"·"}</span>
          <span data-continue-count="">{m.count}</span>
        </p>
        <p className="continue-journey__note" data-continue-note="">
          {m.note}
        </p>
        <progress
          value={m.topic.completed}
          max={m.topic.total}
          aria-label={"Tiến độ chủ đề " + m.topic.title}
          data-continue-progress=""
        ></progress>
      </div>
      <button
        className="button button--primary continue-journey__button"
        type="button"
        data-continue-journey=""
        onClick={m.resume}
      >
        {" Học tiếp "}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14m-5-5 5 5-5 5"></path>
        </svg>
      </button>
    </section>
  );
}

function EnglishTopics({ m }: Props) {
  return (
    <section className="topics" aria-labelledby="topics-title" id="topics">
      <header className="section-heading">
        <h2 id="topics-title">
          <svg className="sun-icon" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="6"></circle>
            <path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3"></path>
          </svg>
          {" Chủ đề hôm nay "}
        </h2>
        <button
          className="text-button"
          type="button"
          data-all-topics=""
          onClick={m.showTopics}
        >
          {" Xem tất cả chủ đề "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </button>
      </header>
      <div className="topic-grid" data-topic-grid="">
        {m.cards}
      </div>
      <ContinueEnglish m={m} />
    </section>
  );
}

function EnglishGoal({ m }: Props) {
  return (
    <aside className="goal-panel" aria-labelledby="goal-title">
      <div className="goal-panel__heading">
        <svg className="target-icon" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="15" cy="17" r="12"></circle>
          <circle cx="15" cy="17" r="7"></circle>
          <path d="m15 17 12-12m-1-3v5h5"></path>
        </svg>
        <div>
          <h2 id="goal-title">{"Mục tiêu hôm nay"}</h2>
          <p>
            {" Hoàn thành "}
            <span data-goal-total="">{m.goal.total}</span>
            {" chủ đề từ vựng tiếng Anh "}
          </p>
        </div>
      </div>
      <div
        className="goal-ring"
        role="progressbar"
        aria-label="Tiến độ mục tiêu hôm nay"
        aria-valuemin={0}
        aria-valuemax={m.goal.total}
        aria-valuenow={m.goal.completed}
        data-goal-ring=""
        aria-valuetext={m.goalText}
        style={m.goalStyle}
      >
        <svg viewBox="0 0 128 128" aria-hidden="true">
          <circle className="goal-ring__track" cx="64" cy="64" r="52"></circle>
          <circle
            className="goal-ring__value"
            cx="64"
            cy="64"
            r="52"
            pathLength="100"
          ></circle>
        </svg>
        <span className="goal-ring__count" aria-hidden="true">
          <strong data-goal-completed="">{m.goal.completed}</strong>
          <span>{"/"}</span>
          <span data-goal-total="">{m.goal.total}</span>
        </span>
      </div>
      <p className="goal-panel__progress-note" data-goal-note="">
        {m.goalNote}
      </p>
      <div className="vocabulary-stat">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5c3-1 6 0 9 2v14c-3-2-6-3-9-2V5Zm18 0c-3-1-6 0-9 2v14c3-2 6-3 9-2V5Z"></path>
        </svg>
        <div>
          <h3>{"Từ vựng đã học"}</h3>
          <p>
            <strong data-words-learned="">{m.wordsLearned}</strong>
            {" từ"}
          </p>
        </div>
      </div>
      <div className="encouragement">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"></path>
        </svg>
        <p>
          <strong>{"Cố lên!"}</strong>
          <span>{"Mỗi từ mới là một bước khám phá thế giới."}</span>
        </p>
      </div>
    </aside>
  );
}
export function EnglishPage() {
  const m = useEnglish();
  return (
    <DashboardLayout area="english">
      <main className="dashboard-main" id="main-content">
        <div className="dashboard-main__inner">
          <header className="page-heading">
            <div className="island-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <path
                  className="island-mark__water"
                  d="M8 48c8-6 16-6 24 0 8-6 16-6 24 0-6 9-42 9-48 0Z"
                ></path>
                <path
                  className="island-mark__sand"
                  d="M18 44c4-7 24-8 29 0-8 5-21 6-29 0Z"
                ></path>
                <path
                  className="island-mark__trunk"
                  d="m31 42 4-22 5 1-3 23-6-2Z"
                ></path>
                <path
                  className="island-mark__leaf"
                  d="M36 22c-8-9-16-5-19 0 8-1 13 1 17 5M37 21c3-10 12-11 17-7-7 2-11 5-15 11M36 20c-1-9 5-14 11-13-4 4-6 8-7 14"
                ></path>
              </svg>
            </div>
            <div>
              <h1>{"Đảo tiếng Anh"}</h1>
              <p>{"Khám phá từ mới, tự tin mỗi ngày!"}</p>
            </div>
          </header>
          <EnglishHero m={m} />
          <div className="learning-layout">
            <EnglishTopics m={m} />
            <EnglishGoal m={m} />
          </div>
          <p className="preview-note" hidden={!m.isDemo}>
            {" Bản xem thử · Điểm sao và tiến độ đang dùng dữ liệu minh họa. "}
          </p>
        </div>
      </main>
      {m.dialog}
    </DashboardLayout>
  );
}
