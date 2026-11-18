import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMediaQuery } from './useMediaQuery';

type Motion = 'rise' | 'from-left' | 'from-right' | 'pop' | 'tilt' | 'wipe' | 'focus';

export function useSectionMotion() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = ref.current;
    if (reducedMotion || !section || !('IntersectionObserver' in window)) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return {
    ref,
    sectionProps(className: string) {
      return { ref, className: `${className}${enabled ? ' motion-enabled' : ''}${visible ? ' is-motion-complete' : ''}` };
    },
    props(className: string, motion: Motion, order: number) {
      return {
        className: `${className}${enabled && visible ? ' is-motion-visible' : ''}`,
        'data-motion': enabled ? motion : undefined,
        style: enabled ? { '--motion-order': order } as CSSProperties : undefined,
      };
    },
  };
}
