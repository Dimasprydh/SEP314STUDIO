// src/sections/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

/* ===== WIB Ticker dengan detik & sinkron ke boundary detik ===== */
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const onNavClick = () => setOpen(false);

  return (
    <header ref={ref} className="site-header">
      <div className="bar">
        {/* Left */}
        <div className="bar__left">
          {/* Optional brand area */}
        </div>

        {/* Mid */}
        <div className="bar__mid">
          <WIBTicker withSeconds />
        </div>

        {/* Right */}
        <div className="bar__right">
          <nav className="nav" aria-label="Primary navigation">
            <NavLink to="/" end className="nav__link">
              OVERVIEW
            </NavLink>

            <NavLink to="/work" className="nav__link">
              WORK
            </NavLink>

            <NavLink to="/service" className="nav__link">
              SERVICE
            </NavLink>

            <NavLink to="/about" className="nav__link">
              INFO
            </NavLink>
          </nav>

          <button
            type="button"
            className={`menu-btn ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-drawer" className={`drawer ${open ? "show" : ""}`}>
        <NavLink to="/" end className="drawer__link" onClick={onNavClick}>
          OVERVIEW
        </NavLink>

        <NavLink to="/work" className="drawer__link" onClick={onNavClick}>
          WORK
        </NavLink>

        <NavLink to="/service" className="drawer__link" onClick={onNavClick}>
          SERVICE
        </NavLink>

        <NavLink to="/about" className="drawer__link" onClick={onNavClick}>
          INFO
        </NavLink>
      </div>
    </header>
  );
}
