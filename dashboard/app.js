(function () {
  "use strict";

  const data = window.learningDashboardData;
  const math = window.mathDashboardData;
  const english = window.englishDashboardData;
  if (!data || !math || !english) return;
  const destinations = {
    math: "./math/?lesson=" + encodeURIComponent(math.currentStageId),
    english: "./english/?topic=" + encodeURIComponent(english.resumeTopicId),
    badges: "./badges/"
  };
  const resumeKey = "futurelearn-resume-subject";
  const resumeLink = document.querySelector("[data-resume-learning]");

  function refreshResume() {
    let subject = data.resumeSubject;
    let itemId = null;
    try {
      subject = localStorage.getItem(resumeKey) || subject;
      itemId = localStorage.getItem("futurelearn-resume-item");
    } catch (error) { /* Use the default subject. */ }
    if (subject !== "math" && subject !== "english") subject = data.resumeSubject;
    const entries = subject === "english" ? english.topics : math.lessons;
    resumeLink.href = entries.some(function (entry) { return entry.id === itemId; })
      ? "./" + subject + "/?" + (subject === "english" ? "topic=" : "lesson=") + encodeURIComponent(itemId)
      : destinations[subject];
    resumeLink.setAttribute("aria-label", "Tiếp tục học " + (subject === "english" ? "Đảo tiếng Anh" : "Hành tinh Toán"));
  }
  refreshResume();
  window.addEventListener("pageshow", refreshResume);
  window.addEventListener("storage", refreshResume);

  document.querySelector("#welcome-title").textContent = "Chào " + data.learner.name + ", cùng học nào!";
  document.querySelector(".profile-button__avatar").textContent = data.learner.initials;
  document.querySelector("[data-reward-count]").textContent = math.stars;
  document.querySelector("[data-reward-chip]").setAttribute("aria-label", math.stars + " sao" + (data.isDemo ? " minh họa" : ""));
  document.querySelector("[data-streak-count]").textContent = data.streakDays + " ngày liên tiếp";
  document.querySelector("[data-demo-note]").hidden = !data.isDemo && !math.isDemo && !english.isDemo;

  function setProgress(selector, countSelector, completed, total, unit) {
    const progress = document.querySelector(selector);
    progress.max = Math.max(1, total);
    progress.value = completed;
    progress.setAttribute("aria-valuetext", completed + " trên " + total + " " + unit);
    document.querySelector(countSelector).textContent = completed + "/" + total + " " + unit;
  }
  const finishedStages = math.stages.filter(function (stage) { return stage.state === "completed"; }).length;
  setProgress("[data-math-progress]", "[data-math-count]", finishedStages, math.stages.length, "chặng");
  const wordCount = english.topics.reduce(function (sum, topic) { return sum + topic.completed; }, 0);
  const totalWords = english.topics.reduce(function (sum, topic) { return sum + topic.total; }, 0);
  setProgress("[data-english-progress]", "[data-english-count]", wordCount, totalWords, "từ");
  const completedTasks = data.tasks.filter(function (task) { return task.completed; }).length;
  setProgress("[data-home-goal]", "[data-goal-count]", completedTasks, data.tasks.length, "");

  const dialog = document.querySelector("[data-home-dialog]");
  const dialogTitle = document.querySelector("[data-home-dialog-title]");
  const dialogContent = document.querySelector("[data-home-dialog-content]");
  let returnFocus = null;
  function openDialog(title, content) {
    if (!dialog.open) returnFocus = document.activeElement;
    dialogTitle.textContent = title;
    dialogContent.replaceChildren(content);
    if (!dialog.open) dialog.showModal();
    document.querySelector("[data-home-dialog-close]").focus();
  }
  function showMessage(title, message) {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    openDialog(title, paragraph);
  }
  function showGarden() {
    location.replace("./badges/");
  }
  document.querySelectorAll("[data-open-garden]").forEach(function (button) { button.addEventListener("click", showGarden); });
  document.querySelectorAll("[data-open-parents]").forEach(function (button) {
    button.addEventListener("click", function () {
      location.assign("./parents/");
    });
  });
  function showProfile() {
    showMessage("Hồ sơ học viên", "Bạn đang xem hồ sơ minh họa của " + data.learner.name + ". Tài khoản học viên sẽ được kết nối khi chức năng đăng nhập sẵn sàng.");
  }
  document.querySelectorAll("[data-open-profile]").forEach(function (button) {
    button.addEventListener("click", showProfile);
  });

  function taskAction(task) {
    const action = document.createElement("a");
    action.href = destinations[task.subject];
    return action;
  }
  data.tasks.forEach(function (task) {
    const item = document.createElement("li");
    const action = taskAction(task);
    action.className = "goal-link";
    action.setAttribute("aria-label", task.title + (task.completed ? ", đã hoàn thành" : ", chưa hoàn thành"));
    const status = document.createElement("span");
    status.className = "goal-status" + (task.completed ? " goal-status--done" : "");
    status.setAttribute("aria-hidden", "true");
    if (task.completed) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "m5 12 4 4L19 6");
      svg.append(path);
      status.append(svg);
    }
    action.append(status, document.createTextNode(task.title));
    item.append(action);
    document.querySelector("[data-goal-list]").append(item);
  });
  document.querySelector("[data-all-tasks]").addEventListener("click", function () {
    const list = document.createElement("ul");
    list.className = "home-dialog__tasks";
    data.tasks.forEach(function (task) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = task.title;
      const status = document.createElement("span");
      status.className = "home-dialog__status";
      status.textContent = task.completed ? "Đã hoàn thành · Có thể ôn lại" : "Chưa hoàn thành";
      const action = taskAction(task);
      action.className = "button task-card__action";
      action.textContent = task.subject === "badges" ? "Xem huy hiệu" : task.completed ? "Ôn lại" : "Bắt đầu ngay";
      item.append(title, status, action);
      list.append(item);
    });
    openDialog("Tất cả nhiệm vụ hôm nay", list);
  });
  document.querySelector("[data-home-dialog-close]").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("close", function () { if (returnFocus) returnFocus.focus(); });
  dialog.addEventListener("click", function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });

  function openPanel() {
    const panel = new URLSearchParams(location.search).get("panel");
    if (panel === "garden") showGarden();
    if (panel === "parents") location.replace("./parents/");
    if (panel === "profile") showProfile();
  }
  // Preserve legacy garden/parent links and shareable profile previews.
  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin || target.pathname !== location.pathname || !target.searchParams.has("panel")) return;
    event.preventDefault();
    history.pushState(null, "", target.href);
    openPanel();
  });
  window.addEventListener("popstate", function () {
    if (dialog.open) dialog.close();
    openPanel();
  });
  openPanel();
})();
