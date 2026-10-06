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

    track.querySelectorAll(".student-review-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            viewport.classList.add("is-paused");
        });

        card.addEventListener("mouseleave", () => {
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

    window.requestAnimationFrame(syncMarquee);

    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(syncMarquee);
        observer.observe(sourceGroup);
    } else {
        window.addEventListener("resize", syncMarquee, { passive: true });
    }

    window.addEventListener("blur", () => {
        viewport.classList.remove("is-paused");
    });
})();
