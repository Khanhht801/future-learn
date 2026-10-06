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
                window.requestAnimationFrame(updateCounter);
            }
        }

        window.requestAnimationFrame(updateCounter);
    }

    function initStatCounters() {
        const section = document.querySelector('.stats-strip');
        const counters = document.querySelectorAll('[data-stat-counter]');
        if (!section || counters.length === 0) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(function (entries) {
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
        document.addEventListener('DOMContentLoaded', initStatCounters, { once: true });
    } else {
        initStatCounters();
    }
})();
