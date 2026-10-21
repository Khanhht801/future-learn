(function () {
  "use strict";
  const data = window.badgeDashboardData;
  if (!data) return;
  const select = function (selector) { return document.querySelector(selector); };
  const storageKey = "futurelearn-demo-badges-v1";
  const dialog = select("[data-badge-dialog]");
  const claimed = new Set();
  let filter = "featured";
  let activeBadge = null;
  let returnFocus = null;
  let storageAvailable = true;

  function loadClaims() {
    claimed.clear();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) saved.forEach(function (id) {
        if (data.badges.some(function (badge) { return badge.id === id && badge.value >= badge.target; })) claimed.add(id);
      });
    } catch (error) { /* A missing, corrupt or blocked store does not block rewards. */ }
    data.badges.forEach(function (badge) { if (badge.claimed && badge.value >= badge.target) claimed.add(badge.id); });
  }
  loadClaims();

  const imageURL = function (badge) { return "./assets/" + badge.image + ".webp"; };
  const value = function (badge) { return Math.min(badge.value, badge.target); };
  const countText = function (badge) { return value(badge) + "/" + badge.target + " " + badge.unit; };
  function state(badge) {
    if (claimed.has(badge.id)) return "earned";
    if (badge.value >= badge.target) return "ready";
    return badge.value > 0 ? "progress" : "locked";
  }
  const labels = { earned: "Đã đạt", ready: "Sẵn sàng nhận", progress: "Đang tiến gần", locked: "Chưa mở khóa" };
  const icons = {
    earned: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="currentColor" stroke="none" /><path d="m6 10 3 3 5-6" stroke="white" /></svg>',
    locked: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2" /><path d="M7 8V6a3 3 0 0 1 6 0v2m-3 4v2" /></svg>'
  };
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function makeCard(badge) {
    const badgeState = state(badge);
    const card = element("button", "badge-card badge-card--" + badgeState);
    card.type = "button";
    card.dataset.badgeId = badge.id;
    card.setAttribute("aria-label", badge.name + ", " + labels[badgeState] + ", " + countText(badge) + ". " + (badgeState === "ready" ? "Mở để nhận huy hiệu." : "Xem chi tiết."));
    const top = element("span", "badge-card__top");
    const image = element("img", "badge-card__art");
    image.src = imageURL(badge);
    image.alt = "";
    image.width = 140;
    image.height = 125;
    image.loading = "lazy";
    const status = element("span", "badge-status badge-status--" + badgeState);
    // Only fixed, local SVG strings enter this markup.
    status.innerHTML = icons[badgeState] || "";
    status.append(document.createTextNode(labels[badgeState]));
    top.append(image, status);
    const progressRow = element("span", "badge-card__progress");
    const progress = element("progress");
    progress.max = badge.target;
    progress.value = value(badge);
    progress.setAttribute("aria-label", "Tiến độ " + badge.name);
    progress.setAttribute("aria-valuetext", countText(badge));
    progressRow.append(progress, element("span", "badge-card__count", countText(badge)));
    card.append(top, element("span", "badge-card__name", badge.name), element("span", "badge-card__description", badge.description), progressRow);
    return card;
  }

  function render() {
    const visible = data.badges.filter(function (badge) {
      if (filter === "featured") return badge.featured;
      if (filter === "all") return true;
      const badgeState = state(badge);
      return filter === "progress" ? badgeState === "progress" || badgeState === "ready" : badgeState === filter;
    });
    select("[data-badge-grid]").replaceChildren(...visible.map(makeCard));
    select("[data-badge-empty]").hidden = visible.length > 0;
    select("[data-earned-count]").textContent = claimed.size;
    select("[data-earned-filter-count]").textContent = claimed.size;
    select("[data-total-count]").textContent = data.badges.length;
    select("[data-collection-title]").textContent = filter === "featured" ? "Huy hiệu nổi bật" : filter === "earned" ? "Huy hiệu của bé" : "Bộ sưu tập huy hiệu";
    select("[data-filter-status]").textContent = "Đang hiển thị " + visible.length + " huy hiệu.";
    select("[data-filters]").hidden = filter === "featured";
    select("[data-all-badges]").hidden = filter === "all";
    document.querySelectorAll("[data-filter]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.filter === filter)); });
    renderNextBadge();
  }

  function renderNextBadge() {
    const next = data.badges.filter(function (badge) { return state(badge) === "progress"; })
      .sort(function (a, b) { return b.value / b.target - a.value / a.target; })[0];
    select("[data-next-badge]").hidden = !next;
    if (!next) return;
    select("[data-next-image]").src = imageURL(next);
    select("[data-next-title]").textContent = next.name + " · " + countText(next);
    select("[data-next-description]").textContent = "Còn " + (next.target - next.value) + " " + next.unit + " nữa để nhận huy hiệu " + next.name + "!";
    select("[data-next-progress]").max = next.target;
    select("[data-next-progress]").value = next.value;
    select("[data-next-link]").href = next.href;
  }

  function setFilter(nextFilter, scroll) {
    filter = nextFilter;
    render();
    if (scroll) {
      select("#collection-title").focus({ preventScroll: true });
      select("#collection").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  }
  select("[data-all-badges]").addEventListener("click", function () {
    setFilter("all", false);
    select("#collection-title").focus({ preventScroll: true });
  });
  select("[data-my-badges]").addEventListener("click", function () { setFilter("earned", true); });
  document.querySelectorAll("[data-filter]").forEach(function (button) { button.addEventListener("click", function () { setFilter(button.dataset.filter, false); }); });

  const goal = data.dailyGoal;
  select("[data-goal-total]").textContent = goal.total;
  select("[data-goal-count]").textContent = goal.completed + "/" + goal.total;
  select("[data-goal-circle]").style.strokeDasharray = (goal.total ? Math.min(100, goal.completed / goal.total * 100) : 0) + " 100";
  select("[data-goal-ring]").setAttribute("aria-valuemax", goal.total);
  select("[data-goal-ring]").setAttribute("aria-valuenow", goal.completed);
  select("[data-goal-ring]").setAttribute("aria-valuetext", goal.completed + " trên " + goal.total + " nhiệm vụ");
  select("[data-encouragement]").textContent = goal.completed < goal.total ? "Hoàn thành thêm " + (goal.total - goal.completed) + " nhiệm vụ để tiến gần huy hiệu mới." : "Bé đã hoàn thành mục tiêu hôm nay. Giỏi lắm!";
  select(".profile-button__avatar").textContent = data.learner.initials;
  select("[data-reward-chip]").setAttribute("aria-label", data.stars + " sao minh họa");
  document.querySelectorAll("[data-open-profile]").forEach(function (button) { button.addEventListener("click", function () { location.href = "../?panel=profile"; }); });

  function renderDialog(celebrate) {
    const badge = activeBadge;
    const badgeState = state(badge);
    dialog.classList.remove("is-celebrating");
    select("[data-dialog-image]").src = imageURL(badge);
    select("[data-dialog-title]").textContent = badge.name;
    select("[data-dialog-eyebrow]").textContent = celebrate ? "Chúc mừng bé!" : labels[badgeState];
    select("[data-dialog-description]").textContent = celebrate ? "Một cột mốc thật đáng tự hào! Huy hiệu mới đã có trong bộ sưu tập của bé." : badge.description;
    select("[data-dialog-progress-wrap]").hidden = celebrate;
    select("[data-dialog-progress]").max = badge.target;
    select("[data-dialog-progress]").value = value(badge);
    select("[data-dialog-count]").textContent = countText(badge);
    select("[data-claim-badge]").hidden = badgeState !== "ready" || celebrate;
    select("[data-dialog-learn]").hidden = badgeState === "ready" || badgeState === "earned" || celebrate;
    select("[data-dialog-learn]").href = badge.href;
    select("[data-reward-done]").hidden = !celebrate && badgeState !== "earned";
    select("[data-replay-reward]").hidden = badgeState !== "earned";
    select("[data-dialog-note]").textContent = storageAvailable ? "Huy hiệu minh họa · Lưu trên trình duyệt này" : "Trình duyệt đang chặn lưu trữ. Huy hiệu chỉ được giữ trong lần xem này.";
    if (celebrate) {
      const colors = ["#ffcf40", "#39b9ec", "#f37aa2", "#4bc78c", "#6675ec"];
      const fragments = Array.from({ length: 28 }, function (_, index) {
        const fragment = document.createElement("i");
        const angle = index / 28 * Math.PI * 2;
        const distance = 100 + Math.random() * 80;
        fragment.style.setProperty("--confetti-x", Math.cos(angle) * distance + "px");
        fragment.style.setProperty("--confetti-y", Math.sin(angle) * distance + 50 + "px");
        fragment.style.setProperty("--confetti-turn", (index % 2 ? 1 : -1) * (180 + index * 23) + "deg");
        fragment.style.setProperty("--confetti-delay", index % 5 * 25 + "ms");
        fragment.style.setProperty("--confetti-color", colors[index % colors.length]);
        return fragment;
      });
      select("[data-confetti]").replaceChildren(...fragments);
      // Restart the one-shot animation only after a claim or an explicit replay.
      void dialog.offsetWidth;
      dialog.classList.add("is-celebrating");
      select("[data-reward-done]").focus();
    }
  }

  select("[data-badge-grid]").addEventListener("click", function (event) {
    const card = event.target.closest("[data-badge-id]");
    if (!card) return;
    activeBadge = data.badges.find(function (badge) { return badge.id === card.dataset.badgeId; });
    returnFocus = card;
    renderDialog(false);
    dialog.showModal();
    (state(activeBadge) === "ready" ? select("[data-claim-badge]") : select("[data-dialog-close]")).focus();
  });

  select("[data-claim-badge]").addEventListener("click", function () {
    if (!activeBadge || state(activeBadge) !== "ready") return;
    claimed.add(activeBadge.id);
    try { localStorage.setItem(storageKey, JSON.stringify(Array.from(claimed))); } catch (error) { storageAvailable = false; }
    render();
    renderDialog(true);
    select("[data-reward-announcement]").textContent = "Chúc mừng! Bé đã nhận huy hiệu " + activeBadge.name + ". Bộ sưu tập hiện có " + claimed.size + " huy hiệu.";
  });
  select("[data-replay-reward]").addEventListener("click", function () { if (activeBadge && state(activeBadge) === "earned") renderDialog(true); });
  select("[data-dialog-close]").addEventListener("click", function () { dialog.close(); });
  select("[data-reward-done]").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("close", function () {
    dialog.classList.remove("is-celebrating");
    select("[data-confetti]").replaceChildren();
    const replacement = activeBadge && select('[data-badge-id="' + activeBadge.id + '"]');
    (replacement || (returnFocus && returnFocus.isConnected ? returnFocus : select("#collection-title"))).focus({ preventScroll: true });
  });
  dialog.addEventListener("click", function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    loadClaims();
    render();
    if (dialog.open && activeBadge) renderDialog(false);
  });
  render();
})();
