/* ============================================================
 * FutureLearn — Advisors and teachers carousel
 * Version: v1.0.0
 * ============================================================ */
(function () {
    'use strict';

    const carousel = document.querySelector('[data-teachers-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('[data-teachers-track]');
    const cards = Array.from(track.querySelectorAll('.teachers__item'));
    const previousButton = carousel.querySelector('[data-teachers-previous]');
    const nextButton = carousel.querySelector('[data-teachers-next]');
    const currentElement = carousel.querySelector('[data-teachers-current]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scrollFrame = 0;

    function getStepSize() {
        const firstCard = cards[0];
        if (!firstCard) return track.clientWidth;

        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap) || 0;
        return firstCard.getBoundingClientRect().width + gap;
    }

    function updateCarouselState() {
        const maximumScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const currentIndex = Math.min(
            cards.length - 1,
            Math.max(0, Math.round(track.scrollLeft / getStepSize()))
        );

        previousButton.disabled = track.scrollLeft <= 2;
        nextButton.disabled = track.scrollLeft >= maximumScroll - 2;
        currentElement.textContent = String(currentIndex + 1);
    }

    function moveCarousel(direction) {
        track.scrollBy({
            left: direction * getStepSize(),
            behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
    }

    previousButton.addEventListener('click', function () {
        moveCarousel(-1);
    });

    nextButton.addEventListener('click', function () {
        moveCarousel(1);
    });

    track.addEventListener('scroll', function () {
        window.cancelAnimationFrame(scrollFrame);
        scrollFrame = window.requestAnimationFrame(updateCarouselState);
    }, { passive: true });

    window.addEventListener('resize', updateCarouselState, { passive: true });
    updateCarouselState();
})();
