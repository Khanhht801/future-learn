export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="footer-title">
      <div className="site-footer__decor" aria-hidden="true">
        <span className="site-footer__word site-footer__word--hello">Hello!</span>
        <span className="site-footer__word site-footer__word--bonjour">Bonjour</span>
        <i className="fa-solid fa-comment-dots site-footer__bubble" />
        <i className="fa-solid fa-earth-asia site-footer__globe" />
      </div>
      <div className="container-xl site-footer__inner">
        <div className="site-footer__intro">
          <a href="#home" className="site-footer__brand" aria-label="FutureLearn — về đầu trang">
            Future<span>Learn</span>
          </a>
          <h2 id="footer-title" className="site-footer__title">
            Cùng nhau bắt đầu một cuộc trò chuyện nhé!
          </h2>
          <p className="site-footer__description">
            Bạn cần tư vấn lộ trình học hoặc muốn tìm hiểu thêm? Đội ngũ của
            chúng tôi luôn sẵn sàng lắng nghe.
          </p>
        </div>
        <div className="site-footer__contact-block">
          <h3 className="site-footer__contact-title">Thông tin liên hệ</h3>
          <address className="site-footer__contact">
            <a className="site-footer__contact-item" href="tel:19001234">
              <span className="site-footer__icon" aria-hidden="true">
                <i className="fa-solid fa-phone" />
              </span>
              <span>
                <small>Điện thoại</small>
                <strong>1900 1234</strong>
              </span>
            </a>
            <a className="site-footer__contact-item" href="mailto:hello@futurelearn.vn">
              <span className="site-footer__icon" aria-hidden="true">
                <i className="fa-solid fa-envelope" />
              </span>
              <span>
                <small>Email</small>
                <strong>hello@futurelearn.vn</strong>
              </span>
            </a>
            <a className="site-footer__contact-item" href="https://maps.google.com/?q=Ha+Noi+Vietnam" target="_blank" rel="noopener noreferrer">
              <span className="site-footer__icon" aria-hidden="true">
                <i className="fa-solid fa-location-dot" />
              </span>
              <span>
                <small>Văn phòng</small>
                <strong>123 Đường Tương Lai, Lạng Sơn</strong>
              </span>
            </a>
          </address>
        </div>
      </div>
      <div className="container-xl site-footer__bottom">
        <p>© 2026 FutureLearn. Học hôm nay, tự tin ngày mai.</p>
        <nav className="site-footer__socials" aria-label="Mạng xã hội">
          <a href="#" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f" aria-hidden="true" />
          </a>
          <a href="#" aria-label="YouTube">
            <i className="fa-brands fa-youtube" aria-hidden="true" />
          </a>
          <a href="#" aria-label="TikTok">
            <i className="fa-brands fa-tiktok" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
