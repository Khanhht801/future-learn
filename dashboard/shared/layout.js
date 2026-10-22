(function () {
  "use strict";

  // Resolve from this script so links also work under a subdirectory or file://.
  const dashboardURL = new URL("../", document.currentScript.src);
  const url = function (path) { return new URL(path, dashboardURL).href; };
  const pages = {
    home: { path: "./", journey: "#daily-tasks", journeyLabel: "Xem nhiệm vụ hôm nay", data: window.learningDashboardData },
    english: { path: "english/", journey: "#topics", journeyLabel: "Tiếp tục hành trình học hôm nay", data: window.englishDashboardData },
    math: { path: "math/", journey: "#math-path", journeyLabel: "Xem hành trình Toán hôm nay", data: window.mathDashboardData },
    badges: { path: "badges/", journey: "#collection", journeyLabel: "Xem bộ sưu tập huy hiệu của bé", data: window.badgeDashboardData }
  };
  const subject = document.body.dataset.dashboard;
  const page = pages[subject];
  const headerHost = document.querySelector("[data-dashboard-header]");
  const footerHost = document.querySelector("[data-dashboard-footer]");
  if (!page || !headerHost || !footerHost) return;

  const homeURL = url("../index.html");
  const logoURL = url("../logo.png");
  const svg = function (paths) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths + '</svg>'; };
  const icons = {
    home: svg('<path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />'),
    math: '<img src="' + url("shared/assets/math-planet.svg") + '" width="32" height="32" alt="" />',
    english: svg('<path d="M5.5 20c2.6-2.2 10.4-2.2 13 0H5.5Z" /><path d="m11 18 2-9" /><path d="M13 10C10.7 6.8 7.2 6.5 5.4 8.8c3.1-.3 5.3.6 7.6 2.7M13 10c1.4-3.4 4.8-4.3 7.2-2.2-3.2.3-5.4 1.6-7.2 4M13 9.2c-.2-2.8 1.6-4.9 4.3-5.2-1.6 1.8-2.4 3.7-2.5 6" />'),
    badges: svg('<circle cx="12" cy="8" r="5" /><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9" />'),
    parents: svg('<circle cx="9" cy="8" r="3" /><path d="M3.5 19v-2.2A4.8 4.8 0 0 1 8.3 12h1.4a4.8 4.8 0 0 1 4.8 4.8V19M16 7.5a2.5 2.5 0 0 1 0 5M16 13a4 4 0 0 1 4 4v2" />'),
    account: svg('<circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" />')
  };

  // One navigation model drives desktop, drawer and bottom navigation.
  const navigation = [
    { id: "home", label: "Góc học tập", shortLabel: "Góc học", path: "./" },
    { id: "math", label: "Hành tinh Toán", shortLabel: "Toán", path: pages.math.path, iconClass: "subject-nav__icon--planet" },
    { id: "english", label: "Đảo tiếng Anh", shortLabel: "Tiếng Anh", path: pages.english.path, iconClass: "subject-nav__icon--island" },
    { id: "badges", label: "Bộ sưu tập huy hiệu", shortLabel: "Huy hiệu", path: pages.badges.path },
    { id: "parents", label: "Góc phụ huynh", path: "./?panel=parents" }
  ];

  function navItem(item, bottom) {
    const current = item.id === subject;
    const className = (bottom ? "bottom-nav__item" : "subject-nav__item") + (current ? " is-current" : "");
    const attributes = ' class="' + className + '"' +
      (current ? ' aria-current="page"' : '') +
      (item.path ? ' href="' + url(item.path) + '"' : ' aria-disabled="true"') +
      ' aria-label="' + item.label + '" title="' + item.label + '"';
    const icon = bottom ? icons[item.id] : '<span class="subject-nav__icon ' + (item.iconClass || '') + '">' + icons[item.id] + '</span>';
    const label = '<span' + (bottom ? '' : ' class="subject-nav__label"') + '>' + (bottom ? item.shortLabel : item.label) + '</span>';
    const tag = item.path ? "a" : "span";
    return '<' + tag + attributes + '>' + icon + label + '</' + tag + '>';
  }

  function mount(host, markup) {
    const template = document.createElement("template");
    template.innerHTML = markup;
    host.replaceWith(template.content);
  }

  mount(headerHost, `
    <a class="skip-link" href="#main-content">Đi tới nội dung chính</a>
    <header class="app-header">
      <div class="app-header__brand-group">
        <button
          class="icon-button app-header__menu-button"
          type="button"
          aria-label="Mở danh mục học tập"
          aria-controls="mobile-drawer"
          aria-expanded="false"
          data-menu-button
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <a
          class="brand"
          href="${homeURL}"
          aria-label="FutureLearn – Trang chủ"
        >
          <img
            src="${logoURL}"
            alt="FutureLearn"
            width="820"
            height="180"
          />
        </a>
      </div>

      <div class="app-header__account">
        <div class="reward-chip" aria-label="0 sao" data-reward-chip>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
            />
          </svg>
          <span data-reward-count>0</span>
        </div>
        <button
          class="profile-button" data-open-profile
          type="button"
          aria-label="Mở tài khoản học viên"
        >
          <span class="profile-button__avatar" aria-hidden="true">AN</span>
          <svg
            class="profile-button__chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m8 10 4 4 4-4" />
          </svg>
        </button>
      </div>
    </header>
    <aside class="sidebar" id="desktop-sidebar" aria-label="Danh mục học tập" data-sidebar>
      <button class="sidebar__toggle" type="button" aria-label="Thu gọn thanh bên" aria-controls="desktop-sidebar" aria-expanded="true" data-sidebar-toggle>
        <svg class="sidebar__leaf" viewBox="0 0 48 48" aria-hidden="true">
          <path class="sidebar__leaf-body" d="M6 10C22 3 40 10 39 30C21 38 7 29 6 10Z" />
          <path class="sidebar__leaf-fold" d="M6 10C22 3 40 10 39 30C28 22 17 15 6 10Z" />
          <path class="sidebar__leaf-veins" d="M10 13C22 18 33 25 43 35M21 19L21 12M29 24L33 17M20 19L13 23M29 25L23 29" />
        </svg>
      </button>
      <nav class="subject-nav" aria-label="Môn học">${navigation.slice(0, 4).map(function (item) { return navItem(item, false); }).join("")}</nav>
      <a class="sidebar-journey${subject === 'badges' ? ' sidebar-journey--trophy' : ' sidebar-journey--learning'}" href="${page.journey}" aria-label="${page.journeyLabel}">
        <img src="${url(subject === 'badges' ? 'badges/assets/trophy.webp' : 'shared/assets/learning-companions.png')}" width="${subject === 'badges' ? '512' : '1122'}" height="${subject === 'badges' ? '640' : '1402'}" alt="${subject === 'badges' ? 'Chiếc cúp ngôi sao vàng trong khu vườn thành tích' : 'Cú xanh đội mũ tốt nghiệp cùng hai bé khám phá cuốn sách, chữ cái và các con số'}" loading="lazy" />
      </a>
      <div class="sidebar__footer">${navItem(navigation[4], false)}</div>
    </aside>
    <div class="drawer-backdrop" data-drawer-backdrop hidden></div>
    <aside class="mobile-drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Danh mục học tập trên di động" hidden>
      <div class="mobile-drawer__header">
        <p>Chọn khu vực học</p>
        <button class="icon-button" type="button" aria-label="Đóng danh mục" data-menu-close>${svg('<path d="m6 6 12 12M18 6 6 18" />')}</button>
      </div>
      <nav class="subject-nav" aria-label="Môn học trên di động">${navigation.map(function (item) { return navItem(item, false); }).join("")}</nav>
    </aside>
  `);
  mount(footerHost, `
    <nav class="bottom-nav" aria-label="Điều hướng nhanh trên di động">
      ${navigation.slice(0, 4).map(function (item) { return navItem(item, true); }).join("")}
    </nav>
  `);

  if (page.data && Number.isFinite(page.data.stars)) {
    document.querySelector("[data-reward-count]").textContent = page.data.stars;
    document.querySelector("[data-reward-chip]").setAttribute("aria-label", page.data.stars + " sao");
  }

  const toggle = document.querySelector("[data-sidebar-toggle]");
  const storageKey = "futurelearn-sidebar-collapsed";
  let savedPreference = null;
  try { savedPreference = window.localStorage.getItem(storageKey); } catch (error) { /* Storage is optional. */ }

  function setSidebarCollapsed(collapsed, persist) {
    document.documentElement.classList.toggle("sidebar-is-collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên");
    if (persist) {
      try { window.localStorage.setItem(storageKey, String(collapsed)); } catch (error) { /* Keep the control usable. */ }
    }
  }
  setSidebarCollapsed(savedPreference === null ? window.matchMedia("(max-width: 1023.98px)").matches : savedPreference === "true", false);
  toggle.addEventListener("click", function () {
    setSidebarCollapsed(!document.documentElement.classList.contains("sidebar-is-collapsed"), true);
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const closeButton = document.querySelector("[data-menu-close]");
  const drawer = document.querySelector("#mobile-drawer");
  const backdrop = document.querySelector("[data-drawer-backdrop]");
  let previousOverflow = "";
  let backgroundElements = [];

  function setDrawer(open, restoreFocus) {
    if (open === !drawer.hidden) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Đóng danh mục học tập" : "Mở danh mục học tập");
    drawer.hidden = !open;
    backdrop.hidden = !open;
    if (open) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      backgroundElements = Array.from(document.body.children).filter(function (element) {
        return element !== drawer && element !== backdrop && !element.inert && !["SCRIPT", "TEMPLATE"].includes(element.tagName);
      });
      backgroundElements.forEach(function (element) { element.inert = true; });
      closeButton.focus();
    } else {
      backgroundElements.forEach(function (element) { element.inert = false; });
      backgroundElements = [];
      document.body.style.overflow = previousOverflow;
      if (restoreFocus !== false) menuButton.focus();
    }
  }

  menuButton.addEventListener("click", function () { setDrawer(drawer.hidden); });
  closeButton.addEventListener("click", function () { setDrawer(false); });
  backdrop.addEventListener("click", function () { setDrawer(false); });
  drawer.addEventListener("click", function (event) {
    if (event.target.closest("a[href]")) setDrawer(false);
  });
  document.addEventListener("keydown", function (event) {
    if (drawer.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setDrawer(false);
    } else if (event.key === "Tab") {
      const focusable = drawer.querySelectorAll("button, a[href]");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) setDrawer(false, false);
  });
})();
