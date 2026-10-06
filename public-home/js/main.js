/* ============================================================
 * FutureLearn — Main JS
 * Version: v1.1.2
 * Concern: khởi tạo AOS, sticky nav shadow, mobile drawer,
 *          smooth scroll cho anchor link, hero image slider.
 * ============================================================ */
(function ($) {
    'use strict';

    const SCROLL_THRESHOLD = 8;
    const BREAKPOINT_MOBILE = 991;
    const HERO_SLIDER_INTERVAL_MS = 3000;

    /**
     * Khởi tạo AOS — 1 lần duy nhất.
     * Component khác không tự gọi lại AOS.init().
     */
    function initAOS() {
        if (typeof AOS === 'undefined') return;

        AOS.init({
            duration: 600,
            once: true,
            offset: 80,
            disable: function () {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }

    /**
     * Toggle class is-scrolled cho header khi cuộn trang.
     */
    function initStickyHeader() {
        const $header = $('#site-header');
        if (!$header.length) return;

        const update = function () {
            const scrolled = window.scrollY > SCROLL_THRESHOLD;
            $header.toggleClass('is-scrolled', scrolled);
        };

        update();
        $(window).on('scroll', update, { passive: true });
    }

    /**
     * Mobile drawer — mở/đóng + đóng khi click ra ngoài hoặc nhấn Esc.
     */
    function initMobileMenu() {
        const $btn = $('.site-header__hamburger');
        const $drawer = $('#mobile-menu');
        if (!$btn.length || !$drawer.length) return;

        const open = function () {
            $btn.attr('aria-expanded', 'true');
            $drawer.removeAttr('hidden');
            $('body').addClass('is-menu-open');
        };

        const close = function () {
            $btn.attr('aria-expanded', 'false');
            $drawer.attr('hidden', '');
            $('body').removeClass('is-menu-open');
        };

        $btn.on('click', function () {
            const isOpen = $btn.attr('aria-expanded') === 'true';
            if (isOpen) {
                close();
            } else {
                open();
            }
        });

        // Đóng khi click link trong drawer
        $drawer.find('a').on('click', close);

        // Đóng khi click bên ngoài
        $(document).on('click', function (event) {
            const $target = $(event.target);
            if ($target.closest('.site-header__hamburger, #mobile-menu').length) return;
            if ($btn.attr('aria-expanded') !== 'true') return;
            close();
        });

        // Đóng khi nhấn Esc
        $(document).on('keydown', function (event) {
            if (event.key === 'Escape' && $btn.attr('aria-expanded') === 'true') {
                close();
            }
        });

        // Reset state khi resize vượt breakpoint desktop
        let resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (window.innerWidth > BREAKPOINT_MOBILE) {
                    close();
                }
            }, 150);
        });
    }

    /**
     * Smooth scroll cho anchor link trong nav (trừ những link đã được CSS
     * `scroll-behavior: smooth` xử lý).
     */
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function (event) {
            const href = $(this).attr('href');
            if (!href || href === '#' || href.length < 2) return;

            const $el = $(href);
            if (!$el.length) return;

            event.preventDefault();
            const headerHeight = $('#site-header').outerHeight() || 0;
            const offset = $el.offset().top - headerHeight + 1;

            $('html, body').animate(
                { scrollTop: offset },
                { duration: 500, easing: 'swing' }
            );
        });
    }

    /**
     * Hero image slider — tự động chuyển giữa các slide mỗi 3s
     * (vanilla JS, không phụ thuộc Slick/AOS). Tạm dừng khi tab ẩn.
     */
    function initHeroSlider() {
        const $root = $('[data-hero-slider]');
        if (!$root.length) return;

        const $slides = $root.find('[data-hero-slide]');
        if ($slides.length < 2) return;

        let index = $slides.filter('.is-active').index();
        if (index < 0) index = 0;
        let timerId = null;

        // Đánh dấu slide đã load thành công (img.complete && naturalWidth > 0).
        // Slide load fail sẽ bị bỏ qua khi rotate → không hiện ô trống.
        const $imgs = $slides.find('img');
        $imgs.each(function () {
            const img = this;
            if (img.complete && img.naturalWidth > 0) {
                $(img).closest('[data-hero-slide]').attr('data-loaded', 'true');
            } else {
                img.addEventListener('load', function () {
                    $(img).closest('[data-hero-slide]').attr('data-loaded', 'true');
                });
                img.addEventListener('error', function () {
                    $(img).closest('[data-hero-slide]').attr('data-failed', 'true');
                    // eslint-disable-next-line no-console
                    console.warn('[HeroSlider] Image failed:', img.currentSrc || img.src);
                });
            }
        });

        const showSlide = function (next) {
            $slides.each(function (i) {
                const $slide = $(this);
                const isActive = i === next;
                $slide.toggleClass('is-active', isActive);
                if (isActive) {
                    $slide.removeAttr('aria-hidden');
                } else {
                    $slide.attr('aria-hidden', 'true');
                }
            });
            index = next;
        };

        const tick = function () {
            // Tìm slide ready kế tiếp, bỏ qua slide load fail
            const $validSlides = $slides.filter('[data-loaded="true"]');
            if ($validSlides.length < 2) return;

            const currentValidIdx = $validSlides.filter('.is-active').index();
            const nextValidIdx = (currentValidIdx + 1) % $validSlides.length;
            const $nextSlide = $validSlides.eq(nextValidIdx);
            const nextGlobalIdx = $slides.index($nextSlide);
            showSlide(nextGlobalIdx);
        };

        const start = function () {
            stop();
            timerId = window.setInterval(tick, HERO_SLIDER_INTERVAL_MS);
        };

        const stop = function () {
            if (timerId !== null) {
                window.clearInterval(timerId);
                timerId = null;
            }
        };

        // Pause khi tab không active — tiết kiệm CPU
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        start();
    }

    /**
     * Đánh dấu nav item active dựa trên section đang xem (scrollspy).
     */
    function initScrollSpy() {
        const $items = $('.site-header__item');
        const $links = $('.site-header__link');
        if (!$items.length) return;

        const setActive = function (id) {
            $items.removeClass('is-active');
            $links.each(function () {
                if ($(this).attr('href') === '#' + id) {
                    $(this).parent().addClass('is-active');
                }
            });
        };

        const sections = $('main section[id]').toArray();
        if (!sections.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, {
            rootMargin: '-40% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    $(function () {
        initAOS();
        initStickyHeader();
        initMobileMenu();
        initSmoothScroll();
        initHeroSlider();
        initScrollSpy();
    });
})(jQuery);
