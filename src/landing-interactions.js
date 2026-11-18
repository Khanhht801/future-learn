// Adapter for the original landing page interactions. All registrations are
// owned by the mounted page and released when React unmounts it.
export function initLanding() {
  const disposers = [];
  const listen = (target, type, callback, options) => {
    target.addEventListener(type, callback, options);
    disposers.push(() => target.removeEventListener(type, callback, options));
  };
  const timeouts = new Set();
  const intervals = new Set();
  const frames = new Set();
  disposers.push(() => {
    timeouts.forEach(id => window.clearTimeout(id));
    intervals.forEach(id => window.clearInterval(id));
    frames.forEach(id => window.cancelAnimationFrame(id));
  });
  const lifecycle = {
    setTimeout(callback, delay) {
      const id = window.setTimeout(() => { timeouts.delete(id); callback(); }, delay);
      timeouts.add(id);
      return id;
    },
    clearTimeout(id) { timeouts.delete(id); window.clearTimeout(id); },
    clearInterval(id) { intervals.delete(id); window.clearInterval(id); },
    setInterval(callback, delay) {
      const id = window.setInterval(callback, delay);
      intervals.add(id);
      return id;
    },
    requestAnimationFrame(callback) {
      const id = window.requestAnimationFrame(time => { frames.delete(id); callback(time); });
      frames.add(id);
      return id;
    },
    intersectionObserver(callback, options) { const observer = new IntersectionObserver(callback, options); disposers.push(() => observer.disconnect()); return observer; },
    resizeObserver(callback) { const observer = new ResizeObserver(callback); disposers.push(() => observer.disconnect()); return observer; },
  };

/* ============================================================
 * FutureLearn — Stat counter
 * Version: v1.0.0
 * ============================================================ */
(function () {
    'use strict';

    const COUNTER_DURATION_MS = 1400;
    const OBSERVER_THRESHOLD = 0.35;
    const numberFormatter = new Intl.NumberFormat('vi-VN');

    function animateCounter(element) {
        const target = Number(element.dataset.statCounter);
        if (!Number.isFinite(target) || target < 0) return;

        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(target * easedProgress);

            element.textContent = numberFormatter.format(currentValue);

            if (progress < 1) {
                lifecycle.requestAnimationFrame(updateCounter);
            }
        }

        lifecycle.requestAnimationFrame(updateCounter);
    }

    function initStatCounters() {
        const section = document.querySelector('.stats-strip');
        const counters = document.querySelectorAll('[data-stat-counter]');
        if (!section || counters.length === 0) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

        const observer = lifecycle.intersectionObserver(function (entries) {
            const isVisible = entries.some(function (entry) {
                return entry.isIntersecting;
            });

            if (!isVisible) return;

            counters.forEach(animateCounter);
            observer.disconnect();
        }, {
            threshold: OBSERVER_THRESHOLD
        });

        observer.observe(section);
    }

    if (document.readyState === 'loading') {
        listen(document, 'DOMContentLoaded', initStatCounters, { once: true });
    } else {
        initStatCounters();
    }
})();


/* ============================================================
 * FutureLearn — Interactive advisors and teachers carousel
 * Version: v1.5.3
 * ============================================================ */
(function () {
    'use strict';

    const slider = document.querySelector('[data-teachers-slider]');
    const viewport = slider?.querySelector('[data-teachers-carousel]');
    const track = slider?.querySelector('[data-teachers-track]');
    const previousButton = slider?.querySelector('[data-teachers-prev]');
    const nextButton = slider?.querySelector('[data-teachers-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const autoplayDelay = 1500;

    if (!slider || !viewport || !track || !previousButton || !nextButton) return;

    let autoplayTimer = 0;
    let isVisible = true;
    let pointerId = null;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let hasDragged = false;

    function getScrollStep() {
        const items = track.querySelectorAll('.teachers__item');

        if (items.length > 1) {
            return items[1].offsetLeft - items[0].offsetLeft;
        }

        return items[0]?.offsetWidth || viewport.clientWidth;
    }

    function getBehavior() {
        return reducedMotion.matches ? 'auto' : 'smooth';
    }

    function scrollPrevious() {
        const atStart = viewport.scrollLeft <= 2;
        const destination = atStart
            ? viewport.scrollWidth - viewport.clientWidth
            : viewport.scrollLeft - getScrollStep();

        viewport.scrollTo({
            left: destination,
            behavior: atStart ? 'auto' : getBehavior()
        });
    }

    function scrollNext() {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const atEnd = viewport.scrollLeft >= maxScroll - 2;

        viewport.scrollTo({
            left: atEnd ? 0 : viewport.scrollLeft + getScrollStep(),
            behavior: atEnd ? 'auto' : getBehavior()
        });
    }

    function stopAutoplay() {
        lifecycle.clearTimeout(autoplayTimer);
        autoplayTimer = 0;
    }

    function scheduleAutoplay() {
        stopAutoplay();

        if (!isVisible || document.hidden) return;

        autoplayTimer = lifecycle.setTimeout(function () {
            scrollNext();
            scheduleAutoplay();
        }, autoplayDelay);
    }

    function syncControls() {
        const hasOverflow = viewport.scrollWidth > viewport.clientWidth + 1;
        previousButton.hidden = !hasOverflow;
        nextButton.hidden = !hasOverflow;

        if (hasOverflow) {
            scheduleAutoplay();
        } else {
            stopAutoplay();
        }
    }

    function finishDrag(event) {
        if (pointerId === null || event.pointerId !== pointerId) return;

        viewport.classList.remove('is-dragging');

        if (viewport.hasPointerCapture(pointerId)) {
            viewport.releasePointerCapture(pointerId);
        }

        pointerId = null;

        if (hasDragged) {
            const step = getScrollStep();
            viewport.scrollTo({
                left: Math.round(viewport.scrollLeft / step) * step,
                behavior: getBehavior()
            });
        }

        scheduleAutoplay();
    }

    listen(previousButton, 'click', function () {
        scrollPrevious();
        scheduleAutoplay();
    });

    listen(nextButton, 'click', function () {
        scrollNext();
        scheduleAutoplay();
    });

    listen(viewport, 'pointerdown', function (event) {
        if (event.pointerType === 'touch' || event.button !== 0) return;

        pointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartScrollLeft = viewport.scrollLeft;
        hasDragged = false;
        viewport.classList.add('is-dragging');
        viewport.setPointerCapture(pointerId);
        viewport.focus({ preventScroll: true });
        stopAutoplay();
        event.preventDefault();
    });

    listen(viewport, 'pointermove', function (event) {
        if (pointerId === null || event.pointerId !== pointerId) return;

        const distance = event.clientX - dragStartX;
        hasDragged = hasDragged || Math.abs(distance) > 4;
        viewport.scrollLeft = dragStartScrollLeft - distance;
    });

    listen(viewport, 'pointerup', finishDrag);
    listen(viewport, 'pointercancel', finishDrag);
    listen(viewport, 'dragstart', function (event) {
        event.preventDefault();
    });
    listen(viewport, 'wheel', scheduleAutoplay, { passive: true });
    listen(viewport, 'touchstart', stopAutoplay, { passive: true });
    listen(viewport, 'touchend', scheduleAutoplay, { passive: true });
    listen(viewport, 'keydown', scheduleAutoplay);

    listen(document, 'visibilitychange', scheduleAutoplay);
    if (typeof reducedMotion.addEventListener === 'function') {
        listen(reducedMotion, 'change', scheduleAutoplay);
    } else {
        reducedMotion.addListener(scheduleAutoplay);
        disposers.push(() => reducedMotion.removeListener(scheduleAutoplay));
    }

    if ('IntersectionObserver' in window) {
        const visibilityObserver = lifecycle.intersectionObserver(function (entries) {
            isVisible = entries[0]?.isIntersecting ?? true;
            scheduleAutoplay();
        }, { threshold: 0.2 });

        visibilityObserver.observe(slider);
    }

    if ('ResizeObserver' in window) {
        const resizeObserver = lifecycle.resizeObserver(syncControls);
        resizeObserver.observe(viewport);
        resizeObserver.observe(track);
    } else {
        listen(window, 'resize', syncControls, { passive: true });
    }

    lifecycle.requestAnimationFrame(syncControls);
})();


(function () {
    "use strict";

    const form = document.querySelector("[data-consultation-form]");

    if (!form) {
        return;
    }

    const status = form.querySelector("[data-consultation-status]");
    const fields = Array.from(form.querySelectorAll("input, select"));
    const phoneField = form.querySelector("#consultation-phone");

    const messages = {
        "consultation-name": "Vui lòng nhập họ và tên.",
        "consultation-phone": "Vui lòng nhập đúng 10 chữ số điện thoại.",
        "consultation-class": "Vui lòng nhập lớp cần tư vấn.",
        "consultation-channel": "Vui lòng chọn nơi bố mẹ biết đến FutureLearn."
    };

    function showFieldState(field) {
        const error = form.querySelector(`[data-error-for="${field.id}"]`);
        const isValid = field.checkValidity();

        field.setAttribute("aria-invalid", String(!isValid));

        if (error) {
            error.textContent = isValid ? "" : messages[field.id];
        }

        return isValid;
    }

    listen(phoneField, "input", () => {
        phoneField.value = phoneField.value.replace(/\D/g, "").slice(0, 10);
    });

    fields.forEach((field) => {
        listen(field, "blur", () => showFieldState(field));
        listen(field, "input", () => {
            if (field.getAttribute("aria-invalid") === "true") {
                showFieldState(field);
            }
        });
    });

    listen(form, "submit", (event) => {
        event.preventDefault();

        const firstInvalidField = fields.find((field) => !showFieldState(field));

        if (firstInvalidField) {
            status.textContent = "Vui lòng kiểm tra lại các thông tin còn thiếu.";
            firstInvalidField.focus();
            return;
        }

        status.textContent = "Biểu mẫu đã hợp lệ và sẵn sàng kết nối hệ thống tiếp nhận tư vấn.";
    });
})();


(function () {
    "use strict";

    const viewport = document.querySelector("[data-reviews-marquee]");
    const track = document.querySelector("[data-reviews-track]");
    const sourceGroup = document.querySelector("[data-reviews-group]");

    if (!viewport || !track || !sourceGroup) {
        return;
    }

    const cloneGroup = sourceGroup.cloneNode(true);
    cloneGroup.removeAttribute("data-reviews-group");
    cloneGroup.setAttribute("aria-hidden", "true");
    track.appendChild(cloneGroup);
    disposers.push(() => cloneGroup.remove());

    track.querySelectorAll(".student-review-card").forEach((card) => {
        listen(card, "mouseenter", () => {
            viewport.classList.add("is-paused");
        });

        listen(card, "mouseleave", () => {
            viewport.classList.remove("is-paused");
        });
    });

    function syncMarquee() {
        const trackStyle = window.getComputedStyle(track);
        const gap = Number.parseFloat(trackStyle.columnGap) || 0;
        const distance = sourceGroup.getBoundingClientRect().width + gap;
        const speed = window.matchMedia("(max-width: 767.98px)").matches ? 40 : 52;

        track.style.setProperty("--reviews-translate", `${-distance}px`);
        track.style.setProperty("--reviews-duration", `${distance / speed}s`);
        viewport.classList.add("is-ready");
    }

    lifecycle.requestAnimationFrame(syncMarquee);

    if ("ResizeObserver" in window) {
        const observer = lifecycle.resizeObserver(syncMarquee);
        observer.observe(sourceGroup);
    } else {
        listen(window, "resize", syncMarquee, { passive: true });
    }

    listen(window, "blur", () => {
        viewport.classList.remove("is-paused");
    });
})();


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
        listen(window, 'scroll', update, { passive: true });
    }

    function initMobileMenu() {
        const button = document.querySelector('.site-header__hamburger');
        const drawer = document.querySelector('#mobile-menu');
        if (!button || !drawer) return;

        const close = function () {
            button.setAttribute('aria-expanded', 'false');
            drawer.hidden = true;
        };

        listen(button, 'click', function () {
            const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(shouldOpen));
            drawer.hidden = !shouldOpen;
        });

        listen(drawer, 'click', function (event) {
            if (event.target.closest('a')) close();
        });

        listen(document, 'click', function (event) {
            if (button.getAttribute('aria-expanded') !== 'true') return;
            if (event.target.closest('.site-header__hamburger, #mobile-menu')) return;
            close();
        });

        listen(document, 'keydown', function (event) {
            if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
                close();
                button.focus();
            }
        });

        let resizeTimer;
        listen(window, 'resize', function () {
            lifecycle.clearTimeout(resizeTimer);
            resizeTimer = lifecycle.setTimeout(function () {
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

        const observer = lifecycle.intersectionObserver(function (entries) {
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
            lifecycle.clearInterval(timerId);
            timerId = null;
        };

        const start = function () {
            stop();
            timerId = lifecycle.setInterval(function () {
                showSlide((currentIndex + 1) % slides.length);
            }, HERO_INTERVAL_MS);
        };

        listen(document, 'visibilitychange', function () {
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
        listen(document, 'DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();


/* ============================================================
 * FutureLearn — section entrance choreography
 * One reveal per section; the hero remains completely untouched.
 * ============================================================ */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const choreography = [
    {
      section: "#about",
      groups: [
        [".about-story__content", "from-left"],
        [".about-story__milestone", "pop"],
        [".about-story__photo", "wipe"],
      ],
    },
    {
      section: "#stats",
      groups: [
        [".stats-strip__title", "rise"],
        [".stats-strip__item", "pop"],
      ],
    },
    {
      section: "#why-choose",
      groups: [
        [".why-choose__header", "rise"],
        [".why-choose__scroll-hint", "from-right"],
        [".why-choose__item", "tilt"],
      ],
    },
    {
      section: "#audiences",
      groups: [
        [".audiences__title", "rise"],
        [".audiences__visual", "wipe"],
        [".audience-accordion__item", "from-right"],
      ],
    },
    {
      section: "#training-programs",
      groups: [
        [".training-programs__header", "rise"],
        [".training-programs__item", "tilt"],
      ],
    },
    {
      section: "#teachers",
      groups: [
        [".teachers__header", "rise"],
        [".teachers__carousel", "wipe"],
      ],
    },
    {
      section: "#consultation",
      groups: [
        [".consultation__header", "from-left"],
        [".consultation-form__field", "rise"],
        [".consultation-form__submit", "pop"],
        [".consultation__visual", "from-right"],
      ],
    },
    {
      section: "#testimonials",
      groups: [
        [".student-reviews__header", "rise"],
        [".student-reviews__viewport", "focus"],
      ],
    },
  ];

  function prepareSection(config) {
    const section = document.querySelector(config.section);
    if (!section || section.classList.contains("hero")) return null;

    let order = 0;
    const targets = [];

    config.groups.forEach(function (group) {
      section.querySelectorAll(group[0]).forEach(function (element) {
        element.dataset.motion = group[1];
        element.style.setProperty("--motion-order", String(order));
        targets.push(element);
        order += 1;
      });
    });

    return targets.length ? { section: section, targets: targets } : null;
  }

  function reveal(entry, observer) {
    if (!entry.isIntersecting) return;

    const targets = entry.target.__motionTargets || [];
    targets.forEach(function (target) {
      target.classList.add("is-motion-visible");
    });
    entry.target.classList.add("is-motion-complete");
    observer.unobserve(entry.target);
  }

  function initSectionMotion() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const preparedSections = choreography.map(prepareSection).filter(Boolean);
    if (!preparedSections.length) return;

    document.documentElement.classList.add("motion-enabled");

    const observer = lifecycle.intersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          reveal(entry, observer);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    lifecycle.requestAnimationFrame(function () {
      preparedSections.forEach(function (prepared) {
        prepared.section.__motionTargets = prepared.targets;
        observer.observe(prepared.section);
      });
    });
  }

  if (document.readyState === "loading") {
    listen(document, "DOMContentLoaded", initSectionMotion, {
      once: true,
    });
  } else {
    initSectionMotion();
  }
})();


  return () => {
    disposers.reverse().forEach(dispose => dispose());
    document.documentElement.classList.remove('motion-enabled');
  };
}
