(function () {
  "use strict";
  const data = window.mathDashboardData;
  if (!data) return;

  const path = document.querySelector("[data-math-path]");
  const lessonGrid = document.querySelector("[data-lesson-grid]");
  const dialog = document.querySelector("[data-math-dialog]");
  const dialogTitle = document.querySelector("[data-dialog-title]");
  const dialogContent = document.querySelector("[data-dialog-content]");
  const dialogClose = document.querySelector("[data-dialog-close]");

  function lessonFor(id) {
    return data.lessons.find(function (lesson) { return lesson.id === id; });
  }

  function openLesson(lesson) {
    if (!lesson) return;
    const summary = document.createElement("p");
    summary.className = "math-dialog__summary";
    summary.textContent = lesson.detail;
    dialogTitle.textContent = lesson.title;
    dialogContent.replaceChildren(summary);
    if (!dialog.open) dialog.showModal();
    dialogClose.focus();
  }

  data.stages.forEach(function (stage) {
    const element = document.createElement(stage.state === "locked" ? "div" : "button");
    if (element.tagName === "BUTTON") element.type = "button";
    element.className = "path-stage is-" + stage.state;
    const planet = document.createElement("span");
    planet.className = "path-stage__planet";
    planet.textContent = stage.number;
    if (stage.state === "completed" || stage.state === "locked") {
      const badge = document.createElement("span");
      badge.className = "path-stage__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = stage.state === "completed" ? "✓" : "•";
      planet.appendChild(badge);
    }
    const label = document.createElement("span");
    label.className = "path-stage__label";
    label.textContent = stage.title;
    element.append(planet, label);
    if (element.tagName === "BUTTON") {
      element.setAttribute("aria-label", stage.title + (stage.state === "current" ? ", đang học" : ", đã hoàn thành"));
      element.addEventListener("click", function () { openLesson(lessonFor(stage.id) || data.lessons[0]); });
    } else {
      element.setAttribute("aria-label", stage.title + ", chưa mở khóa");
    }
    path.appendChild(element);
  });

  data.lessons.forEach(function (lesson) {
    const article = document.createElement("article");
    article.className = "lesson-card";
    const title = document.createElement("h2");
    title.textContent = lesson.title;
    const description = document.createElement("p");
    description.textContent = lesson.description;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lesson-card__open";
    button.dataset.openLesson = lesson.id;
    button.setAttribute("aria-label", "Mở bài " + lesson.title);
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>';
    const visual = document.createElement("div");
    visual.className = "lesson-card__visual";
    visual.setAttribute("aria-hidden", "true");
    if (lesson.visual === "equation") {
      ["2", "+", "3"].forEach(function (symbol) {
        const block = document.createElement("span");
        block.className = "equation-block";
        block.textContent = symbol;
        visual.appendChild(block);
      });
    } else {
      ["triangle", "square", "circle"].forEach(function (shape) {
        const item = document.createElement("span");
        item.className = "shape shape--" + shape;
        visual.appendChild(item);
      });
    }
    article.append(title, description, button, visual);
    lessonGrid.appendChild(article);
  });

  const continueCard = document.querySelector("[data-math-continue]");
  const currentStage = data.stages.find(function (stage) {
    return stage.id === data.currentStageId && stage.state === "current";
  });
  if (currentStage && lessonFor(currentStage.id)) {
    const completed = data.stages.filter(function (stage) { return stage.state === "completed"; }).length;
    document.querySelector("[data-continue-stage]").textContent = currentStage.title;
    document.querySelector("[data-continue-note]").textContent = "Đã hoàn thành " + completed + "/" + data.stages.length + " chặng.";
    const progress = document.querySelector("[data-continue-progress]");
    progress.max = data.stages.length;
    progress.value = completed;
    document.querySelector("[data-continue-lesson]").dataset.openLesson = currentStage.id;
    continueCard.hidden = false;
  }

  document.querySelectorAll("[data-open-lesson]").forEach(function (button) {
    button.addEventListener("click", function () { openLesson(lessonFor(button.dataset.openLesson)); });
  });

  const challenge = data.quickChallenge;
  document.querySelector("[data-challenge-left]").textContent = challenge.left;
  document.querySelector("[data-challenge-right]").textContent = challenge.right;
  const options = document.querySelector("[data-challenge-options]");
  const feedback = document.querySelector("[data-challenge-feedback]");
  challenge.options.forEach(function (answer) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = answer;
    button.addEventListener("click", function () {
      options.querySelectorAll(".answer-button").forEach(function (item) { item.classList.remove("is-wrong"); });
      if (answer === challenge.answer) {
        button.classList.add("is-correct");
        feedback.textContent = "Chính xác! " + challenge.left + " + " + challenge.right + " = " + challenge.answer + ".";
      } else {
        button.classList.add("is-wrong");
        feedback.textContent = "Chưa đúng, thử lại một lần nữa nhé!";
      }
    });
    options.appendChild(button);
  });

  const goal = data.dailyGoal;
  const goalProgress = document.querySelector("[data-goal-progress]");
  goalProgress.setAttribute("role", "progressbar");
  goalProgress.setAttribute("aria-valuemin", "0");
  goalProgress.setAttribute("aria-valuemax", goal.total);
  goalProgress.setAttribute("aria-valuenow", goal.completed);
  for (let index = 0; index < goal.total; index += 1) {
    const segment = document.createElement("span");
    segment.className = "math-goal__segment" + (index < goal.completed ? " is-complete" : "");
    goalProgress.appendChild(segment);
  }

  document.querySelector("[data-goal-completed]").textContent = goal.completed;
  document.querySelectorAll("[data-goal-total]").forEach(function (element) { element.textContent = goal.total; });
  document.querySelector(".preview-note").hidden = !data.isDemo;

  dialogClose.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (event) {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
})();
