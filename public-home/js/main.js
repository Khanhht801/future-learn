/* ============================================================
 * FutureLearn — Main JS
 * Version: v1.5.0
 * Concern: sticky nav shadow, mobile drawer, hero carousel and scrollspy.
 * ============================================================ */
(function () {
    'use strict';

    const SCROLL_THRESHOLD = 8;
    const DESKTOP_BREAKPOINT = 1200;
    const HERO_INTERVAL_MS = 3000;

    function initStickyHeader() {
        const header = document.querySelector('#site-header');
        if (!header) return;

        const update = function () {
            header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    function initMobileMenu() {
        const button = document.querySelector('.site-header__hamburger');
        const drawer = document.querySelector('#mobile-menu');
        if (!button || !drawer) return;

        const close = function () {
            button.setAttribute('aria-expanded', 'false');
            drawer.hidden = true;
        };

        button.addEventListener('click', function () {
            const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(shouldOpen));
            drawer.hidden = !shouldOpen;
        });

        drawer.addEventListener('click', function (event) {
            if (event.target.closest('a')) close();
        });

        document.addEventListener('click', function (event) {
            if (button.getAttribute('aria-expanded') !== 'true') return;
            if (event.target.closest('.site-header__hamburger, #mobile-menu')) return;
            close();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
                close();
                button.focus();
            }
        });

        let resizeTimer;
        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                if (window.innerWidth >= DESKTOP_BREAKPOINT) close();
            }, 150);
        }, { passive: true });
    }

    function initScrollSpy() {
        const items = document.querySelectorAll('.site-header__item');
        const links = document.querySelectorAll('.site-header__link');
        if (items.length === 0 || !('IntersectionObserver' in window)) return;

        const navIdBySectionId = {
            stats: 'about',
            'why-choose': 'about',
            audiences: 'about'
        };

        const setActive = function (id) {
            items.forEach(function (item) {
                item.classList.remove('is-active');
            });

            links.forEach(function (link) {
                if (link.getAttribute('href') === '#' + id) {
                    link.parentElement.classList.add('is-active');
                }
            });
        };

        const sections = document.querySelectorAll('main section[id], footer[id]');
        if (sections.length === 0) return;

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

    function initHeroCarousel() {
        const carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) return;

        const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
        if (slides.length < 2) return;

        let currentIndex = Math.max(0, slides.findIndex(function (slide) {
            return slide.classList.contains('is-active');
        }));
        let timerId = null;

        const showSlide = function (nextIndex) {
            slides.forEach(function (slide, index) {
                const isActive = index === nextIndex;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
                slide.inert = !isActive;
            });
            currentIndex = nextIndex;
        };

        const stop = function () {
            if (timerId === null) return;
            window.clearInterval(timerId);
            timerId = null;
        };

        const start = function () {
            stop();
            timerId = window.setInterval(function () {
                showSlide((currentIndex + 1) % slides.length);
            }, HERO_INTERVAL_MS);
        };

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        start();
    }

    function init() {
        initStickyHeader();
        initMobileMenu();
        initHeroCarousel();
        initScrollSpy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
