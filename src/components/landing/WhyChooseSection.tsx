import { useSectionMotion } from '../../hooks/useSectionMotion';

export function WhyChooseSection() {
  const motion = useSectionMotion();

  return (
    <section id="why-choose" {...motion.sectionProps('why-choose')} aria-labelledby="why-choose-title">
      <div className="why-choose__glow" aria-hidden="true" />
      <div className="container-xl why-choose__inner">
        <header {...motion.props('why-choose__header', 'rise', 0)}>
          <h2 id="why-choose-title" className="why-choose__title">
            Tại sao nên chọn FutureLearn?
          </h2>
          <p className="why-choose__intro">
            Sáu nền tảng giúp người học xây chắc kiến thức, luyện phản xạ và
            duy trì tiến bộ mỗi&nbsp;ngày.
          </p>
        </header>
        <p {...motion.props('why-choose__scroll-hint', 'from-right', 1)} aria-hidden="true">
          Vuốt để khám phá 6 lý do
          <i className="fa-solid fa-arrow-right-long" />
        </p>
        <ul className="why-choose__grid">
          <li {...motion.props('why-choose__item', 'tilt', 2)}>
            <div className="why-choose__visual why-choose__visual--program" aria-hidden="true">
              <span className="why-choose__visual-icon">
                <i className="fa-solid fa-book-open-reader" />
              </span>
              <span className="why-choose__visual-note">Mọi lứa tuổi</span>
              <span className="why-choose__visual-dot why-choose__visual-dot--one" />
              <span className="why-choose__visual-dot why-choose__visual-dot--two" />
            </div>
            <div className="why-choose__content">
              <h3 className="why-choose__item-title">
                Lộ trình toàn diện cho mọi độ tuổi
              </h3>
              <p className="why-choose__description">
                Từ chương trình bám sát sách giáo khoa đến giao tiếp, IELTS,
                TOEIC và Cambridge, người học dễ chọn đúng mục tiêu.
              </p>
            </div>
          </li>
          <li {...motion.props('why-choose__item', 'tilt', 3)}>
            <div className="why-choose__visual why-choose__visual--method" aria-hidden="true">
              <span className="why-choose__method-mark">
                <strong>3R</strong>
                <span>+</span>
                <strong>3E</strong>
              </span>
              <span className="why-choose__visual-note">Ghi nhớ · Phản xạ</span>
            </div>
            <div className="why-choose__content">
              <h3 className="why-choose__item-title">
                Phương pháp 3R–3E độc quyền
              </h3>
              <p className="why-choose__description">
                Kết hợp lặp lại, phản xạ và môi trường học tích cực để ghi nhớ
                sâu, hình thành thói quen dùng tiếng Anh.
              </p>
            </div>
          </li>
          <li {...motion.props('why-choose__item', 'tilt', 4)}>
            <div className="why-choose__visual why-choose__visual--teachers" aria-hidden="true">
              <span className="why-choose__visual-icon">
                <i className="fa-solid fa-person-chalkboard" />
              </span>
              <span className="why-choose__speech-mark">
                <i className="fa-solid fa-comment-dots" />
              </span>
              <span className="why-choose__visual-note">Học cùng chuyên gia</span>
            </div>
            <div className="why-choose__content">
              <h3 className="why-choose__item-title">
                Đội ngũ giảng dạy chuẩn quốc tế
              </h3>
              <p className="why-choose__description">
                Bài giảng được xây dựng cùng giáo viên, chuyên gia giàu kinh
                nghiệm, chú trọng phát âm và giao tiếp thực tế.
              </p>
            </div>
          </li>
          <li {...motion.props('why-choose__item', 'tilt', 5)}>
            <div className="why-choose__visual why-choose__visual--ai" aria-hidden="true">
              <span className="why-choose__visual-icon">
                <i className="fa-solid fa-microphone-lines" />
              </span>
              <span className="why-choose__sound-wave">
                <i /><i /><i /><i /><i />
              </span>
              <span className="why-choose__visual-note">F-SPEAK</span>
            </div>
            <div className="why-choose__content">
              <h3 className="why-choose__item-title">
                AI luyện nói, sửa phát âm
              </h3>
              <p className="why-choose__description">
                Công nghệ nhận diện giọng nói phản hồi trực tiếp, giúp người
                học luyện từng từ và phản xạ hội thoại.
              </p>
            </div>
          </li>
          <li {...motion.props('why-choose__item', 'tilt', 6)}>
            <div className="why-choose__visual why-choose__visual--family" aria-hidden="true">
              <span className="why-choose__visual-icon">
                <i className="fa-solid fa-people-roof" />
              </span>
              <span className="why-choose__progress-ring">
                <i className="fa-solid fa-heart" />
              </span>
              <span className="why-choose__visual-note">Cùng con tiến bộ</span>
            </div>
            <div className="why-choose__content">
              <h3 className="why-choose__item-title">
                Phụ huynh đồng hành cùng con
              </h3>
              <p className="why-choose__description">
                Báo cáo tiến độ, thành tích và điểm thưởng giúp phụ huynh theo
                sát quá trình học, khích lệ con đúng lúc.
              </p>
            </div>
          </li>
          <li {...motion.props('why-choose__item', 'tilt', 7)}>
            <div className="why-choose__visual why-choose__visual--languages" aria-hidden="true">
              <span className="why-choose__language-orbit">
                <i className="fa-solid fa-earth-asia" />
              </span>
              <span className="why-choose__language why-choose__language--en">EN</span>
              <span className="why-choose__language why-choose__language--zh">中</span>
              <span className="why-choose__language why-choose__language--ja">あ</span>
              <span className="why-choose__language why-choose__language--ko">한</span>
            </div>
            <div className="why-choose__content">
              <h3 className="why-choose__item-title">
                Hệ sinh thái học đa ngôn ngữ
              </h3>
              <p className="why-choose__description">
                Một nền tảng mở rộng hành trình học Anh – Trung – Nhật – Hàn
                theo nhu cầu của từng người.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
