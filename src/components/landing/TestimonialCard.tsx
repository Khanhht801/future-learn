import type { Testimonial } from '../../data/landing';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="student-review-card">
      <div className="student-review-card__media">
        <img {...testimonial.image} loading="lazy" decoding="async" />
      </div>
      <div className="student-review-card__body">
        <h3 className="student-review-card__name">{testimonial.name}</h3>
        <p className="student-review-card__quote">{testimonial.quote}</p>
      </div>
    </article>
  );
}
