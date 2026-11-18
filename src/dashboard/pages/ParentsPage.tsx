import { DashboardLayout } from "../components/DashboardLayout";
import { useParents } from "./Parents";

type Props = { m: ReturnType<typeof useParents> };
function ParentOverview({ m }: Props) {
  return (
    <section className="parent-overview" aria-label="Tổng quan học tập của con">
      <article className="learner-card parent-panel">
        <div className="learner-card__profile">
          <svg
            className="learner-avatar"
            viewBox="150 610 365 400"
            role="img"
            aria-label="Ảnh đại diện minh họa của An"
          >
            <image
              href="../shared/assets/learning-companions.png"
              width="1122"
              height="1402"
            ></image>
          </svg>
          <div>
            <h2 data-learner-name="">{m.name}</h2>
            <p data-learner-week="">{m.week}</p>
          </div>
        </div>
        <span className="learner-status">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-chart"></use>
          </svg>
          {"Đang tiến bộ"}
        </span>
        <div className="learner-card__message">
          <p data-week-message="">{m.message}</p>
          <p>{"Cùng con giữ thói quen học tập tốt nhé!"}</p>
        </div>
        <svg
          className="learner-card__art"
          viewBox="50 280 1030 920"
          aria-hidden="true"
        >
          <image
            href="../shared/assets/learning-companions.png"
            width="1122"
            height="1402"
          ></image>
        </svg>
      </article>
      <article className="stat-card parent-panel">
        <span className="stat-icon stat-icon--blue">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-book"></use>
          </svg>
        </span>
        <strong data-week-completed="">{m.completedText}</strong>
        <h2>{"Bài học trong tuần"}</h2>
        <progress
          data-week-progress=""
          aria-label="Bài học hoàn thành trong tuần"
          max={m.goal.total}
          value={m.goal.completed}
        ></progress>
      </article>
      <article className="stat-card parent-panel">
        <span className="stat-icon stat-icon--coral">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-target"></use>
          </svg>
        </span>
        <strong data-accuracy="">{m.accuracyText}</strong>
        <h2>{"Độ chính xác"}</h2>
        <progress
          className="progress--green"
          data-accuracy-progress=""
          aria-label="Độ chính xác trong tuần"
          max="100"
          value={m.accuracy}
        ></progress>
      </article>
      <article className="stat-card parent-panel">
        <span className="stat-icon stat-icon--blue">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-calendar"></use>
          </svg>
        </span>
        <strong data-streak="">{m.streak}</strong>
        <h2>{"Học liên tiếp"}</h2>
        <p className="stat-caption">{"Mỗi ngày một chút"}</p>
      </article>
      <article className="stat-card parent-panel">
        <span className="stat-icon stat-icon--gold">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-star"></use>
          </svg>
        </span>
        <strong data-parent-stars="">{m.stars}</strong>
        <h2>{"Sao tích lũy"}</h2>
        <a className="stat-reward-link" href="../badges/">
          {"Xem huy hiệu "}
          <span aria-hidden="true">{"›"}</span>
        </a>
      </article>
    </section>
  );
}

function SubjectProgress({ m }: Props) {
  return (
    <section
      className="parent-panel subject-panel"
      id="subject-progress"
      aria-labelledby="subject-title"
    >
      <header className="panel-heading">
        <h2 id="subject-title">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-chart"></use>
          </svg>
          {"Tiến độ theo môn học"}
        </h2>
        <button
          className="parent-link"
          type="button"
          data-open-progress=""
          onClick={m.showProgress}
        >
          {"Xem chi tiết "}
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-arrow"></use>
          </svg>
        </button>
      </header>
      <div className="subject-progress-list" data-subject-progress="">
        {m.subjects}
      </div>
    </section>
  );
}

function ProgressChart({ m }: Props) {
  return (
    <section className="parent-panel chart-panel" aria-labelledby="chart-title">
      <header className="panel-heading">
        <h2 id="chart-title">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-chart"></use>
          </svg>
          {"Biểu đồ tiến bộ"}
        </h2>
        <label className="chart-period">
          <span className="sr-only">{"Khoảng thời gian biểu đồ"}</span>
          <select
            data-chart-period=""
            value={m.weeks}
            onChange={(event) => m.setWeeks(Number(event.target.value))}
          >
            <option value="4">{"4 tuần gần đây"}</option>
            <option value="8">{"8 tuần gần đây"}</option>
          </select>
        </label>
      </header>
      <div className="chart-legend" aria-hidden="true">
        <span>
          <i className="legend-dot legend-dot--math"></i>
          {"Toán"}
        </span>
        <span>
          <i className="legend-dot legend-dot--english"></i>
          {"Tiếng Anh"}
        </span>
      </div>
      <figure className="progress-chart">
        <svg
          viewBox="0 0 560 215"
          role="img"
          aria-labelledby="progress-chart-title progress-chart-description"
          data-progress-chart=""
        >
          {m.chart}
        </svg>
        <figcaption
          className="sr-only"
          id="progress-chart-description"
          data-chart-description=""
        >
          {m.description}
        </figcaption>
      </figure>
      <details className="chart-data">
        <summary>{"Xem số liệu"}</summary>
        <div className="chart-table-wrap">
          <table>
            <caption className="sr-only">
              {"Tỷ lệ hoàn thành theo tuần"}
            </caption>
            <thead>
              <tr>
                <th scope="col">{"Tuần"}</th>
                <th scope="col">{"Toán"}</th>
                <th scope="col">{"Tiếng Anh"}</th>
              </tr>
            </thead>
            <tbody data-chart-table="">{m.rows}</tbody>
          </table>
        </div>
      </details>
      <p className="sr-only" role="status" data-chart-status="">
        {m.status}
      </p>
    </section>
  );
}

function RecentActivities({ m }: Props) {
  return (
    <section
      className="parent-panel activity-panel"
      aria-labelledby="activity-title"
    >
      <header className="panel-heading">
        <h2 id="activity-title">
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-clock"></use>
          </svg>
          {"Hoạt động gần đây"}
        </h2>
        <button
          className="parent-link"
          type="button"
          data-open-activities=""
          onClick={m.showActivities}
        >
          {"Xem tất cả "}
          <svg className="parent-icon" aria-hidden="true">
            <use href="#icon-arrow"></use>
          </svg>
        </button>
      </header>
      <ol className="activity-list" data-recent-activities="">
        {m.activities}
      </ol>
    </section>
  );
}

function ParentTips({ m }: Props) {
  return (
    <section className="parent-panel tips-panel" aria-labelledby="tips-title">
      <header className="panel-heading">
        <h2 id="tips-title">
          <svg className="parent-icon tips-icon" aria-hidden="true">
            <use href="#icon-bulb"></use>
          </svg>
          {"Nhận xét & gợi ý cho phụ huynh"}
        </h2>
      </header>
      <div className="parent-tip">
        <img
          src="../badges/assets/vocabulary.webp"
          width="96"
          height="96"
          alt=""
          loading="lazy"
        />
        <div className="parent-tip__bubble">
          <p>
            {
              "An đang tiến bộ qua từng chặng Toán và đã bắt đầu làm quen với phép cộng. Với tiếng Anh, con đã khám phá từ vựng về Động vật và Trái cây."
            }
          </p>
          <p>
            {"Ba mẹ có thể dành "}
            <strong>{"5–10 phút mỗi ngày"}</strong>
            {" cùng con ôn lại từ đã học qua đồ vật, tranh ảnh nhé!"}
          </p>
        </div>
      </div>
      <a className="parent-link tip-action" href="../english/?topic=animals">
        {"Cùng con ôn từ vựng "}
        <svg className="parent-icon" aria-hidden="true">
          <use href="#icon-arrow"></use>
        </svg>
      </a>
    </section>
  );
}
export function ParentsPage() {
  const m = useParents();
  return (
    <DashboardLayout area="parents" onProfile={m.showProfile}>
      <svg
        className="icon-library"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <symbol id="icon-family" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3"></circle>
          <path d="M3.5 20v-3a5 5 0 0 1 10 0v3M16 5.5a3 3 0 0 1 0 6M16 13a4.5 4.5 0 0 1 4.5 4.5V20"></path>
        </symbol>
        <symbol id="icon-book" viewBox="0 0 24 24">
          <path d="M12 6C9 4 5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-2-1-6-1-9 1Zm0 0v14M6 8h3M6 11h3m6-3h3m-3 3h3"></path>
        </symbol>
        <symbol id="icon-chart" viewBox="0 0 24 24">
          <path d="M3 4v17h19M7 16v-5h3v5Zm6 0V6h3v10Zm6 0V2h3v14Z"></path>
        </symbol>
        <symbol id="icon-target" viewBox="0 0 24 24">
          <circle cx="11" cy="13" r="9"></circle>
          <circle cx="11" cy="13" r="5"></circle>
          <path d="m11 13 9-10m-1-2v4h4"></path>
        </symbol>
        <symbol id="icon-calendar" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="2"></rect>
          <path d="M3 10h18M8 3v4m8-4v4M7 14h2m2 0h2m2 0h2M7 17h2m2 0h2"></path>
        </symbol>
        <symbol id="icon-star" viewBox="0 0 24 24">
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"></path>
        </symbol>
        <symbol id="icon-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 6v6l4 2"></path>
        </symbol>
        <symbol id="icon-bulb" viewBox="0 0 24 24">
          <path d="M8 16c0-3-3-3.5-3-7a7 7 0 0 1 14 0c0 3.5-3 4-3 7ZM8 19h8m-6 3h4M12 5v4"></path>
        </symbol>
        <symbol id="icon-arrow" viewBox="0 0 24 24">
          <path d="M5 12h14m-5-5 5 5-5 5"></path>
        </symbol>
        <symbol id="icon-math" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2"></rect>
          <path d="M7 6h10M7 11h2m6 0h2M7 15h2m6 0h2M7 19h2m6 0h2"></path>
        </symbol>
        <symbol id="icon-island" viewBox="0 0 24 24">
          <path d="M3 21c3-4 15-4 18 0ZM11 18l2-9M13 10C9 4 5 6 3 9c4-1 6 0 10 3M13 10c1-5 5-6 8-3-4 0-6 2-8 5M13 9c-1-4 1-6 4-7-2 3-2 6-2 8"></path>
        </symbol>
      </svg>
      <main className="dashboard-main" id="main-content">
        <div className="dashboard-main__inner">
          <header className="page-heading">
            <span className="parents-heading-icon">
              <svg className="parent-icon" aria-hidden="true">
                <use href="#icon-family"></use>
              </svg>
            </span>
            <div>
              <h1>{"Góc phụ huynh"}</h1>
              <p>{"Đồng hành cùng con trên hành trình học tập"}</p>
            </div>
          </header>
          <ParentOverview m={m} />
          <div className="parent-columns">
            <SubjectProgress m={m} />
            <ProgressChart m={m} />
            <RecentActivities m={m} />
            <ParentTips m={m} />
          </div>
          <p className="preview-note">
            {
              "Dữ liệu minh họa · Báo cáo tuần 19/10 – 25/10/2026. Chưa kết nối tài khoản học viên."
            }
          </p>
        </div>
      </main>
      {m.dialog}
    </DashboardLayout>
  );
}
