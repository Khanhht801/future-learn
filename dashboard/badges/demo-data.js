/* Presentation fixtures, not account achievements. Only an explicit claim saves
   an already eligible demo badge; opening pages never completes learning. */
(function () {
  "use strict";
  const math = window.mathDashboardData;
  const english = window.englishDashboardData;
  const home = window.learningDashboardData;
  window.badgeDashboardData = {
    isDemo: true,
    stars: math.stars,
    learner: home.learner,
    dailyGoal: { completed: home.tasks.filter(function (task) { return task.completed; }).length, total: home.tasks.length },
    badges: [
      { id: "diligent", name: "Chăm chỉ", description: "Hoàn thành 10 bài học bất kỳ.", image: "diligent", value: 8, target: 10, unit: "bài", href: "../", featured: true },
      { id: "vocabulary", name: "Siêu từ vựng", description: "Học 50 từ vựng tiếng Anh.", image: "vocabulary", value: english.wordsLearned, target: 50, unit: "từ", href: "../english/?topic=animals", featured: true },
      { id: "first-steps", name: "Khởi đầu tốt", description: "Hoàn thành 5 bài học đầu tiên.", image: "first-steps", value: 5, target: 5, unit: "bài", href: "../", featured: true },
      { id: "streak", name: "Kiên trì 7 ngày", description: "Học liên tục 7 ngày.", image: "streak", value: home.streakDays, target: 7, unit: "ngày", href: "../#daily-tasks", featured: true },
      { id: "math-star", name: "Ngôi sao Toán", description: "Hoàn thành 20 bài tập Toán.", image: "math-star", value: math.stages.filter(function (stage) { return stage.state === "completed"; }).length, target: 20, unit: "bài", href: "../math/?lesson=addition", featured: true },
      { id: "explorer", name: "Nhà thám hiểm", description: "Hoàn thành cả 6 chủ đề học tập.", image: "explorer", value: 0, target: 6, unit: "chủ đề", href: "../", featured: true },
      { id: "first-words", name: "Những từ đầu tiên", description: "Học 5 từ vựng đầu tiên.", image: "vocabulary", value: english.wordsLearned, target: 5, unit: "từ", href: "../english/", claimed: true },
      { id: "first-planet", name: "Chạm tới hành tinh", description: "Hoàn thành chặng Toán đầu tiên.", image: "first-steps", value: math.stages.filter(function (stage) { return stage.state === "completed"; }).length, target: 1, unit: "chặng", href: "../math/", claimed: true },
      { id: "reading", name: "Bạn nhỏ ham học", description: "Học 100 từ vựng tiếng Anh.", image: "vocabulary", value: english.wordsLearned, target: 100, unit: "từ", href: "../english/" },
      { id: "streak-month", name: "Bền bỉ mỗi ngày", description: "Học liên tục 30 ngày.", image: "streak", value: home.streakDays, target: 30, unit: "ngày", href: "../#daily-tasks" },
      { id: "math-master", name: "Nhà toán học nhí", description: "Hoàn thành 50 bài tập Toán.", image: "math-star", value: math.stages.filter(function (stage) { return stage.state === "completed"; }).length, target: 50, unit: "bài", href: "../math/" },
      { id: "adventurer", name: "Chinh phục thế giới", description: "Hoàn thành 12 chủ đề học tập.", image: "explorer", value: 0, target: 12, unit: "chủ đề", href: "../" }
    ]
  };
})();
