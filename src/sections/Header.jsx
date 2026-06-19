// src/sections/Header.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

/* ===== WIB Ticker ===== */
function WIBTicker({ withSeconds = true }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" } : {}),
      hour12: false,
    });

    let timer;

    const tick = () => {
      const now = new Date();
      const parts = fmt.formatToParts(now);
      const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
      const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
      const ss = withSeconds
        ? parts.find((p) => p.type === "second")?.value ?? "00"
        : null;
      const time = withSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
      setText(`[${time} · Jakarta, IDN]`);
      const msToNextSecond = 1000 - (now.getTime() % 1000);
      timer = setTimeout(tick, msToNextSecond + 1);
    };

    tick();
    return () => clearTimeout(timer);
  }, [withSeconds]);

  return (
    <span
      className="wib-ticker"
      aria-label="Waktu Indonesia Barat Jakarta"
      title="Waktu Indonesia Barat"
    >
      {text}
    </span>
  );
}

/* ===================== Header ===================== */
export default function Header() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Set --header-h CSS variable */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.offsetHeight || 0}px`
      );
    };
    setVar();
    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(setVar);
      ro.observe(el);
    }
    window.addEventListener("resize", setVar);
    return () => {
      window.removeEventListener("resize", setVar);
      if (ro) ro.disconnect();
    };
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll saat drawer terbuka */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Escape key */
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggleDrawer = useCallback(() => setOpen((v) => !v), []);
  const onNavClick = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Overlay — di luar header agar z-index tidak terkurung stacking context */}
      <div
        className={`drawer-overlay${open ? " show" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <header ref={ref} className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="bar">
          <div className="bar__left" />

          <div className="bar__mid">
            <WIBTicker withSeconds />
          </div>

          <div className="bar__right">
            <nav className="nav" aria-label="Primary navigation">
              <NavLink to="/" end className="nav__link">OVERVIEW</NavLink>
              <NavLink to="/work" className="nav__link">WORK</NavLink>
              <NavLink to="/service" className="nav__link">SERVICE</NavLink>
              <NavLink to="/about" className="nav__link">INFO</NavLink>
            </nav>

            <button
              type="button"
              className={`menu-btn${open ? " is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={toggleDrawer}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Drawer tetap di dalam header agar top: var(--header-h) akurat */}
        <div
          id="mobile-drawer"
          className={`drawer${open ? " show" : ""}`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <NavLink to="/" end className="drawer__link" onClick={onNavClick}>OVERVIEW</NavLink>
          <NavLink to="/work" className="drawer__link" onClick={onNavClick}>WORK</NavLink>
          <NavLink to="/service" className="drawer__link" onClick={onNavClick}>SERVICE</NavLink>
          <NavLink to="/about" className="drawer__link" onClick={onNavClick}>INFO</NavLink>
        </div>
      </header>
    </>
  );
}
