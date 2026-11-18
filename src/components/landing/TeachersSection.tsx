import { teachers } from '../../data/landing';
import { useSectionMotion } from '../../hooks/useSectionMotion';
import { useTeacherCarousel } from '../../hooks/useTeacherCarousel';
import { TeacherCard } from './TeacherCard';

export function TeachersSection() {
  const motion = useSectionMotion();
  const carousel = useTeacherCarousel();

  return (
    <section id="teachers" {...motion.sectionProps('teachers')} aria-labelledby="teachers-title">
      <div className="container-xl">
        <header {...motion.props('teachers__header', 'rise', 0)}>
          <h2 id="teachers-title" className="teachers__title">Đội ngũ cố vấn &amp; giáo viên</h2>
          <p className="teachers__intro">Gặp gỡ các chuyên gia trong nước và quốc tế đang đồng hành cùng FutureLearn.</p>
        </header>
        <div ref={carousel.sliderRef} {...motion.props('teachers__carousel', 'wipe', 1)} data-teachers-slider>
          <button className="teachers__arrow teachers__arrow--prev" type="button" data-teachers-prev aria-label="Xem giáo viên trước" hidden={!carousel.hasOverflow} onClick={carousel.previous}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <div ref={carousel.viewportRef} className={`teachers__rail${carousel.dragging ? ' is-dragging' : ''}`} data-teachers-carousel tabIndex={0} {...carousel.viewportEvents}>
            <ul ref={carousel.trackRef} id="teachers-track" className="teachers__track" data-teachers-track aria-label="Danh sách cố vấn và giáo viên FutureLearn">
              {teachers.map(teacher => <li key={teacher.id} className="teachers__item"><TeacherCard teacher={teacher} /></li>)}
            </ul>
          </div>
          <button className="teachers__arrow teachers__arrow--next" type="button" data-teachers-next aria-label="Xem giáo viên tiếp theo" hidden={!carousel.hasOverflow} onClick={carousel.next}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
