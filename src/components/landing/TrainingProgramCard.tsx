import type { TrainingProgram } from '../../data/landing';

export function TrainingProgramCard({ program }: { program: TrainingProgram }) {
  return (
    <article className="training-program-card">
      <figure className="training-program-card__media">
        <img {...program.image} className="training-program-card__image" loading="lazy" decoding="async" />
      </figure>
      <div className="training-program-card__body">
        <h3 className="training-program-card__title">{program.title}</h3>
        <p className="training-program-card__description">{program.description}</p>
      </div>
    </article>
  );
}
