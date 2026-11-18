import { useEffect, useState } from "react";
import { data as home } from "../data/home";
import { data as math } from "../data/math";
import { data as english } from "../data/english";
import { Dialog } from "../components/Dialog";

const destinations: Record<string, string> = {
  math: `./math/?lesson=${math.currentStageId}`,
  english: `./english/?topic=${english.resumeTopicId}`,
  badges: "./badges/",
};
function resumeDestination() {
  let subject = home.resumeSubject,
    id: string | null = null;
  try {
    subject = localStorage.getItem("futurelearn-resume-subject") || subject;
    id = localStorage.getItem("futurelearn-resume-item");
  } catch {
    /* Use demo defaults. */
  }
  if (subject !== "math" && subject !== "english") subject = home.resumeSubject;
  const entries = subject === "english" ? english.topics : math.lessons;
  return {
    href: entries.some((entry) => entry.id === id)
      ? `./${subject}/?${subject === "english" ? "topic" : "lesson"}=${encodeURIComponent(id!)}`
      : destinations[subject],
    label: `Tiếp tục học ${subject === "english" ? "Đảo tiếng Anh" : "Hành tinh Toán"}`,
  };
}
function TaskList({ overview = false }: { overview?: boolean }) {
  return (
    <>
      {home.tasks.map((task) => (
        <li key={task.id}>
          {overview ? (
            <>
              <strong>{task.title}</strong>
              <span className="home-dialog__status">
                {task.completed
                  ? "Đã hoàn thành · Có thể ôn lại"
                  : "Chưa hoàn thành"}
              </span>
              <a
                className="button task-card__action"
                href={destinations[task.subject]}
              >
                {task.subject === "badges"
                  ? "Xem huy hiệu"
                  : task.completed
                    ? "Ôn lại"
                    : "Bắt đầu ngay"}
              </a>
            </>
          ) : (
            <a
              className="goal-link"
              href={destinations[task.subject]}
              aria-label={`${task.title}, ${task.completed ? "đã hoàn thành" : "chưa hoàn thành"}`}
            >
              <span
                className={`goal-status${task.completed ? " goal-status--done" : ""}`}
                aria-hidden="true"
              >
                {task.completed && (
                  <svg viewBox="0 0 24 24">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}
              </span>
              {task.title}
            </a>
          )}
        </li>
      ))}
    </>
  );
}
export function useHome() {
  const [resume, setResume] = useState(resumeDestination);
  const [panel, setPanel] = useState<"profile" | "tasks" | null>(null);
  useEffect(() => {
    const refresh = () => setResume(resumeDestination());
    const openPanel = () => {
      const value = new URLSearchParams(location.search).get("panel");
      if (value === "garden") location.replace("./badges/");
      else if (value === "parents") location.replace("./parents/");
      else setPanel(value === "profile" ? "profile" : null);
    };
    function click(event: MouseEvent) {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !link ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        !url.searchParams.has("panel")
      )
        return;
      event.preventDefault();
      history.pushState(null, "", url.href);
      openPanel();
    }
    window.addEventListener("pageshow", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("popstate", openPanel);
    document.addEventListener("click", click);
    openPanel();
    return () => {
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("popstate", openPanel);
      document.removeEventListener("click", click);
    };
  }, []);
  const completed = math.stages.filter(
    (stage) => stage.state === "completed",
  ).length;
  const wordCount = english.topics.reduce(
    (sum, topic) => sum + topic.completed,
    0,
  );
  const totalWords = english.topics.reduce(
    (sum, topic) => sum + topic.total,
    0,
  );
  const completedTasks = home.tasks.filter((task) => task.completed).length;
  return {
    welcome: `Chào ${home.learner.name}, cùng học nào!`,
    resume,
    streak: `${home.streakDays} ngày liên tiếp`,
    isDemo: home.isDemo || math.isDemo || english.isDemo,
    math: {
      completed,
      total: math.stages.length,
      text: `${completed}/${math.stages.length} chặng`,
    },
    english: {
      completed: wordCount,
      total: totalWords,
      text: `${wordCount}/${totalWords} từ`,
    },
    goal: {
      completed: completedTasks,
      total: home.tasks.length,
      text: `${completedTasks}/${home.tasks.length}`,
    },
    goalList: <TaskList />,
    showProfile: () => setPanel("profile"),
    showTasks: () => setPanel("tasks"),
    dialog: (
      <Dialog
        open={panel !== null}
        onClose={() => setPanel(null)}
        title={panel === "tasks" ? "Tất cả nhiệm vụ hôm nay" : "Hồ sơ học viên"}
        id="home-dialog-title"
        className="home-dialog"
        dataAttribute="data-home-dialog"
        backLabel="Quay lại Góc học tập"
      >
        {panel === "tasks" ? (
          <ul className="home-dialog__tasks">
            <TaskList overview />
          </ul>
        ) : (
          <p>
            Bạn đang xem hồ sơ minh họa của {home.learner.name}. Tài khoản học
            viên sẽ được kết nối khi chức năng đăng nhập sẵn sàng.
          </p>
        )}
      </Dialog>
    ),
  };
}
