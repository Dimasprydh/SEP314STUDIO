// src/sections/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
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

      // jadwalkan update pas ganti detik berikutnya (anti drift)
      const msToNextSecond = 1000 - (now.getTime() % 1000);
      timer = setTimeout(tick, msToNextSecond + 1);
    };

    tick();
    return () => clearTimeout(timer);
  }, [withSeconds]);

  return (
    <span
      className="wib-ticker"
      aria-label="Waktu Indonesia Barat (Jakarta)"
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

  // simpan tinggi header ke CSS var --header-h
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        (el.offsetHeight || 0) + "px"
      );
    setVar();
    let ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(setVar);
      ro.observe(el);
    }
    window.addEventListener("resize", setVar);
    return () => {
      window.removeEventListener("resize", setVar);
      ro && ro.disconnect();
    };
  }, []);

  const onNavClick = () => setOpen(false);

  return (
    <header ref={ref} className="site-header">
      <div className="bar">
        {/* Left: Brand */}
        <div className="bar__left">
          {/* <Link to="/" className="brand">
            SEP314STUDIO
          </Link> */}
          {/* <span className="muted">/FOLIO ’25</span> */}
        </div>

        {/* Mid: WIB live (dengan detik) */}
        <div className="bar__mid">
          <WIBTicker withSeconds />
        </div>

        {/* Right: Nav + Menu */}
        <div className="bar__right">
          <nav className="nav">
            <NavLink to="/" end className="nav__link">
              OVERVIEW
            </NavLink>
            <NavLink to="/work" className="nav__link">
              WORK
            </NavLink>
            <NavLink to="/about" className="nav__link">
              INFO
            </NavLink>
          </nav>

          <button
            className={`menu-btn ${open ? "is-open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`drawer ${open ? "show" : ""}`}>
        <NavLink to="/" end className="drawer__link" onClick={onNavClick}>
          OVERVIEW
        </NavLink>
        <NavLink to="/work" className="drawer__link" onClick={onNavClick}>
          WORK
        </NavLink>
        <NavLink to="/about" className="drawer__link" onClick={onNavClick}>
          INFO
        </NavLink>
      </div>
    </header>
  );
}
