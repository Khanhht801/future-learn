import { SiteHeader } from './components/landing/SiteHeader';
import { HeroSection } from './components/landing/HeroSection';
import { AboutSection } from './components/landing/AboutSection';
import { StatisticsSection } from './components/landing/StatisticsSection';
import { WhyChooseSection } from './components/landing/WhyChooseSection';
import { AudiencesSection } from './components/landing/AudiencesSection';
import { TrainingProgramsSection } from './components/landing/TrainingProgramsSection';
import { TeachersSection } from './components/landing/TeachersSection';
import { ConsultationSection } from './components/landing/ConsultationSection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { SiteFooter } from './components/landing/SiteFooter';

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <StatisticsSection />
        <WhyChooseSection />
        <AudiencesSection />
        <TrainingProgramsSection />
        <TeachersSection />
        <ConsultationSection />
        <TestimonialsSection />
      </main>
      <SiteFooter />
    </>
  );
}
