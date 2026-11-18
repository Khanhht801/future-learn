import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { dashboardLink, type Area } from "../lib/navigation";

const navigation: {
  id: Area;
  label: string;
  shortLabel: string;
  path: string;
}[] = [
  { id: "home", label: "Góc học tập", shortLabel: "Góc học", path: "" },
  { id: "math", label: "Hành tinh Toán", shortLabel: "Toán", path: "math/" },
  {
    id: "english",
    label: "Đảo tiếng Anh",
    shortLabel: "Tiếng Anh",
    path: "english/",
  },
  {
    id: "badges",
    label: "Bộ sưu tập huy hiệu",
    shortLabel: "Huy hiệu",
    path: "badges/",
  },
  {
    id: "parents",
    label: "Góc phụ huynh",
    shortLabel: "Phụ huynh",
    path: "parents/",
  },
];
function NavIcon({ id }: { id: Area }) {
  if (id === "math")
    return (
      <img
        src={dashboardLink("shared/assets/math-planet.svg")}
        width="32"
        height="32"
        alt=""
      />
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {id === "home" ? (
        <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />
      ) : id === "english" ? (
        <>
          <path d="M5.5 20c2.6-2.2 10.4-2.2 13 0H5.5Z" />
          <path d="m11 18 2-9" />
          <path d="M13 10C10.7 6.8 7.2 6.5 5.4 8.8c3.1-.3 5.3.6 7.6 2.7M13 10c1.4-3.4 4.8-4.3 7.2-2.2-3.2.3-5.4 1.6-7.2 4M13 9.2c-.2-2.8 1.6-4.9 4.3-5.2-1.6 1.8-2.4 3.7-2.5 6" />
        </>
      ) : id === "badges" ? (
        <>
          <circle cx="12" cy="8" r="5" />
          <path d="m8.5 12-2 9 5.5-3 5.5 3-2-9" />
        </>
      ) : (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19v-2.2A4.8 4.8 0 0 1 8.3 12h1.4a4.8 4.8 0 0 1 4.8 4.8V19M16 7.5a2.5 2.5 0 0 1 0 5M16 13a4 4 0 0 1 4 4v2" />
        </>
      )}
    </svg>
  );
}
function Navigation({
  area,
  bottom = false,
  subset,
}: {
  area: Area;
  bottom?: boolean;
  subset?: "primary" | "footer";
}) {
  const items = bottom
    ? area === "parents"
      ? navigation.filter((item) => item.id !== "badges")
      : navigation.slice(0, 4)
    : subset === "primary"
      ? navigation.slice(0, 4)
      : subset === "footer"
        ? navigation.slice(4)
        : navigation;
  return (
    <>
      {items.map((item) => (
        <a
          key={item.id}
          className={`${bottom ? "bottom-nav__item" : "subject-nav__item"}${area === item.id ? " is-current" : ""}`}
          aria-current={area === item.id ? "page" : undefined}
          href={dashboardLink(item.path)}
          aria-label={item.label}
          title={item.label}
        >
          {bottom ? (
            <NavIcon id={item.id} />
          ) : (
            <span
              className={`subject-nav__icon${item.id === "math" ? " subject-nav__icon--planet" : item.id === "english" ? " subject-nav__icon--island" : ""}`}
            >
              <NavIcon id={item.id} />
            </span>
          )}
          <span className={bottom ? undefined : "subject-nav__label"}>
            {bottom ? item.shortLabel : item.label}
          </span>
        </a>
      ))}
    </>
  );
}
function Sidebar({
  area,
  collapsed,
  toggle,
  journey,
}: {
  area: Area;
  collapsed: boolean;
  toggle: () => void;
  journey?: string;
}) {
  const target =
    journey ||
    {
      home: "#daily-tasks",
      english: "#topics",
      math: "#math-path",
      badges: "#collection",
      parents: "#subject-progress",
    }[area];
  return (
    <aside
      className="sidebar"
      id="desktop-sidebar"
      aria-label="Danh mục học tập"
      data-sidebar
    >
      <button
        className="sidebar__toggle"
        type="button"
        aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
        aria-controls="desktop-sidebar"
        aria-expanded={!collapsed}
        data-sidebar-toggle
        onClick={toggle}
      >
        <svg className="sidebar__leaf" viewBox="0 0 48 48" aria-hidden="true">
          <path
            className="sidebar__leaf-body"
            d="M6 10C22 3 40 10 39 30C21 38 7 29 6 10Z"
          />
          <path
            className="sidebar__leaf-fold"
            d="M6 10C22 3 40 10 39 30C28 22 17 15 6 10Z"
          />
          <path
            className="sidebar__leaf-veins"
            d="M10 13C22 18 33 25 43 35M21 19L21 12M29 24L33 17M20 19L13 23M29 25L23 29"
          />
        </svg>
      </button>
      <nav className="subject-nav" aria-label="Môn học">
        <Navigation area={area} subset="primary" />
      </nav>
      <a
        className={`sidebar-journey sidebar-journey--${area === "badges" ? "trophy" : "learning"}`}
        href={target}
        aria-label="Tiếp tục hành trình học hôm nay"
      >
        {area === "badges" ? (
          <img
            src={dashboardLink("badges/assets/trophy.webp")}
            width="512"
            height="640"
            alt="Chiếc cúp ngôi sao vàng trong khu vườn thành tích"
            loading="lazy"
          />
        ) : (
          <svg
            className="sidebar-journey__learning-art"
            viewBox="50 280 1030 920"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Cú xanh đội mũ tốt nghiệp cùng hai bé khám phá cuốn sách, chữ cái và các con số"
          >
            <image
              href={dashboardLink("shared/assets/learning-companions.png")}
              width="1122"
              height="1402"
            />
          </svg>
        )}
      </a>
      <div className="sidebar__footer">
        <Navigation area={area} subset="footer" />
      </div>
    </aside>
  );
}

export function DashboardLayout({
  area,
  children,
  stars = 120,
  onProfile,
  journey,
}: {
  area: Area;
  children: ReactNode;
  stars?: number;
  onProfile?: () => void;
  journey?: string;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("futurelearn-sidebar-collapsed");
      if (saved !== null) return saved === "true";
    } catch {
      /* Optional preference. */
    }
    return matchMedia("(max-width: 1023.98px)").matches;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "sidebar-is-collapsed",
      collapsed,
    );
    return () =>
      document.documentElement.classList.remove("sidebar-is-collapsed");
  }, [collapsed]);
  useEffect(() => {
    if (!drawerOpen) return;
    const root = document.getElementById("root")!;
    const previousInert = root.inert;
    const background = [...root.children]
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
      .map((node) => ({ node, inert: node.inert }));
    const overflow = document.body.style.overflow;
    root.inert = true;
    background.forEach(({ node }) => {
      node.inert = true;
    });
    document.body.style.overflow = "hidden";
    close.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
      }
      if (event.key !== "Tab") return;
      const items =
        drawer.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    function resize() {
      if (innerWidth >= 768) setDrawerOpen(false);
    }
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", resize);
    return () => {
      root.inert = previousInert;
      background.forEach(({ node, inert }) => {
        node.inert = inert;
      });
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", resize);
      menu.current?.focus();
    };
  }, [drawerOpen]);
  const toggleSidebar = () =>
    setCollapsed((value) => {
      try {
        localStorage.setItem("futurelearn-sidebar-collapsed", String(!value));
      } catch {
        /* Optional preference. */
      }
      return !value;
    });
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đi tới nội dung chính
      </a>
      <header className="app-header">
        <div className="app-header__brand-group">
          <button
            ref={menu}
            className="icon-button app-header__menu-button"
            type="button"
            aria-label={
              drawerOpen ? "Đóng danh mục học tập" : "Mở danh mục học tập"
            }
            aria-controls="mobile-drawer"
            aria-expanded={drawerOpen}
            data-menu-button
            onClick={() => setDrawerOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <a
            className="brand"
            href={dashboardLink("../index.html")}
            aria-label="FutureLearn – Trang chủ"
          >
            <img
              src={dashboardLink("../logo.png")}
              alt="FutureLearn"
              width="820"
              height="180"
            />
          </a>
        </div>
        <div className="app-header__account">
          <div
            className="reward-chip"
            aria-label={`${stars} sao minh họa`}
            data-reward-chip
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
            </svg>
            <span data-reward-count>{stars}</span>
          </div>
          <button
            className="profile-button"
            data-open-profile
            type="button"
            aria-label="Mở tài khoản học viên"
            onClick={
              onProfile ||
              (() => location.assign(dashboardLink("?panel=profile")))
            }
          >
            <span className="profile-button__avatar" aria-hidden="true">
              AN
            </span>
            <svg
              className="profile-button__chevron"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m8 10 4 4 4-4" />
            </svg>
          </button>
        </div>
      </header>
      <Sidebar
        area={area}
        collapsed={collapsed}
        toggle={toggleSidebar}
        journey={journey}
      />
      {children}
      <nav className="bottom-nav" aria-label="Điều hướng nhanh trên di động">
        <Navigation area={area} bottom />
      </nav>
      {createPortal(
        <>
          <div
            className="drawer-backdrop"
            data-drawer-backdrop
            hidden={!drawerOpen}
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            ref={drawer}
            className="mobile-drawer"
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Danh mục học tập trên di động"
            hidden={!drawerOpen}
          >
            <div className="mobile-drawer__header">
              <p>Chọn khu vực học</p>
              <button
                ref={close}
                className="icon-button"
                type="button"
                aria-label="Đóng danh mục"
                data-menu-close
                onClick={() => setDrawerOpen(false)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav
              className="subject-nav"
              aria-label="Môn học trên di động"
              onClick={() => setDrawerOpen(false)}
            >
              <Navigation area={area} />
            </nav>
          </aside>
        </>,
        document.body,
      )}
    </>
  );
}
