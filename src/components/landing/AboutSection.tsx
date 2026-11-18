import { useSectionMotion } from '../../hooks/useSectionMotion';

export function AboutSection() {
  const motion = useSectionMotion();

  return (
    <section id="about" {...motion.sectionProps('about-story')} aria-labelledby="about-story-title">
      <div className="container-xl">
        <div className="about-story__layout">
          <div {...motion.props('about-story__content', 'from-left', 0)}>
            <header className="about-story__header">
              <h2 id="about-story-title" className="about-story__title">
                Hành trình bắt đầu
              </h2>
              <p className="about-story__lead">
                <strong>FutureLearn</strong> là trung tâm đào tạo tiếng Anh,
                được thành lập ngày <strong>12/09/2015</strong> tại{' '}
                <strong>Lạng Sơn, Việt Nam</strong>.
              </p>
            </header>
            <div className="about-story__copy">
              <p>
                Trung tâm hướng đến việc xây dựng môi trường học tiếng Anh
                hiện đại, thân thiện và thực tế, giúp học viên phát triển đồng
                đều các kỹ năng{' '}
                <strong>nghe, nói, đọc, viết</strong> và tự tin sử dụng tiếng
                Anh trong học tập, công việc và giao tiếp hàng ngày.
              </p>
              <p>
                Với phương pháp học kết hợp kiến thức nền tảng và thực hành,
                FutureLearn không ngừng đổi mới chương trình giảng dạy nhằm
                mang đến trải nghiệm học tập hiệu quả và phù hợp với từng học
                viên.
              </p>
            </div>
          </div>
          <aside {...motion.props('about-story__milestone', 'pop', 1)} aria-label="Mốc thành lập FutureLearn">
            <span className="about-story__milestone-year">2015</span>
            <p className="about-story__milestone-date">12 tháng 09</p>
            <p className="about-story__milestone-place">
              Khởi đầu hành trình<br />tại Lạng Sơn
            </p>
          </aside>
        </div>
        <div className="about-story__gallery" aria-label="Không gian học tập tại FutureLearn">
          <figure {...motion.props('about-story__photo about-story__photo--main', 'wipe', 2)}>
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85" alt="Giáo viên hướng dẫn học viên trong một lớp học hiện đại" width={1400} height={934} loading="lazy" decoding="async" />
            <figcaption>Học qua tương tác và thực hành trong lớp</figcaption>
          </figure>
          <figure {...motion.props('about-story__photo', 'wipe', 3)}>
            <img src="https://images.unsplash.com/photo-1762512346988-045f4d5ad2b3?auto=format&fit=crop&w=900&q=85" alt="Nhóm học viên cùng trao đổi và học tập tại bàn dài" width={900} height={600} loading="lazy" decoding="async" />
            <figcaption>Cùng nhau tiến bộ mỗi ngày</figcaption>
          </figure>
          <figure {...motion.props('about-story__photo', 'wipe', 4)}>
            <img src="https://images.unsplash.com/photo-1758270705696-ec9caffc73dd?auto=format&fit=crop&w=900&q=85" alt="Giáo viên trò chuyện và giải đáp câu hỏi cho nhóm học viên" width={900} height={600} loading="lazy" decoding="async" />
            <figcaption>Khuyến khích sự tự tin trong giao tiếp</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
