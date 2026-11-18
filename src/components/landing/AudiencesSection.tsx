import { audiences } from '../../data/landing';
import { useSectionMotion } from '../../hooks/useSectionMotion';

export function AudiencesSection() {
  const motion = useSectionMotion();

  return (
    <section id="audiences" {...motion.sectionProps('audiences')} aria-labelledby="audiences-title">
      <div className="container-xl">
        <h2 id="audiences-title" {...motion.props('audiences__title', 'rise', 0)}>FutureLearn dành cho ai?</h2>
        <div className="audiences__layout">
          <figure {...motion.props('audiences__visual', 'wipe', 1)}>
            <img className="audiences__image" src="./public-home/images/audiences/futurelang-for-everyone.webp" alt="Các nhóm học sinh và sinh viên trong môi trường học tập" width={960} height={578} loading="lazy" decoding="async" />
          </figure>
          <div className="audience-accordion" aria-label="Các nhóm người học của FutureLearn">
            {audiences.map((audience, index) => (
              <details key={audience.id} {...motion.props('audience-accordion__item', 'from-right', index + 2)} name="futurelang-audience" open={index === 0 ? true : undefined}>
                <summary className="audience-accordion__summary">
                  <span className="audience-accordion__icon" aria-hidden="true"><i className={`fa-solid ${audience.icon}`} /></span>
                  <span className="audience-accordion__label">{audience.title}</span>
                  <span className="audience-accordion__chevron" aria-hidden="true" />
                </summary>
                <div className="audience-accordion__content">
                  <ul className="audience-accordion__list">
                    {audience.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
