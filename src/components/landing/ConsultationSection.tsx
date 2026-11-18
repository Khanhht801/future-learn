import { useSectionMotion } from '../../hooks/useSectionMotion';
import { ConsultationForm } from './ConsultationForm';

export function ConsultationSection() {
  const motion = useSectionMotion();

  return (
    <section id="consultation" {...motion.sectionProps('consultation')} aria-labelledby="consultation-title">
      <div className="container-xl consultation__inner">
        <div className="consultation__content">
          <header {...motion.props('consultation__header', 'from-left', 0)}>
            <h2 id="consultation-title" className="consultation__title">
              Đăng ký nhận tư vấn khóa học
            </h2>
            <p className="consultation__description">
              Bố mẹ hãy để lại thông tin chính xác để được FutureLearn hỗ trợ
              sớm nhất có thể nhé!
            </p>
          </header>
          <ConsultationForm motionProps={motion.props} />
        </div>
        <figure {...motion.props('consultation__visual', 'from-right', 6)}>
          <img src="https://www.futurelang.edu.vn/public-home/images/unsplash_1rBg5YSi00c.png" alt="Ưu đãi học phí và lớp học cùng giáo viên bản ngữ tại FutureLearn" width={469} height={488} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        </figure>
      </div>
    </section>
  );
}
