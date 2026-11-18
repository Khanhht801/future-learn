import { DashboardLayout } from "../components/DashboardLayout";
import { useBadges } from "./Badges";

type Props = { m: ReturnType<typeof useBadges> };
function BadgeHero({ m }: Props) {
  return (
    <section className="badge-hero" aria-labelledby="badge-hero-title">
      <img
        className="badge-hero__art"
        src="./assets/hero.webp"
        width="2172"
        height="724"
        alt="Bạn nhỏ vui mừng giơ cao huy hiệu ngôi sao bên tủ trưng bày thành tích"
        fetchPriority="high"
      />
      <div className="badge-hero__content">
        <h2 id="badge-hero-title">{"Sẵn sàng chinh phục?"}</h2>
        <p>
          {
            "Mở khóa những huy hiệu thú vị khi học tập và hoàn thành các nhiệm vụ. Mỗi huy hiệu là một cột mốc đáng tự hào!"
          }
        </p>
        <button
          className="button button--primary"
          type="button"
          data-my-badges=""
          onClick={() => m.setFilter("earned", true)}
        >
          {"Xem huy hiệu của bé "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}

function CollectionHeading({ m }: Props) {
  return (
    <header className="collection-heading">
      <h2 id="collection-title" tabIndex={-1}>
        <svg
          className="badge-icon badge-icon--star"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="m16 3 4 8 9 1.3-6.5 6.3 1.5 9-8-4.2L8 27.6l1.5-9L3 12.3l9-1.3Z"></path>
        </svg>
        <span data-collection-title="">{m.title}</span>
      </h2>
      <button
        className="collection-link"
        type="button"
        data-all-badges=""
        onClick={() => m.setFilter("all")}
        hidden={m.filter === "all"}
      >
        {"Xem tất cả huy hiệu "}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14m-5-5 5 5-5 5"></path>
        </svg>
      </button>
    </header>
  );
}

function BadgeSummary({ m }: Props) {
  return (
    <aside className="badge-summary" aria-label="Mục tiêu và thành tích của bé">
      <section className="achievement-panel" aria-labelledby="goal-title">
        <div className="achievement-panel__heading">
          <h2 id="goal-title">
            <svg
              className="badge-icon badge-icon--target"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="15" cy="17" r="12"></circle>
              <circle cx="15" cy="17" r="7"></circle>
              <path d="m15 17 12-12m-1-3v5h5"></path>
            </svg>
            {"Mục tiêu hôm nay"}
          </h2>
          <p className="achievement-panel__intro">
            {"Hoàn thành "}
            <span data-goal-total="">{m.goal.total}</span>
            {" nhiệm vụ"}
            <br />
            {"để tiến gần huy hiệu mới!"}
          </p>
        </div>
        <div
          className="goal-ring"
          role="progressbar"
          aria-label="Nhiệm vụ hôm nay"
          aria-valuemin={0}
          data-goal-ring=""
          aria-valuemax={m.goal.total}
          aria-valuenow={m.goal.completed}
          aria-valuetext={m.goalText}
        >
          <svg viewBox="0 0 132 132" aria-hidden="true">
            <circle
              className="goal-ring__track"
              cx="66"
              cy="66"
              r="53"
            ></circle>
            <circle
              className="goal-ring__fill"
              cx="66"
              cy="66"
              r="53"
              pathLength="100"
              data-goal-circle=""
              style={{ strokeDasharray: m.goalPercent + " 100" }}
            ></circle>
          </svg>
          <strong data-goal-count="">{m.goalText}</strong>
        </div>
        <div className="earned-total">
          <img src="./assets/diligent.webp" width="40" height="40" alt="" />
          <div>
            <h3>{"Huy hiệu đã mở khóa"}</h3>
            <p>
              <strong data-earned-count="">{m.earned}</strong>
              {" huy hiệu"}
            </p>
          </div>
        </div>
        <div className="encouragement">
          <svg
            className="badge-icon badge-icon--star"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="m16 3 4 8 9 1.3-6.5 6.3 1.5 9-8-4.2L8 27.6l1.5-9L3 12.3l9-1.3Z"></path>
          </svg>
          <div>
            <strong>{"Cố lên!"}</strong>
            <p data-encouragement="">{m.encouragement}</p>
          </div>
        </div>
      </section>
    </aside>
  );
}

function NextBadge({ m }: Props) {
  return (
    <section
      className="next-badge"
      aria-labelledby="next-badge-title"
      data-next-badge=""
      hidden={!m.next}
    >
      <h3 id="next-badge-title">
        <svg
          className="badge-icon badge-icon--flame"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M17 3c1 7 8 9 8 17a9 9 0 0 1-18 0c0-4 2-7 5-10 0 4 1 5 2 6 3-4 4-8 3-13Z"></path>
          <path d="M16 18c-5 5-4 10 0 10s6-5 0-10Z"></path>
        </svg>
        {"Huy hiệu gần đạt"}
      </h3>
      <div className="next-badge__body">
        <img
          data-next-image=""
          width="100"
          height="100"
          alt=""
          src={m.nextImage}
        />
        <div className="next-badge__info">
          <strong data-next-title="">{m.nextTitle}</strong>
          <p data-next-description="">{m.nextDescription}</p>
          <progress
            data-next-progress=""
            aria-label="Tiến độ huy hiệu gần đạt"
            max={m.next?.target || 1}
            value={m.next?.value || 0}
          ></progress>
        </div>
        <a
          className="button button--primary"
          data-next-link=""
          href={m.next?.href}
        >
          {"Học tiếp "}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5"></path>
          </svg>
        </a>
      </div>
    </section>
  );
}
export function BadgesPage() {
  const m = useBadges();
  return (
    <DashboardLayout area="badges">
      <main className="dashboard-main" id="main-content">
        <div className="dashboard-main__inner">
          <header className="page-heading">
            <span className="badge-heading-art">
              <img src="./assets/diligent.webp" width="64" height="64" alt="" />
            </span>
            <div>
              <h1>{"Bộ sưu tập huy hiệu"}</h1>
              <p>{"Sưu tầm huy hiệu, theo dõi thành tích mỗi ngày!"}</p>
            </div>
          </header>
          <BadgeHero m={m} />
          <div className="badge-layout" id="collection">
            <CollectionHeading m={m} />
            <div
              className="badge-filters"
              role="group"
              aria-label="Lọc bộ sưu tập huy hiệu"
              data-filters=""
              hidden={m.filter === "featured"}
            >
              <button
                type="button"
                data-filter="all"
                aria-pressed={m.filter === "all"}
                onClick={() => m.setFilter("all")}
              >
                {"Tất cả "}
                <span data-total-count="">{m.total}</span>
              </button>
              <button
                type="button"
                data-filter="earned"
                aria-pressed={m.filter === "earned"}
                onClick={() => m.setFilter("earned")}
              >
                {"Đã đạt "}
                <span data-earned-filter-count="">{m.earned}</span>
              </button>
              <button
                type="button"
                data-filter="progress"
                aria-pressed={m.filter === "progress"}
                onClick={() => m.setFilter("progress")}
              >
                {"Đang chinh phục"}
              </button>
              <button
                type="button"
                data-filter="locked"
                aria-pressed={m.filter === "locked"}
                onClick={() => m.setFilter("locked")}
              >
                {"Chưa mở khóa"}
              </button>
            </div>
            <p className="sr-only" role="status" data-filter-status="">
              {m.status}
            </p>
            <section
              className="badge-collection"
              aria-labelledby="collection-title"
            >
              <div className="badge-grid" data-badge-grid="">
                {m.cards}
              </div>
              <div
                className="badge-empty"
                data-badge-empty=""
                hidden={!m.empty}
              >
                <img
                  src="./assets/diligent.webp"
                  width="88"
                  height="88"
                  alt=""
                />
                <h3>{"Huy hiệu đang chờ bé!"}</h3>
                <p>
                  {
                    "Tiếp tục học và hoàn thành nhiệm vụ để nhận huy hiệu đầu tiên nhé."
                  }
                </p>
                <a className="button button--primary" href="../">
                  {"Cùng học nào"}
                </a>
              </div>
            </section>
            <BadgeSummary m={m} />
            <NextBadge m={m} />
          </div>
          <p className="preview-note">
            {
              "Bộ sưu tập minh họa. Huy hiệu đã nhận được lưu trên trình duyệt này; chưa kết nối tài khoản học viên."
            }
          </p>
        </div>
      </main>
      {m.dialog}
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        data-reward-announcement=""
      >
        {m.announcement}
      </p>
    </DashboardLayout>
  );
}
