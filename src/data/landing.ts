// Nội dung dùng chung cho các component landing page.

export const navigationLinks = [
  {
    "id": "home",
    "label": "Trang chủ"
  },
  {
    "id": "about",
    "label": "Giới thiệu"
  },
  {
    "id": "training-programs",
    "label": "Chương trình"
  },
  {
    "id": "teachers",
    "label": "Giáo viên"
  },
  {
    "id": "consultation",
    "label": "Đăng ký"
  },
  {
    "id": "testimonials",
    "label": "Đánh giá"
  },
  {
    "id": "contact",
    "label": "Liên hệ"
  }
];

export const statistics = [
  {
    "value": 500000,
    "suffix": "+",
    "ariaLabel": "500.000 cộng",
    "label": "Học viên",
    "icon": "fa-user-graduate",
    "highlight": false
  },
  {
    "value": 10000,
    "suffix": "+",
    "ariaLabel": "10.000 cộng",
    "label": "Giáo viên tin dùng",
    "icon": "fa-person-chalkboard",
    "highlight": false
  },
  {
    "value": 85,
    "suffix": "%",
    "ariaLabel": "85 phần trăm",
    "label": "Học viên cải thiện điểm số trên lớp",
    "icon": "fa-chart-line",
    "highlight": false
  },
  {
    "value": 96,
    "suffix": "%",
    "ariaLabel": "96 phần trăm",
    "label": "Học viên hài lòng về FutureLearn",
    "icon": "fa-face-smile-beam",
    "highlight": true
  }
];

export const audiences = [
  {
    "id": "child-reaching",
    "icon": "fa-child-reaching",
    "title": "Học sinh Mầm non và Tiểu học",
    "items": [
      "Tiếng Anh giao tiếp cho học sinh từ 3–12 tuổi.",
      "Tiếng Anh theo sách giáo khoa lớp 1–5 của Bộ GD&ĐT.",
      "Lộ trình Cambridge, TOEFL và IOE."
    ]
  },
  {
    "id": "school",
    "icon": "fa-school",
    "title": "Học sinh Trung học Cơ sở",
    "items": [
      "Giao tiếp 66 ngày, phát âm và ngữ pháp nền tảng.",
      "Tiếng Anh theo sách giáo khoa lớp 6–9.",
      "Lộ trình IELTS 5.5 và luyện thi vào lớp 10."
    ]
  },
  {
    "id": "book-open-reader",
    "icon": "fa-book-open-reader",
    "title": "Học sinh Trung học Phổ thông",
    "items": [
      "Tiếng Anh theo sách giáo khoa lớp 10–12.",
      "Lộ trình chinh phục IELTS 7.5.",
      "Ôn luyện cho kỳ thi tốt nghiệp THPT."
    ]
  },
  {
    "id": "graduation-cap",
    "icon": "fa-graduation-cap",
    "title": "Sinh viên",
    "items": [
      "Giao tiếp 66 ngày, phát âm và ngữ pháp.",
      "Rèn luyện kỹ năng viết và nói.",
      "Lộ trình IELTS 5.5–7.5 và TOEIC."
    ]
  },
  {
    "id": "briefcase",
    "icon": "fa-briefcase",
    "title": "Người đi làm",
    "items": [
      "Giao tiếp 66 ngày, phát âm và ngữ pháp ứng dụng.",
      "Rèn luyện kỹ năng viết và nói trong công việc.",
      "Lộ trình IELTS 5.5–7.5 và TOEIC."
    ]
  },
  {
    "id": "person-chalkboard",
    "icon": "fa-person-chalkboard",
    "title": "Giáo viên",
    "items": [
      "Phát âm và giao tiếp cho nhiều lứa tuổi.",
      "Chương trình sách giáo khoa lớp 1–12.",
      "Cambridge, TOEFL, IOE, IELTS và TOEIC."
    ]
  }
];

export const trainingPrograms = [
  {
    "id": "ministry-curriculum",
    "title": "Chương trình của Bộ Giáo dục",
    "description": "Nội dung bám sát chương trình tiếng Anh phổ thông, củng cố kiến thức từ lớp 1 đến lớp 12.",
    "image": {
      "src": "./public-home/images/programs/ministry-curriculum.webp",
      "alt": "Robot FutureLearn giới thiệu bộ sách tiếng Anh phổ thông",
      "width": 720,
      "height": 500
    }
  },
  {
    "id": "pronunciation-speaking",
    "title": "Phát âm và Giao tiếp",
    "description": "Rèn phát âm, phản xạ nghe – nói và giao tiếp tự nhiên qua những tình huống gần gũi.",
    "image": {
      "src": "./public-home/images/programs/pronunciation-speaking.webp",
      "alt": "Học viên luyện phát âm và giao tiếp tiếng Anh cùng robot FutureLearn",
      "width": 960,
      "height": 663
    }
  },
  {
    "id": "language-certificates",
    "title": "Chứng chỉ ngoại ngữ",
    "description": "Lộ trình Cambridge, IELTS, TOEIC và IOE được thiết kế theo mục tiêu của từng người học.",
    "image": {
      "src": "./public-home/images/programs/language-certificates.webp",
      "alt": "Robot FutureLearn giới thiệu các chương trình luyện thi chứng chỉ ngoại ngữ",
      "width": 960,
      "height": 663
    }
  }
];

export const teachers = [
  {
    "id": "alexandra-gilliland",
    "name": "Cô Alexandra Gilliland",
    "description": "Chuyên gia đào tạo tiếng Anh đến từ London, Anh Quốc.",
    "image": {
      "src": "./public-home/images/teachers/alexandra-gilliland.webp",
      "alt": "Cô Alexandra Gilliland",
      "width": 500,
      "height": 500
    },
    "portrait": false
  },
  {
    "id": "lydia-jayne-sawyer",
    "name": "Lydia Jayne Sawyer",
    "description": "Chuyên gia đào tạo tiếng Anh đến từ Anh Quốc.",
    "image": {
      "src": "./public-home/images/teachers/lydia-jayne-sawyer.webp",
      "alt": "Cô Lydia Jayne Sawyer",
      "width": 500,
      "height": 500
    },
    "portrait": false
  },
  {
    "id": "emily-francis",
    "name": "Cô Emily Francis",
    "description": "Chuyên gia đào tạo tiếng Anh đến từ Cambridge, Anh Quốc.",
    "image": {
      "src": "./public-home/images/teachers/emily-francis.webp",
      "alt": "Cô Emily Francis",
      "width": 500,
      "height": 500
    },
    "portrait": false
  },
  {
    "id": "oliver-william-rance",
    "name": "Oliver William Rance",
    "description": "Chuyên gia đào tạo tiếng Anh đến từ Anh Quốc.",
    "image": {
      "src": "./public-home/images/teachers/oliver-william-rance.webp",
      "alt": "Thầy Oliver William Rance",
      "width": 500,
      "height": 500
    },
    "portrait": false
  },
  {
    "id": "khiem-nguyen",
    "name": "Tiến sĩ Khiêm Nguyễn",
    "description": "NLP Trainer, Master Coach ABNLP, ICF Coach; Giám đốc đào tạo NLP Power.",
    "image": {
      "src": "./public-home/images/teachers/khiem-nguyen.webp",
      "alt": "Tiến sĩ Khiêm Nguyễn",
      "width": 500,
      "height": 500
    },
    "portrait": false
  },
  {
    "id": "vien-ngoc-sang",
    "name": "Thầy Viên Ngọc Sang",
    "description": "Cố vấn đào tạo cao cấp FutureLearn; Trưởng ban Đào tạo, Hiệp hội DNNVV khu vực phía Nam.",
    "image": {
      "src": "./public-home/images/teachers/vien-ngoc-sang.webp",
      "alt": "Thầy Viên Ngọc Sang",
      "width": 741,
      "height": 900
    },
    "portrait": true
  },
  {
    "id": "do-duc-tho",
    "name": "Ông Đỗ Đức Thọ",
    "description": "Phó Viện trưởng Viện Khoa học và Giáo dục Đông Nam Á; Chủ tịch, Tổng giám đốc VEDICO.",
    "image": {
      "src": "./public-home/images/teachers/do-duc-tho.webp",
      "alt": "Ông Đỗ Đức Thọ",
      "width": 826,
      "height": 826
    },
    "portrait": false
  },
  {
    "id": "nguyen-van-khuong",
    "name": "Ông Nguyễn Văn Khương",
    "description": "Viện trưởng Viện Khoa học Giáo dục và Môi trường.",
    "image": {
      "src": "./public-home/images/teachers/nguyen-van-khuong.webp",
      "alt": "Ông Nguyễn Văn Khương",
      "width": 500,
      "height": 500
    },
    "portrait": false
  }
];

export const testimonials = [
  {
    "id": "nOezH7eg7S8",
    "name": "Bé Vân Anh, 13 tuổi",
    "quote": "“Các bài học có nhiều chủ đề gần gũi nên em không thấy áp lực. Em thích nhất phần luyện nói vì có thể nghe lại và sửa cách phát âm của mình ngay.”",
    "image": {
      "src": "https://i.ytimg.com/vi/nOezH7eg7S8/hqdefault.jpg",
      "alt": "Bé Vân Anh chia sẻ trải nghiệm học tại FutureLearn",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "c03s0CUa1n4",
    "name": "Bé Hương, 6 tuổi",
    "quote": "“Con thích vừa học vừa chơi cùng các nhân vật trong bài. Mỗi ngày con đều chủ động mở bài học và đọc theo những từ mới con vừa được nghe.”",
    "image": {
      "src": "https://i.ytimg.com/vi/c03s0CUa1n4/hqdefault.jpg",
      "alt": "Bé Hương trải nghiệm ứng dụng tiếng Anh FutureLearn",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "15nRskpqNEU",
    "name": "Bé Sơn, 5 tuổi",
    "quote": "“Con nhớ từ mới nhanh hơn nhờ hình ảnh và trò chơi. Con cũng mạnh dạn trả lời bằng tiếng Anh khi cô giáo hỏi.”",
    "image": {
      "src": "https://i.ytimg.com/vi/15nRskpqNEU/hqdefault.jpg",
      "alt": "Bé Sơn học tiếng Anh cùng FutureLearn",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "lZ9b2-cl408",
    "name": "Hai bé Bin – Bông",
    "quote": "“Hai anh em thường cùng nhau hoàn thành bài học và thi xem ai nhớ được nhiều từ hơn. Nhờ vậy, giờ học tiếng Anh lúc nào cũng vui.”",
    "image": {
      "src": "https://i.ytimg.com/vi/lZ9b2-cl408/hqdefault.jpg",
      "alt": "Hai bé Bin và Bông học tiếng Anh qua trò chơi",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "--gvzJ2jAR8",
    "name": "Minh Tuyết, 12 tuổi",
    "quote": "“Lộ trình được chia thành từng bài ngắn nên em dễ sắp xếp thời gian học. Sau mỗi bài, em biết rõ phần nào mình cần ôn lại.”",
    "image": {
      "src": "https://i.ytimg.com/vi/--gvzJ2jAR8/hqdefault.jpg",
      "alt": "Minh Tuyết đánh giá ứng dụng FutureLearn",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "8623Qbf6dps",
    "name": "Nguyễn Lê Anh Thơ, 13 tuổi",
    "quote": "“Em thấy phần phát âm rất hữu ích vì được luyện nhiều lần cho đến khi nói đúng. Em tự tin hơn khi trình bày và giao tiếp bằng tiếng Anh.”",
    "image": {
      "src": "https://i.ytimg.com/vi/8623Qbf6dps/hqdefault.jpg",
      "alt": "Nguyễn Lê Anh Thơ chia sẻ về FutureLearn",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "_ucw_gJRXqg",
    "name": "Trí Tài, 13 tuổi",
    "quote": "“Bài học online dễ theo dõi và em có thể chủ động học lại phần chưa chắc. Em đã hình thành được thói quen học tiếng Anh đều đặn mỗi ngày.”",
    "image": {
      "src": "https://i.ytimg.com/vi/_ucw_gJRXqg/hqdefault.jpg",
      "alt": "Trí Tài đánh giá chương trình học tiếng Anh online",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "AP00VrUHJNU",
    "name": "Học viên Minh Anh",
    "quote": "“Mình thích cách bài học kết hợp nghe, nói và từ vựng trong cùng một chủ đề. Việc ôn tập thường xuyên giúp mình ghi nhớ tốt hơn.”",
    "image": {
      "src": "https://i.ytimg.com/vi/AP00VrUHJNU/hqdefault.jpg",
      "alt": "Học viên Minh Anh chia sẻ bí quyết học tiếng Anh",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "XwNnmFAqd0I",
    "name": "Học viên Phương Nam",
    "quote": "“Trước đây mình khá ngại nói vì sợ sai. Các bài luyện phản xạ giúp mình bắt đầu từ câu đơn giản và dần nói tự nhiên hơn.”",
    "image": {
      "src": "https://i.ytimg.com/vi/XwNnmFAqd0I/hqdefault.jpg",
      "alt": "Học viên Phương Nam chia sẻ về FutureLearn",
      "width": 480,
      "height": 360
    }
  },
  {
    "id": "5o_Ucqj9OB0",
    "name": "Học viên Phạm Huệ",
    "quote": "“Lộ trình rõ ràng giúp mình biết mỗi ngày cần học gì và không bị nản. Mình đã tự tin hơn khi sử dụng tiếng Anh trong những tình huống quen thuộc.”",
    "image": {
      "src": "https://i.ytimg.com/vi/5o_Ucqj9OB0/hqdefault.jpg",
      "alt": "Học viên Phạm Huệ đánh giá khóa học giao tiếp",
      "width": 480,
      "height": 360
    }
  }
];

export type Teacher = (typeof teachers)[number];
export type TrainingProgram = (typeof trainingPrograms)[number];
export type Testimonial = (typeof testimonials)[number];
