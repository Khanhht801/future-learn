import { DashboardLayout } from "../components/DashboardLayout";
import { useHome } from "./Home";

type Props = { m: ReturnType<typeof useHome> };
function WelcomeBanner({ m }: Props) {
  return (
    <section className="welcome-banner" aria-labelledby="welcome-title">
      <img
        className="welcome-banner__art"
        src="./assets/learning-adventure.webp"
        width="2172"
        height="724"
        alt=""
        fetchPriority="high"
      />
      <div className="welcome-banner__content">
        <h1 id="welcome-title">{m.welcome}</h1>
        <p>{"Một chút mỗi ngày, khám phá thật nhiều!"}</p>
        <a
          className="button button--primary"
          href={m.resume.href}
          data-resume-learning=""
          aria-label={m.resume.label}
        >
          {"Tiếp tục học "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </a>
      </div>
    </section>
  );
}

function SubjectCards({ m }: Props) {
  return (
    <section className="subject-grid" aria-label="Thế giới học tập">
      <a className="subject-card subject-card--math" href="./math/">
        <div className="subject-card__media">
          <img
            src="./math/assets/math-space-hero.webp"
            width="2172"
            height="724"
            alt="Bạn nhỏ du hành giữa các hành tinh trên tên lửa"
          />
        </div>
        <div className="subject-card__body">
          <div className="subject-card__heading">
            <h2>{"Hành tinh Toán"}</h2>
            <span className="subject-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m9 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
          <p>{"Khám phá thế giới số học thật thú vị!"}</p>
          <div className="subject-card__progress">
            <progress
              value={m.math.completed}
              max={m.math.total}
              aria-label="Tiến độ Hành tinh Toán"
              data-math-progress=""
              aria-valuetext={m.math.text}
            ></progress>
            <span data-math-count="">{m.math.text}</span>
          </div>
        </div>
      </a>
      <a className="subject-card subject-card--english" href="./english/">
        <div className="subject-card__media">
          <img
            src="./english/assets/english-island-v2.webp"
            width="2172"
            height="724"
            alt="Chú vẹt nhiều màu trên hòn đảo tiếng Anh xanh mát"
          />
        </div>
        <div className="subject-card__body">
          <div className="subject-card__heading">
            <h2>{"Đảo tiếng Anh"}</h2>
            <span className="subject-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m9 5 7 7-7 7"></path>
              </svg>
            </span>
          </div>
          <p>{"Học tiếng Anh qua những cuộc phiêu lưu!"}</p>
          <div className="subject-card__progress">
            <progress
              value={m.english.completed}
              max={m.english.total}
              aria-label="Tiến độ từ vựng tiếng Anh"
              data-english-progress=""
              aria-valuetext={m.english.text}
            ></progress>
            <span data-english-count="">{m.english.text}</span>
          </div>
        </div>
      </a>
    </section>
  );
}

function HomeGoals({ m }: Props) {
  return (
    <aside className="home-sidebar" aria-label="Mục tiêu và chuỗi ngày học">
      <section className="daily-goal" aria-labelledby="daily-goal-title">
        <header className="daily-goal__heading">
          <h2 id="daily-goal-title">
            <svg
              className="home-icon home-icon--target"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="15" cy="17" r="12"></circle>
              <circle cx="15" cy="17" r="7"></circle>
              <path d="m15 17 12-12m-1-3v5h5"></path>
            </svg>
            {"Mục tiêu hôm nay"}
          </h2>
          <strong data-goal-count="">{m.goal.text}</strong>
        </header>
        <progress
          className="daily-goal__progress"
          value={m.goal.completed}
          max={m.goal.total}
          aria-label="Số nhiệm vụ hoàn thành hôm nay"
          data-home-goal=""
          aria-valuetext={m.goal.text}
        ></progress>
        <ul className="daily-goal__list" data-goal-list="">
          {m.goalList}
        </ul>
      </section>
      <section className="learning-streak" aria-labelledby="streak-title">
        <div>
          <h2 id="streak-title">
            <svg
              className="home-icon home-icon--flame"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M17 3c1 7 8 9 8 17a9 9 0 0 1-18 0c0-4 2-7 5-10 0 4 1 5 2 6 3-4 4-8 3-13Z"></path>
              <path d="M16 18c-5 5-4 10 0 10s6-5 0-10Z"></path>
            </svg>
            {"Chuỗi ngày học tập"}
          </h2>
          <p className="learning-streak__count" data-streak-count="">
            {m.streak}
          </p>
          <p className="learning-streak__note">{"Cố gắng thêm nữa nhé!"}</p>
        </div>
        <svg className="streak-sprout" viewBox="0 0 112 120" aria-hidden="true">
          <path className="streak-sprout__stem" d="M57 72V42"></path>
          <path
            className="streak-sprout__leaf"
            d="M56 51C32 52 21 35 23 21c22-1 37 9 33 30Zm2-7c0-23 16-31 34-26 0 18-14 29-34 26Z"
          ></path>
          <path
            className="streak-sprout__ground"
            d="M9 110c17-13 74-13 95 0Z"
          ></path>
          <path
            className="streak-sprout__body"
            d="M55 60c30-1 41 51 3 51-43 0-33-50-3-51Z"
          ></path>
          <ellipse cx="44" cy="84" rx="3" ry="4"></ellipse>
          <ellipse cx="68" cy="84" rx="3" ry="4"></ellipse>
          <path className="streak-sprout__smile" d="M51 93q6 6 11-1"></path>
          <path
            className="streak-sprout__sparkle"
            d="m95 57 3 6 6 3-6 3-3 6-3-6-6-3 6-3Zm-79 5 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"
          ></path>
        </svg>
      </section>
    </aside>
  );
}

function DailyTasks({ m }: Props) {
  return (
    <section
      className="daily-tasks"
      id="daily-tasks"
      aria-labelledby="tasks-title"
    >
      <header className="section-heading">
        <h2 id="tasks-title">
          <svg
            className="home-icon home-icon--flag"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M6 29V3m1 2c7-5 12 5 21 0v15c-9 5-14-5-21 0"></path>
          </svg>
          {"Nhiệm vụ hôm nay"}
        </h2>
        <button
          className="text-button"
          type="button"
          data-all-tasks=""
          onClick={m.showTasks}
        >
          {"Xem tất cả "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </button>
      </header>
      <div className="task-grid">
        <article className="task-card task-card--math">
          <div className="task-art task-art--math" aria-hidden="true">
            <span>{"1"}</span>
            <span>{"2"}</span>
            <span>{"3"}</span>
          </div>
          <div className="task-card__body">
            <h3>{"Luyện 5 phép cộng"}</h3>
            <p>{"Hoàn thành 5 bài tập cộng trong Hành tinh Toán."}</p>
            <a
              className="button task-card__action"
              href="./math/?lesson=addition"
            >
              {"Bắt đầu ngay "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-5-5 5 5-5 5"></path>
              </svg>
            </a>
          </div>
        </article>
        <article className="task-card task-card--english">
          <div className="task-art task-art--english" aria-hidden="true">
            <span>{"Aa"}</span>
          </div>
          <div className="task-card__body">
            <h3>{"Học 5 từ mới"}</h3>
            <p>{"Khám phá từ vựng tiếng Anh qua hình ảnh thú vị."}</p>
            <a
              className="button task-card__action"
              href="./english/?topic=animals"
            >
              {"Bắt đầu ngay "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-5-5 5 5-5 5"></path>
              </svg>
            </a>
          </div>
        </article>
        <article className="task-card task-card--badges">
          <div className="task-art task-art--badges" aria-hidden="true">
            <img
              src="./badges/assets/diligent.webp"
              width="110"
              height="110"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="task-card__body">
            <h3>{"Bộ sưu tập huy hiệu"}</h3>
            <p>{"Khám phá huy hiệu và lưu giữ những cột mốc đáng tự hào!"}</p>
            <a className="button task-card__action" href="./badges/">
              {"Khám phá "}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-5-5 5 5-5 5"></path>
              </svg>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
export function HomePage() {
  const m = useHome();
  return (
    <DashboardLayout area="home" onProfile={m.showProfile}>
      <main className="dashboard-main" id="main-content">
        <div className="dashboard-main__inner">
          <WelcomeBanner m={m} />
          <div className="home-overview">
            <SubjectCards m={m} />
            <HomeGoals m={m} />
          </div>
          <DailyTasks m={m} />
          <p className="preview-note" data-demo-note="" hidden={!m.isDemo}>
            {
              "Bản xem thử · Điểm sao, mục tiêu và chuỗi ngày học đang dùng dữ liệu minh họa."
            }
          </p>
        </div>
      </main>
      {m.dialog}
    </DashboardLayout>
  );
}
