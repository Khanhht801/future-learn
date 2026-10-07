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
        window.clearTimeout(autoplayTimer);
        autoplayTimer = 0;
    }

    function scheduleAutoplay() {
        stopAutoplay();

        if (!isVisible || document.hidden) return;

        autoplayTimer = window.setTimeout(function () {
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

    previousButton.addEventListener('click', function () {
        scrollPrevious();
        scheduleAutoplay();
    });

    nextButton.addEventListener('click', function () {
        scrollNext();
        scheduleAutoplay();
    });

    viewport.addEventListener('pointerdown', function (event) {
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

    viewport.addEventListener('pointermove', function (event) {
        if (pointerId === null || event.pointerId !== pointerId) return;

        const distance = event.clientX - dragStartX;
        hasDragged = hasDragged || Math.abs(distance) > 4;
        viewport.scrollLeft = dragStartScrollLeft - distance;
    });

    viewport.addEventListener('pointerup', finishDrag);
    viewport.addEventListener('pointercancel', finishDrag);
    viewport.addEventListener('dragstart', function (event) {
        event.preventDefault();
    });
    viewport.addEventListener('wheel', scheduleAutoplay, { passive: true });
    viewport.addEventListener('touchstart', stopAutoplay, { passive: true });
    viewport.addEventListener('touchend', scheduleAutoplay, { passive: true });
    viewport.addEventListener('keydown', scheduleAutoplay);

    document.addEventListener('visibilitychange', scheduleAutoplay);
    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', scheduleAutoplay);
    } else {
        reducedMotion.addListener(scheduleAutoplay);
    }

    if ('IntersectionObserver' in window) {
        const visibilityObserver = new IntersectionObserver(function (entries) {
            isVisible = entries[0]?.isIntersecting ?? true;
            scheduleAutoplay();
        }, { threshold: 0.2 });

        visibilityObserver.observe(slider);
    }

    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(syncControls);
        resizeObserver.observe(viewport);
        resizeObserver.observe(track);
    } else {
        window.addEventListener('resize', syncControls, { passive: true });
    }

    window.requestAnimationFrame(syncControls);
})();
