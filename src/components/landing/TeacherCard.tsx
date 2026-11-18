import type { Teacher } from '../../data/landing';

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <article className="teacher-card">
      <figure className="teacher-card__portrait">
        <img {...teacher.image} className={`teacher-card__image${teacher.portrait ? ' teacher-card__image--portrait' : ''}`} loading="lazy" decoding="async" />
      </figure>
      <div className="teacher-card__body">
        <h3 className="teacher-card__name">{teacher.name}</h3>
        <hr className="teacher-card__divider" />
        <p className="teacher-card__role">{teacher.description}</p>
      </div>
    </article>
  );
}
