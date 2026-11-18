import { trainingPrograms } from '../../data/landing';
import { useSectionMotion } from '../../hooks/useSectionMotion';
import { TrainingProgramCard } from './TrainingProgramCard';

export function TrainingProgramsSection() {
  const motion = useSectionMotion();

  return (
    <section id="training-programs" {...motion.sectionProps('training-programs')} aria-labelledby="training-programs-title">
      <div className="container-xl">
        <header {...motion.props('training-programs__header', 'rise', 0)}>
          <h2 id="training-programs-title" className="training-programs__title">Chương trình đào tạo toàn diện</h2>
          <p className="training-programs__intro">
            Ba nhóm chương trình giúp người học xây nền tảng, tự tin giao tiếp và chinh phục mục tiêu chứng chỉ.
          </p>
        </header>
        <ul className="training-programs__grid">
          {trainingPrograms.map((program, index) => (
            <li key={program.id} {...motion.props('training-programs__item', 'tilt', index + 1)}>
              <TrainingProgramCard program={program} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
