/* ============================================================
 * FutureLearn — Main JS
 * Version: v1.3.2
 * Concern: khởi tạo AOS, sticky nav shadow, mobile drawer,
 *          smooth scroll cho anchor link và scrollspy.
 * ============================================================ */
(function ($) {
    'use strict';

    const SCROLL_THRESHOLD = 8;
    const BREAKPOINT_MOBILE = 1199;

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
     * Đánh dấu nav item active dựa trên section đang xem (scrollspy).
     */
    function initScrollSpy() {
        const $items = $('.site-header__item');
        const $links = $('.site-header__link');
        if (!$items.length) return;

        // Các section này đều thuộc nhóm "Giới thiệu" trên navigation.
        const navIdBySectionId = {
            stats: 'about',
            'why-choose': 'about',
            audiences: 'about'
        };

        const setActive = function (id) {
            $items.removeClass('is-active');
            $links.each(function () {
                if ($(this).attr('href') === '#' + id) {
                    $(this).parent().addClass('is-active');
                }
            });
        };

        const sections = $('main section[id], footer[id]').toArray();
        if (!sections.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActive(navIdBySectionId[entry.target.id] || entry.target.id);
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
        initScrollSpy();
    });
})(jQuery);
