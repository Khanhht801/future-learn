import { useEffect, useRef, useState, type CSSProperties } from "react";
import { data } from "../data/badges";
import { useDialog } from "../components/Dialog";
type Badge = (typeof data.badges)[number];
type Filter = "featured" | "all" | "earned" | "progress" | "locked";
const key = "futurelearn-demo-badges-v1";
const labels = {
  earned: "Đã đạt",
  ready: "Sẵn sàng nhận",
  progress: "Đang tiến gần",
  locked: "Chưa mở khóa",
};
function readClaims() {
  const claimed = new Set<string>();
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(saved))
      for (const id of saved)
        if (
          data.badges.some(
            (badge) => badge.id === id && badge.value >= badge.target,
          )
        )
          claimed.add(id);
  } catch {
    /* Corrupt or blocked storage is optional. */
  }
  for (const badge of data.badges)
    if (badge.claimed && badge.value >= badge.target) claimed.add(badge.id);
  return claimed;
}
function state(badge: Badge, claimed: Set<string>) {
  return claimed.has(badge.id)
    ? "earned"
    : badge.value >= badge.target
      ? "ready"
      : badge.value > 0
        ? "progress"
        : "locked";
}
const imageURL = (badge: Badge) => `./assets/${badge.image}.webp`;
const countText = (badge: Badge) =>
  `${Math.min(badge.value, badge.target)}/${badge.target} ${badge.unit}`;
function BadgeCard({
  badge,
  claimed,
  open,
}: {
  badge: Badge;
  claimed: Set<string>;
  open: (badge: Badge) => void;
}) {
  const status = state(badge, claimed);
  return (
    <button
      className={`badge-card badge-card--${status}`}
      type="button"
      data-badge-id={badge.id}
      aria-label={`${badge.name}, ${labels[status]}, ${countText(badge)}. ${status === "ready" ? "Mở để nhận huy hiệu." : "Xem chi tiết."}`}
      onClick={() => open(badge)}
    >
      <span className="badge-card__top">
        <img
          className="badge-card__art"
          src={imageURL(badge)}
          alt=""
          width="140"
          height="125"
          loading="lazy"
        />
        <span className={`badge-status badge-status--${status}`}>
          {status === "earned" ? (
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" fill="currentColor" stroke="none" />
              <path d="m6 10 3 3 5-6" stroke="white" />
            </svg>
          ) : status === "locked" ? (
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <rect x="4" y="8" width="12" height="9" rx="2" />
              <path d="M7 8V6a3 3 0 0 1 6 0v2m-3 4v2" />
            </svg>
          ) : null}
          {labels[status]}
        </span>
      </span>
      <span className="badge-card__name">{badge.name}</span>
      <span className="badge-card__description">{badge.description}</span>
      <span className="badge-card__progress">
        <progress
          max={badge.target}
          value={Math.min(badge.value, badge.target)}
          aria-label={`Tiến độ ${badge.name}`}
          aria-valuetext={countText(badge)}
        />
        <span className="badge-card__count">{countText(badge)}</span>
      </span>
    </button>
  );
}
function RewardStage({
  badge,
  celebrate,
}: {
  badge: Badge | null;
  celebrate: boolean;
}) {
  return (
    <div className="reward-stage">
      <div className="reward-rays" aria-hidden="true" />
      <div className="reward-orbit" aria-hidden="true" />
      <div className="reward-confetti" aria-hidden="true" data-confetti>
        {celebrate &&
          Array.from({ length: 28 }, (_, index) => {
            const angle = (index / 28) * Math.PI * 2,
              distance = 100 + ((index * 37) % 80);
            return (
              <i
                key={index}
                style={
                  {
                    "--confetti-x": `${Math.cos(angle) * distance}px`,
                    "--confetti-y": `${Math.sin(angle) * distance + 50}px`,
                    "--confetti-turn": `${(index % 2 ? 1 : -1) * (180 + index * 23)}deg`,
                    "--confetti-delay": `${(index % 5) * 25}ms`,
                    "--confetti-color": [
                      "#ffcf40",
                      "#39b9ec",
                      "#f37aa2",
                      "#4bc78c",
                      "#6675ec",
                    ][index % 5],
                  } as CSSProperties
                }
              />
            );
          })}
      </div>
      <img
        className="reward-art"
        data-dialog-image
        src={badge ? imageURL(badge) : undefined}
        width="220"
        height="220"
        alt=""
      />
    </div>
  );
}
function BadgeDialog({
  badge,
  claimed,
  onClose,
  claim,
  storageAvailable,
}: {
  badge: Badge | null;
  claimed: Set<string>;
  onClose: () => void;
  claim: () => void;
  storageAvailable: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const done = useRef<HTMLButtonElement>(null);
  const claimButton = useRef<HTMLButtonElement>(null);
  const status = badge ? state(badge, claimed) : "locked";
  const [replay, setReplay] = useState(0);
  const celebrate = status === "earned";
  useDialog(badge !== null, onClose, ref);
  useEffect(() => {
    if (celebrate) done.current?.focus();
    else if (badge && status === "ready") claimButton.current?.focus();
  }, [celebrate, badge, status, replay]);
  return (
    <dialog
      ref={ref}
      className={`topic-dialog badge-dialog${celebrate ? " is-celebrating" : ""}`}
      aria-labelledby="badge-dialog-title"
      aria-describedby="badge-dialog-description"
      data-badge-dialog
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const b = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < b.left ||
            event.clientX > b.right ||
            event.clientY < b.top ||
            event.clientY > b.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="icon-button badge-dialog__close"
        type="button"
        aria-label="Đóng huy hiệu"
        data-dialog-close
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
      <RewardStage
        key={`${badge?.id}-${replay}-${celebrate}`}
        badge={badge}
        celebrate={celebrate}
      />
      <p className="badge-dialog__eyebrow" data-dialog-eyebrow>
        {celebrate ? "Chúc mừng bé!" : labels[status]}
      </p>
      <h2 id="badge-dialog-title" data-dialog-title>
        {badge?.name}
      </h2>
      <p id="badge-dialog-description" data-dialog-description>
        {celebrate
          ? "Một cột mốc thật đáng tự hào! Huy hiệu mới đã có trong bộ sưu tập của bé."
          : badge?.description}
      </p>
      <div
        className="badge-dialog__progress"
        data-dialog-progress-wrap
        hidden={celebrate}
      >
        <progress
          data-dialog-progress
          max={badge?.target || 1}
          value={badge ? Math.min(badge.value, badge.target) : 0}
          aria-label="Tiến độ huy hiệu"
        />
        <span data-dialog-count>{badge && countText(badge)}</span>
      </div>
      <div className="badge-dialog__actions">
        <button
          ref={claimButton}
          className="button button--primary"
          type="button"
          data-claim-badge
          hidden={status !== "ready"}
          onClick={claim}
        >
          Nhận huy hiệu
        </button>
        <a
          className="button button--primary"
          data-dialog-learn
          href={badge?.href}
          hidden={status === "ready" || celebrate}
        >
          Tiếp tục học
        </a>
        <button
          ref={done}
          className="button button--primary"
          type="button"
          data-reward-done
          hidden={!celebrate}
          onClick={onClose}
        >
          Tuyệt vời!
        </button>
        <button
          className="collection-link"
          type="button"
          data-replay-reward
          hidden={!celebrate}
          onClick={() => setReplay((value) => value + 1)}
        >
          Xem lại khoảnh khắc
        </button>
      </div>
      <p className="badge-dialog__note" data-dialog-note>
        {storageAvailable
          ? "Huy hiệu minh họa · Lưu trên trình duyệt này"
          : "Trình duyệt đang chặn lưu trữ. Huy hiệu chỉ được giữ trong lần xem này."}
      </p>
    </dialog>
  );
}
export function useBadges() {
  const [claimed, setClaimed] = useState(readClaims);
  const [filter, updateFilter] = useState<Filter>("featured");
  const [badge, setBadge] = useState<Badge | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const refresh = (event: StorageEvent) => {
      if (event.key === key || event.key === null) setClaimed(readClaims());
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const visible = data.badges.filter((badge) =>
    filter === "featured"
      ? badge.featured
      : filter === "all"
        ? true
        : filter === "progress"
          ? ["progress", "ready"].includes(state(badge, claimed))
          : state(badge, claimed) === filter,
  );
  const next = data.badges
    .filter((badge) => state(badge, claimed) === "progress")
    .sort((a, b) => b.value / b.target - a.value / a.target)[0];
  const setFilter = (value: Filter, scroll = false) => {
    updateFilter(value);
    document.getElementById("collection-title")?.focus({ preventScroll: true });
    if (scroll)
      document
        .getElementById("collection")
        ?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
          block: "start",
        });
  };
  const claim = () => {
    if (!badge || state(badge, claimed) !== "ready") return;
    const next = new Set(claimed).add(badge.id);
    try {
      localStorage.setItem(key, JSON.stringify([...next]));
    } catch {
      setStorageAvailable(false);
    }
    setClaimed(next);
    setAnnouncement(
      `Chúc mừng! Bé đã nhận huy hiệu ${badge.name}. Bộ sưu tập hiện có ${next.size} huy hiệu.`,
    );
  };
  const goal = data.dailyGoal;
  return {
    filter,
    setFilter,
    title:
      filter === "featured"
        ? "Huy hiệu nổi bật"
        : filter === "earned"
          ? "Huy hiệu của bé"
          : "Bộ sưu tập huy hiệu",
    total: data.badges.length,
    earned: claimed.size,
    status: `Đang hiển thị ${visible.length} huy hiệu.`,
    empty: visible.length === 0,
    cards: visible.map((badge) => (
      <BadgeCard
        key={badge.id}
        badge={badge}
        claimed={claimed}
        open={setBadge}
      />
    )),
    goal,
    goalText: `${goal.completed}/${goal.total}`,
    goalPercent: goal.total
      ? Math.min(100, (goal.completed / goal.total) * 100)
      : 0,
    encouragement:
      goal.completed < goal.total
        ? `Chỉ còn ${goal.total - goal.completed} nhiệm vụ nữa thôi!`
        : "Bé đã hoàn thành mục tiêu hôm nay. Giỏi lắm!",
    next,
    nextImage: next ? imageURL(next) : undefined,
    nextTitle: next ? `${next.name} · ${countText(next)}` : "",
    nextDescription: next
      ? `Còn ${next.target - next.value} ${next.unit} nữa để nhận huy hiệu ${next.name}!`
      : "",
    dialog: (
      <BadgeDialog
        badge={badge}
        claimed={claimed}
        onClose={() => setBadge(null)}
        claim={claim}
        storageAvailable={storageAvailable}
      />
    ),
    announcement,
  };
}
