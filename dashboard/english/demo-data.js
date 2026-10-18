/* Presentation fixtures only. Replace this object with account/API data when
   the learning service exists. Opening a preview never changes these values. */
window.englishDashboardData = {
  isDemo: true,
  stars: 120,
  wordsLearned: 24,
  resumeTopicId: "animals",
  dailyGoal: { completed: 2, total: 3 },
  topics: [
    {
      id: "animals",
      title: "Động vật",
      description: "Học tên các loài động vật quen thuộc bằng tiếng Anh.",
      image: "./assets/topic-animals.webp",
      completed: 6,
      total: 10,
      words: ["Cat · Con mèo", "Dog · Con chó", "Bird · Con chim", "Fish · Con cá"]
    },
    {
      id: "fruit",
      title: "Trái cây",
      description: "Khám phá các loại trái cây đầy màu sắc.",
      image: "./assets/topic-fruit.webp",
      completed: 3,
      total: 10,
      words: ["Apple · Quả táo", "Banana · Quả chuối", "Orange · Quả cam", "Grape · Quả nho"]
    },
    {
      id: "colors",
      title: "Màu sắc",
      description: "Học những màu sắc thật đẹp quanh ta.",
      image: "./assets/topic-colors.webp",
      completed: 0,
      total: 10,
      words: ["Red · Màu đỏ", "Yellow · Màu vàng", "Blue · Màu xanh dương", "Green · Màu xanh lá"]
    }
  ]
};
