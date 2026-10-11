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

    const observer = new IntersectionObserver(
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

    window.requestAnimationFrame(function () {
      preparedSections.forEach(function (prepared) {
        prepared.section.__motionTargets = prepared.targets;
        observer.observe(prepared.section);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSectionMotion, {
      once: true,
    });
  } else {
    initSectionMotion();
  }
})();
