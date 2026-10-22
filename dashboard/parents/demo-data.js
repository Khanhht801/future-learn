/* Report fixtures only. Subject totals and the streak reuse the existing demo
   sources. Visiting this report never records activity or awards achievements. */
(function () {
  "use strict";
  const math = window.mathDashboardData;
  const english = window.englishDashboardData;
  const home = window.learningDashboardData;
  const mathCompleted = math.stages.filter(function (stage) { return stage.state === "completed"; }).length;
  const englishCompleted = english.topics.reduce(function (sum, topic) { return sum + topic.completed; }, 0);
  const englishTotal = english.topics.reduce(function (sum, topic) { return sum + topic.total; }, 0);
  window.parentDashboardData = {
    isDemo: true,
    stars: math.stars,
    learner: { name: "Nguyễn " + home.learner.name, initials: home.learner.initials, grade: "Lớp 3" },
    weekLabel: "19/10 – 25/10",
    weeklyGoal: { completed: 8, total: 10 },
    accuracy: 82,
    streakDays: home.streakDays,
    subjects: [
      { id: "math", name: "Hành tinh Toán", completed: mathCompleted, total: math.stages.length, unit: "chặng", href: "../math/", items: math.stages.map(function (stage) { return { title: stage.title, status: { completed: "Đã hoàn thành", current: "Đang học", locked: "Chưa mở khóa" }[stage.state] }; }) },
      { id: "english", name: "Đảo tiếng Anh", completed: englishCompleted, total: englishTotal, unit: "từ vựng", href: "../english/", items: english.topics.map(function (topic) { return { title: topic.title, status: topic.completed + "/" + topic.total + " từ" }; }) }
    ],
    // Cumulative completion, not quiz accuracy. Last values match subject totals.
    history: [
      { label: "31/08", math: 0, english: 0 },
      { label: "07/09", math: 0, english: 3 },
      { label: "14/09", math: 20, english: 7 },
      { label: "21/09", math: 20, english: 10 },
      { label: "28/09", math: 20, english: 13 },
      { label: "05/10", math: 20, english: 20 },
      { label: "12/10", math: 40, english: 23 },
      { label: "19/10", math: Math.round(mathCompleted / math.stages.length * 100), english: Math.round(englishCompleted / englishTotal * 100) }
    ],
    activities: [
      { subject: "english", title: "Luyện tập chủ đề Động vật", detail: "Đảo tiếng Anh · 8/10 câu đúng", date: "2026-10-22T16:30:00+07:00", label: "22/10 · 16:30", href: "../english/?topic=animals" },
      { subject: "math", title: "Luyện tập phép cộng", detail: "Hành tinh Toán · 9/10 câu đúng", date: "2026-10-21T19:15:00+07:00", label: "21/10 · 19:15", href: "../math/?lesson=addition" },
      { subject: "badges", title: "Khám phá huy hiệu Khởi đầu tốt", detail: "Bộ sưu tập huy hiệu", date: "2026-10-20T18:20:00+07:00", label: "20/10 · 18:20", href: "../badges/" },
      { subject: "english", title: "Khám phá chủ đề Trái cây", detail: "Đảo tiếng Anh · 3 từ vựng đã học", date: "2026-10-19T16:10:00+07:00", label: "19/10 · 16:10", href: "../english/?topic=fruit" },
      { subject: "math", title: "Hoàn thành chặng So sánh các số", detail: "Hành tinh Toán · Chặng 2", date: "2026-10-18T19:00:00+07:00", label: "18/10 · 19:00", href: "../math/#math-path" },
      { subject: "english", title: "Làm quen với các loài động vật", detail: "Đảo tiếng Anh · 6 từ vựng đã học", date: "2026-10-17T17:00:00+07:00", label: "17/10 · 17:00", href: "../english/?topic=animals" }
    ]
  };
})();
