import { useState } from "react";
import { data } from "../data/parents";
import { Dialog } from "../components/Dialog";
type Subject = (typeof data.subjects)[number];
function Icon({ id }: { id: string }) {
  return (
    <svg className="parent-icon" aria-hidden="true">
      <use href={`#icon-${id}`} />
    </svg>
  );
}
function ActivityItems({ all = false }: { all?: boolean }) {
  return (
    <>
      {(all ? data.activities : data.activities.slice(0, 4)).map((activity) => (
        <li key={activity.date} className={`activity--${activity.subject}`}>
          <a className="activity-link" href={activity.href}>
            <span className="activity-icon">
              <Icon
                id={
                  activity.subject === "english"
                    ? "book"
                    : activity.subject === "math"
                      ? "math"
                      : "star"
                }
              />
            </span>
            <div className="activity-text">
              <strong>{activity.title}</strong>
              <p>{activity.detail}</p>
            </div>
            <time dateTime={activity.date}>{activity.label}</time>
          </a>
        </li>
      ))}
    </>
  );
}
function SubjectRow({ subject }: { subject: Subject }) {
  return (
    <div className="subject-progress">
      <span
        className={`subject-progress__art subject-progress__art--${subject.id}`}
      >
        {subject.id === "math" ? (
          <img
            src="../shared/assets/math-planet.svg"
            alt=""
            width="50"
            height="50"
          />
        ) : (
          <Icon id="island" />
        )}
      </span>
      <div>
        <h3>
          <a href={subject.href}>{subject.name}</a>
        </h3>
        <p>
          {subject.completed}/{subject.total} {subject.unit} đã hoàn thành
        </p>
        <progress
          className={subject.id === "english" ? "progress--green" : undefined}
          max={subject.total}
          value={subject.completed}
          aria-label={`Tiến độ ${subject.name}`}
          aria-valuetext={`${subject.completed}/${subject.total} ${subject.unit} đã hoàn thành`}
          data-subject={subject.id}
        />
      </div>
      <strong className="subject-progress__percent">
        {Math.round((subject.completed / subject.total) * 100)}%
      </strong>
    </div>
  );
}
function ProgressDetails() {
  return (
    <>
      <p className="report-note">
        Tiến độ minh họa, dùng chung dữ liệu với các trang học của con.
      </p>
      {data.subjects.map((subject) => (
        <section key={subject.id} className="report-subject">
          <h3>{subject.name}</h3>
          <p>
            {subject.completed}/{subject.total} {subject.unit} đã hoàn thành ·{" "}
            {Math.round((subject.completed / subject.total) * 100)}%
          </p>
          <ul className="report-items">
            {subject.items.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.status}</span>
              </li>
            ))}
          </ul>
          <a className="parent-link" href={subject.href}>
            Mở {subject.name}
            <Icon id="arrow" />
          </a>
        </section>
      ))}
    </>
  );
}
function ChartSeries({ history }: { history: typeof data.history }) {
  const x = (index: number) => 52 + (index * 480) / (history.length - 1);
  const y = (value: number) => 177 - value * 1.52;
  return (
    <>
      <title id="progress-chart-title">
        Tỷ lệ hoàn thành trong {history.length} tuần gần đây
      </title>
      {[0, 25, 50, 75, 100].map((value) => (
        <g key={value}>
          <line
            x1="52"
            x2="532"
            y1={y(value)}
            y2={y(value)}
            className="chart-grid"
          />
          <text
            x="40"
            y={y(value) + 5}
            textAnchor="end"
            className="chart-label"
          >
            {value}%
          </text>
        </g>
      ))}
      {history.map((week, index) => (
        <text
          key={week.label}
          x={x(index)}
          y="205"
          textAnchor="middle"
          className="chart-label"
        >
          {week.label}
        </text>
      ))}
      {(["math", "english"] as const).map((subject) => {
        const points = history
          .map((week, index) => `${x(index)},${y(week[subject])}`)
          .join(" ");
        return (
          <g key={subject} className={`chart-series--${subject}`}>
            <polygon
              points={`52,177 ${points} 532,177`}
              className="chart-area"
            />
            <polyline points={points} className="chart-line" />
            {history.map((week, index) => (
              <circle
                key={week.label}
                cx={x(index)}
                cy={y(week[subject])}
                r="5"
                className="chart-point"
              >
                <title>
                  {week.label}: {week[subject]}%{" "}
                  {subject === "math" ? "Toán" : "tiếng Anh"}
                </title>
              </circle>
            ))}
          </g>
        );
      })}
    </>
  );
}
export function useParents() {
  const [weeks, setWeeks] = useState(4);
  const [panel, setPanel] = useState<
    "profile" | "progress" | "activities" | null
  >(null);
  const history = data.history.slice(-weeks),
    latest = history[history.length - 1];
  return {
    name: data.learner.name,
    week: `${data.learner.grade} · Tuần ${data.weekLabel}`,
    message: `Con đã hoàn thành ${data.weeklyGoal.completed} bài học trong tuần.`,
    completedText: `${data.weeklyGoal.completed}/${data.weeklyGoal.total}`,
    goal: data.weeklyGoal,
    accuracy: data.accuracy,
    accuracyText: `${data.accuracy}%`,
    streak: `${data.streakDays} ngày`,
    stars: data.stars,
    subjects: data.subjects.map((subject) => (
      <SubjectRow key={subject.id} subject={subject} />
    )),
    activities: <ActivityItems />,
    weeks,
    setWeeks,
    chart: <ChartSeries history={history} />,
    rows: history.map((week) => (
      <tr key={week.label}>
        <th scope="row">{week.label}</th>
        <td>{week.math}%</td>
        <td>{week.english}%</td>
      </tr>
    )),
    description: `Tiến độ ${weeks} tuần từ ${history[0].label} đến ${latest.label}. Tuần mới nhất: Toán ${latest.math}%, tiếng Anh ${latest.english}%. Xem bảng số liệu bên dưới để đọc từng tuần.`,
    status: `Đang hiển thị ${weeks} tuần gần đây.`,
    showProgress: () => setPanel("progress"),
    showActivities: () => setPanel("activities"),
    showProfile: () => setPanel("profile"),
    dialog: (
      <Dialog
        open={panel !== null}
        onClose={() => setPanel(null)}
        title={
          panel === "profile"
            ? "Hồ sơ học viên"
            : panel === "progress"
              ? "Chi tiết tiến độ học tập"
              : "Tất cả hoạt động"
        }
        id="parent-dialog-title"
        className="parent-dialog"
        dataAttribute="data-parent-dialog"
      >
        {panel === "progress" ? (
          <div>
            <ProgressDetails />
          </div>
        ) : panel === "activities" ? (
          <div>
            <p className="report-note">
              Các hoạt động minh họa từ 17/10 đến 22/10/2026.
            </p>
            <ol className="activity-list">
              <ActivityItems all />
            </ol>
          </div>
        ) : (
          <div>
            <p>
              {data.learner.name} · {data.learner.grade}
            </p>
            <p className="report-note">
              Bạn đang xem hồ sơ minh họa. Báo cáo sẽ được đồng bộ khi tài khoản
              học viên được kết nối.
            </p>
          </div>
        )}
      </Dialog>
    ),
  };
}
