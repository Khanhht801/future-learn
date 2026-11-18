import { useEffect, useState } from 'react';
import { usePageVisibility } from '../../hooks/usePageVisibility';

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const pageVisible = usePageVisibility();

  useEffect(() => {
    if (!pageVisible) return;
    const timer = window.setInterval(() => setActiveSlide(index => (index + 1) % 2), 3000);
    return () => window.clearInterval(timer);
  }, [pageVisible]);

  return (
    <section id="home" className="hero" data-hero-carousel aria-label="FutureLearn — Giới thiệu" aria-roledescription="carousel">
      <div className={`hero__slide hero__slide--learning${activeSlide === 0 ? ' is-active' : ''}`} data-hero-slide aria-hidden={activeSlide !== 0} inert={activeSlide !== 0}>
        <div className="hero__inner">
          <div className="hero__content">
            <h1 className="hero__title">Giúp trẻ tự tin</h1>
            <p className="hero__highlight">Chinh phục điểm 9, 10</p>
            <ul className="hero__benefits" aria-label="Lợi ích nổi bật">
              <li>Lộ trình học cá nhân hóa</li>
              <li>Bài giảng sinh động</li>
              <li>Đồng hành cùng con</li>
            </ul>
            <a className="hero__cta" href="./dashboard/">
              <span>Khám phá khóa học</span>
              <span className="hero__cta-icon" aria-hidden="true">
                <i className="fa-solid fa-arrow-right" />
              </span>
            </a>
          </div>
          <div className="hero__artwork" role="img" aria-label="Học sinh tự tin trong trang phục tốt nghiệp">
            <img src="./public-home/images/heros/caube1.png" alt="" className="hero__character hero__character--student" width={941} height={1672} loading="eager" decoding="async" />
            <img src="./public-home/images/heros/robot.png" alt="" className="hero__character hero__character--robot" width={612} height={408} loading="eager" decoding="async" />
          </div>
        </div>
      </div>
      <div className={`hero__slide hero__slide--brand${activeSlide === 1 ? ' is-active' : ''}`} data-hero-slide aria-hidden={activeSlide !== 1} inert={activeSlide !== 1}>
        <div className="hero__inner hero__inner--brand">
          <div className="hero__brand-artwork" role="img" aria-label="FutureLearn cùng giáo viên và học sinh tốt nghiệp">
            <img src="./public-home/images/heros/logo2remove.png" alt="" className="hero__brand-logo" width={2172} height={724} loading="eager" decoding="sync" />
            <img src="./public-home/images/heros/hvremove.png" alt="" className="hero__brand-people" width={1122} height={1402} loading="eager" decoding="sync" />
          </div>
          <div className="hero__brand-content">
            <h2 className="hero__brand-title">Nâng tầm tri thức Việt</h2>
            <p className="hero__brand-description">
              Vì 50 triệu người giao tiếp thành thạo tiếng Anh
            </p>
            <a className="hero__brand-cta" href="./dashboard/">
              <span>Trải nghiệm ngay!</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
