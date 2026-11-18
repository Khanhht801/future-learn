import { useEffect, useState } from 'react';

const navigationSection: Record<string, string> = {
  stats: 'about',
  'why-choose': 'about',
  audiences: 'about',
};

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(navigationSection[entry.target.id] ?? entry.target.id);
        }
      }
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    document.querySelectorAll('main section[id], footer[id]').forEach(section => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return activeSection;
}
