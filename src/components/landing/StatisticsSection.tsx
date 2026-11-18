import { useEffect, useState } from 'react';
import { statistics } from '../../data/landing';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useSectionMotion } from '../../hooks/useSectionMotion';

const numberFormatter = new Intl.NumberFormat('vi-VN');

export function StatisticsSection() {
  const motion = useSectionMotion();
  const sectionRef = motion.ref;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion || !('IntersectionObserver' in window)) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      setProgress(0);
      const animate = (time: number) => {
        const elapsed = Math.min((time - start) / 1400, 1);
        setProgress(1 - Math.pow(1 - elapsed, 3));
        if (elapsed < 1) frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion, sectionRef]);

  return (
    <section id="stats" {...motion.sectionProps('stats-strip')} aria-labelledby="stats-title">
      <div className="container-xl stats-strip__inner">
        <h2 id="stats-title" {...motion.props('stats-strip__title', 'rise', 0)}>
          Chúng tôi có đầy đủ chương trình học cho mọi lứa tuổi
        </h2>
        <ul className="stats-strip__list" aria-label="Những con số nổi bật của FutureLearn">
          {statistics.map((statistic, index) => (
            <li key={statistic.icon} {...motion.props('stats-strip__item', 'pop', index + 1)}>
              <span className={`stats-strip__icon${statistic.highlight ? ' stats-strip__icon--highlight' : ''}`} aria-hidden="true">
                <i className={`fa-solid ${statistic.icon}`} />
              </span>
              <p className="stats-strip__value" aria-label={statistic.ariaLabel}>
                <span data-stat-counter={statistic.value} aria-hidden="true">{numberFormatter.format(Math.round(statistic.value * progress))}</span><span aria-hidden="true">{statistic.suffix}</span>
              </p>
              <p className="stats-strip__label">{statistic.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
