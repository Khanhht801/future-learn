import { useEffect, useRef, useState } from 'react';
import { navigationLinks } from '../../data/landing';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { EnrollButton } from './EnrollButton';
import { AuthDialog } from './AuthDialog';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktop = useMediaQuery('(min-width: 1200px)');
  const activeSection = useActiveSection();

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 8);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    if (desktop) setMenuOpen(false);
  }, [desktop]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !headerRef.current?.contains(target)
        || !target.closest('.site-header__hamburger, #mobile-menu')) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('click', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('click', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className={`site-header${scrolled ? ' is-scrolled' : ''}`} id="site-header">
      <div className="container-xl site-header__inner">
        <a href="./" className="site-header__logo" aria-label="FutureLearn — Trang chủ">
          <img src="./logo.png" alt="FutureLearn — Nâng tầm tri thức Việt" className="site-header__logo-img" width={160} height={44} />
        </a>
        <nav className="site-header__nav" aria-label="Điều hướng chính">
          <ul className="site-header__menu" role="menubar">
            {navigationLinks.map(link => (
              <li key={link.id} role="none" className={`site-header__item${activeSection === link.id ? ' is-active' : ''}`}>
                <a role="menuitem" href={`#${link.id}`} className="site-header__link">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-header__cta"><button type="button" className="site-header__auth" onClick={() => setAuthOpen(true)}>??ng nh?p</button><EnrollButton /></div>
        <button ref={buttonRef} className="site-header__hamburger" type="button" aria-label="Mở menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(open => !open)}>
          <span className="site-header__hamburger-bar" />
          <span className="site-header__hamburger-bar" />
          <span className="site-header__hamburger-bar" />
        </button>
      </div>
      <div className="site-header__drawer" id="mobile-menu" hidden={!menuOpen}>
        <ul className="site-header__drawer-list">
          {navigationLinks.map(link => (
            <li key={link.id}><a href={`#${link.id}`} onClick={() => setMenuOpen(false)}>{link.label}</a></li>
          ))}
        </ul>
        <div className="site-header__drawer-cta"><button type="button" className="site-header__auth" onClick={() => { setMenuOpen(false); setAuthOpen(true); }}>??ng nh?p / ??ng k?</button><EnrollButton /></div>
      </div>
      {authOpen && <AuthDialog onClose={() => setAuthOpen(false)} />}
    </header>
  );
}
