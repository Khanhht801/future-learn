/* ============================================================
 * FutureLearn — Advisors and teachers marquee
 * Version: v1.3.0
 * ============================================================ */
(function () {
    'use strict';

    const viewport = document.querySelector('[data-teachers-carousel]');
    const track = viewport?.querySelector('[data-teachers-track]');
    const progressBar = document.querySelector('[data-teachers-progress]');

    if (!viewport || !track || !progressBar) return;

    const sourceItems = Array.from(track.querySelectorAll('.teachers__item'));
    if (!sourceItems.length) return;

    const clones = sourceItems.map((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
        return clone;
    });

    function getMarqueeAnimation() {
        return track.getAnimations().find((animation) => (
            animation.animationName === 'teachers-marquee'
        ));
    }

    function syncProgress() {
        const animation = getMarqueeAnimation();
        const duration = Number(animation?.effect.getComputedTiming().duration);
        const currentTime = Number(animation?.currentTime);

        if (animation && Number.isFinite(duration) && duration > 0 && Number.isFinite(currentTime)) {
            const progress = ((currentTime % duration) + duration) % duration / duration;
            const percentage = Math.round(progress * 100);

            progressBar.style.setProperty('--teachers-progress', String(progress));
            progressBar.setAttribute('aria-valuenow', String(percentage));
        }

        window.requestAnimationFrame(syncProgress);
    }

    track.querySelectorAll('.teacher-card').forEach((card) => {
        card.addEventListener('mouseenter', function () {
            viewport.classList.add('is-paused');
        });

        card.addEventListener('mouseleave', function () {
            viewport.classList.remove('is-paused');
        });
    });

    function syncMarquee() {
        const distance = clones[0].offsetLeft - sourceItems[0].offsetLeft;
        const speed = window.matchMedia('(max-width: 767.98px)').matches ? 38 : 46;

        if (distance <= 0) return;

        track.style.setProperty('--teachers-translate', `${-distance}px`);
        track.style.setProperty('--teachers-duration', `${distance / speed}s`);
        viewport.classList.add('is-ready');
        progressBar.hidden = false;
    }

    window.requestAnimationFrame(syncMarquee);
    window.requestAnimationFrame(syncProgress);

    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(syncMarquee);
        observer.observe(viewport);
    } else {
        window.addEventListener('resize', syncMarquee, { passive: true });
    }

    window.addEventListener('blur', function () {
        viewport.classList.remove('is-paused');
    });
})();
