/* Presentation fixtures only. Opening a page never awards points or completes tasks.
   Subject progress comes from the existing math and English data sources. */
window.learningDashboardData = {
  isDemo: true,
  learner: { name: "An", initials: "AN" },
  streakDays: 3,
  resumeSubject: "math",
  tasks: [
    { id: "addition", title: "Luyện 5 phép cộng", subject: "math", completed: true },
    { id: "vocabulary", title: "Học 5 từ mới", subject: "english", completed: true },
    { id: "garden", title: "Chăm sóc khu vườn", subject: "garden", completed: false }
  ]
};
