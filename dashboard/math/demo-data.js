window.mathDashboardData = {
  isDemo: true,
  stars: 120,
  currentStageId: "addition",
  dailyGoal: { completed: 2, total: 3 },
  quickChallenge: { left: 8, right: 5, answer: 13, options: [11, 12, 13, 14] },
  stages: [
    { id: "numbers", number: 1, title: "Làm quen với số", state: "completed", planet: "mercury", planetName: "Sao Thủy" },
    { id: "compare", number: 2, title: "So sánh các số", state: "completed", planet: "venus", planetName: "Sao Kim" },
    { id: "addition", number: 3, title: "Phép cộng", state: "current", planet: "earth", planetName: "Trái Đất" },
    { id: "subtraction", number: 4, title: "Phép trừ", state: "locked", planet: "mars", planetName: "Sao Hỏa" },
    { id: "shapes", number: 5, title: "Các hình khối", state: "locked", planet: "saturn", planetName: "Sao Thổ" }
  ],
  lessons: [
    { id: "addition", title: "Cộng và trừ", description: "Khám phá phép cộng và phép trừ qua những trò chơi thú vị!", visual: "equation", detail: "Luyện cộng và trừ trong phạm vi 10 bằng hình ảnh trực quan." },
    { id: "geometry", title: "Hình học", description: "Làm quen với các hình dạng xung quanh chúng ta!", visual: "shapes", detail: "Nhận biết hình tròn, hình vuông, hình tam giác và các khối cơ bản." }
  ]
};
