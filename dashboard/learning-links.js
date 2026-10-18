/* Deep links and last-opened subject; never awards points or completes lessons. */
(function () {
  "use strict";
  const isEnglish = !!document.querySelector("[data-topic-grid]");
  const data = isEnglish ? window.englishDashboardData : window.mathDashboardData;
  if (!data) return;
  const subject = isEnglish ? "english" : "math";
  const entries = isEnglish ? data.topics : data.lessons;
  const defaultId = isEnglish ? data.resumeTopicId : data.currentStageId;
  const query = new URLSearchParams(location.search).get(isEnglish ? "topic" : "lesson");
  const entryId = entries.some(function (entry) { return entry.id === query; }) ? query : defaultId;
  function remember(id) {
    try {
      localStorage.setItem("futurelearn-resume-subject", subject);
      localStorage.setItem("futurelearn-resume-item", id);
    } catch (error) { /* Browser storage is optional. */ }
  }
  remember(entryId);
  if (query && query === entryId) {
    const button = isEnglish
      ? document.querySelector("#topic-" + CSS.escape(entryId) + " button")
      : document.querySelector('[data-open-lesson="' + CSS.escape(entryId) + '"]');
    if (button) button.click();
  }
  document.addEventListener("click", function (event) {
    const topic = event.target.closest(".topic-card");
    const lesson = event.target.closest("[data-open-lesson]");
    if (isEnglish && topic) remember(topic.id.replace("topic-", ""));
    if (!isEnglish && lesson) remember(lesson.dataset.openLesson);
  });
  document.querySelectorAll("[data-open-profile]").forEach(function (button) {
    button.addEventListener("click", function () { location.href = "../?panel=profile"; });
  });
})();
