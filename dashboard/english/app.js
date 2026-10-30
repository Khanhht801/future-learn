(function () {
  "use strict";

  const data = window.englishDashboardData;
  for (const [id, progress] of [['animals', window.animalProgress], ['fruit', window.fruitProgress], ['colors', window.colorProgress]]) {
    const topic = data.topics.find(item => item.id === id);
    if (topic && progress) topic.completed = progress.read().learned.length;
  }
  const grid = document.querySelector("[data-topic-grid]");
  const template = document.querySelector("#topic-card-template");
  const dialog = document.querySelector("[data-topic-dialog]");
  const dialogTitle = document.querySelector("[data-dialog-title]");
  const dialogContent = document.querySelector("[data-dialog-content]");
  const closeButton = document.querySelector("[data-dialog-close]");
  if (!data || !grid || !template || !dialog) return;

  function statusFor(topic) {
    if (topic.completed >= topic.total) {
      return { label: "Đã hoàn thành", className: "topic-status--completed", action: "Ôn lại chủ đề" };
    }
    if (topic.completed > 0) {
      return { label: "Đang học", className: "", action: "Tiếp tục khám phá" };
    }
    return { label: "Chưa bắt đầu", className: "topic-status--new", action: "Khám phá chủ đề" };
  }

  function makeImage(topic, className) {
    const image = document.createElement("img");
    image.src = topic.image;
    image.alt = "";
    image.className = className;
    image.width = 720;
    image.height = 480;
    return image;
  }

  function openDialog(title) {
    dialogTitle.textContent = title;
    if (!dialog.open) dialog.showModal();
    closeButton.focus();
  }

  function previewTopic(topic) {
    if (["animals", "fruit", "colors"].includes(topic.id)) { window.location.href = "./" + topic.id + "/"; return; }
    dialogContent.replaceChildren();
    const description = document.createElement("p");
    description.className = "topic-dialog__description";
    description.textContent = topic.description;
    const words = document.createElement("ul");
    words.className = "topic-dialog__words";
    words.setAttribute("aria-label", "Một số từ vựng trong chủ đề");
    topic.words.forEach(function (word) {
      const item = document.createElement("li");
      item.textContent = word;
      words.appendChild(item);
    });
    dialogContent.append(makeImage(topic, "topic-dialog__image"), description, words);
    openDialog("Khám phá: " + topic.title);
  }

  data.topics.forEach(function (topic) {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".topic-card");
    const button = fragment.querySelector("button");
    const image = fragment.querySelector("img");
    const progress = fragment.querySelector("progress");
    const status = fragment.querySelector(".topic-status");
    const state = statusFor(topic);
    card.id = "topic-" + topic.id;
    button.setAttribute("aria-label", (["animals", "fruit", "colors"].includes(topic.id) ? "Học chủ đề " : "Xem trước chủ đề ") + topic.title + ", " + topic.completed + "/" + topic.total + " từ");
    image.src = topic.image;
    fragment.querySelector("h3").textContent = topic.title;
    fragment.querySelector(".topic-card__description").textContent = topic.description;
    fragment.querySelector(".topic-card__count").textContent = topic.completed + "/" + topic.total + " từ";
    fragment.querySelector("[data-topic-action]").textContent = state.action;
    progress.value = topic.completed;
    progress.max = topic.total;
    progress.setAttribute("aria-label", "Tiến độ chủ đề " + topic.title);
    status.textContent = state.label;
    if (state.className) status.classList.add(state.className);
    button.addEventListener("click", function () { previewTopic(topic); });
    grid.appendChild(fragment);
  });

  const resumeTopic = data.topics.find(function (item) {
    return item.id === data.resumeTopicId;
  });

  if (resumeTopic) {
    const remainingWords = Math.max(0, resumeTopic.total - resumeTopic.completed);
    const continueCard = document.querySelector("[data-continue-card]");
    const continueImage = document.querySelector("[data-continue-image]");
    const continueProgress = document.querySelector("[data-continue-progress]");
    document.querySelector("[data-continue-title]").textContent = resumeTopic.title;
    document.querySelector("[data-continue-count]").textContent = resumeTopic.completed + "/" + resumeTopic.total + " từ";
    document.querySelector("[data-continue-note]").textContent = remainingWords > 0
      ? "Còn " + remainingWords + " từ nữa để hoàn thành chủ đề " + resumeTopic.title + "."
      : "Bạn đã hoàn thành chủ đề này. Cùng ôn lại để nhớ lâu hơn nhé!";
    continueImage.src = resumeTopic.image;
    continueProgress.value = resumeTopic.completed;
    continueProgress.max = resumeTopic.total;
    continueProgress.setAttribute("aria-label", "Tiến độ chủ đề " + resumeTopic.title);
    continueCard.querySelector("[data-continue-journey]").setAttribute(
      "aria-label",
      (remainingWords > 0 ? "Học tiếp chủ đề " : "Ôn lại chủ đề ") + resumeTopic.title
    );

    document.querySelectorAll("[data-resume-topic], [data-continue-journey]").forEach(function (button) {
      button.addEventListener("click", function () { previewTopic(resumeTopic); });
    });
  }

  document.querySelector("[data-all-topics]").addEventListener("click", function () {
    const list = document.createElement("div");
    list.className = "topic-dialog__list";
    data.topics.forEach(function (topic) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "topic-dialog__topic";
      const label = document.createElement("span");
      label.textContent = topic.title + " · " + topic.total + " từ";
      button.append(makeImage(topic, ""), label);
      button.addEventListener("click", function () { previewTopic(topic); });
      list.appendChild(button);
    });
    dialogContent.replaceChildren(list);
    openDialog("Tất cả chủ đề");
  });

  closeButton.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });

  document.querySelector("[data-words-learned]").textContent = data.wordsLearned;
  document.querySelector("[data-goal-completed]").textContent = data.dailyGoal.completed;
  document.querySelectorAll("[data-goal-total]").forEach(function (element) {
    element.textContent = data.dailyGoal.total;
  });
  const ring = document.querySelector("[data-goal-ring]");
  const goal = data.dailyGoal;
  ring.setAttribute("aria-valuenow", goal.completed);
  ring.setAttribute("aria-valuemax", goal.total);
  ring.setAttribute("aria-valuetext", goal.completed + " trên " + goal.total + " chủ đề");
  ring.style.setProperty("--goal-percent", goal.total > 0 ? Math.min(100, goal.completed / goal.total * 100) : 0);
  document.querySelector("[data-goal-note]").textContent = goal.completed >= goal.total
    ? "Bạn đã hoàn thành mục tiêu hôm nay!"
    : "Còn " + (goal.total - goal.completed) + " chủ đề nữa, cố lên nào!";
  document.querySelector(".preview-note").hidden = !data.isDemo;
})();
