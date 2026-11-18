import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { testimonials } from '../../data/landing';
import { useSectionMotion } from '../../hooks/useSectionMotion';
import { TestimonialCard } from './TestimonialCard';

export function TestimonialsSection() {
  const motion = useSectionMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [marquee, setMarquee] = useState<{ distance: number; duration: number } | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    const track = trackRef.current;
    if (!group || !track) return;
    const measure = () => {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const distance = group.getBoundingClientRect().width + gap;
      const speed = window.matchMedia('(max-width: 767.98px)').matches ? 40 : 52;
      setMarquee({ distance, duration: distance / speed });
    };
    const observer = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    observer?.observe(group);
    window.addEventListener('resize', measure, { passive: true });
    const resume = () => setPaused(false);
    window.addEventListener('blur', resume);
    const frame = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('blur', resume);
    };
  }, []);

  const trackStyle = marquee ? {
    '--reviews-translate': `${-marquee.distance}px`,
    '--reviews-duration': `${marquee.duration}s`,
  } as CSSProperties : undefined;

  return (
    <section id="testimonials" {...motion.sectionProps('student-reviews')} aria-labelledby="student-reviews-title">
      <div {...motion.props('container-xl student-reviews__header', 'rise', 0)}>
        <h2 id="student-reviews-title" className="student-reviews__title">Cảm nhận của học viên</h2>
        <p className="student-reviews__description">Những chia sẻ chân thực sau quá trình học và trải nghiệm FutureLearn.</p>
      </div>
      <div {...motion.props(`student-reviews__viewport${marquee ? ' is-ready' : ''}${paused ? ' is-paused' : ''}`, 'focus', 1)} data-reviews-marquee aria-label="Đánh giá của học viên FutureLearn">
        <div ref={trackRef} className="student-reviews__track" data-reviews-track style={trackStyle}>
          {[false, true].map(duplicate => (
            <ul key={String(duplicate)} ref={duplicate ? undefined : groupRef} className="student-reviews__group" data-reviews-group={duplicate ? undefined : true} role="list" aria-hidden={duplicate ? true : undefined}>
              {testimonials.map(testimonial => (
                <li key={testimonial.id} className="student-reviews__item" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                  <TestimonialCard testimonial={testimonial} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
