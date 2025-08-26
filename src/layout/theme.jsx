import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoaderOverlay from "../components/LoaderOverlay.jsx";
import Header from "../sections/Header.jsx";

export default function Theme() {
  const location = useLocation();
  const first = useRef(true);
  const [showLoader, setShowLoader] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq) {
      const apply = () => setReduceMotion(!!mq.matches);
      apply();
      mq.addEventListener?.("change", apply);
      return () => mq.removeEventListener?.("change", apply);
    }
  }, []);

  // Munculkan loader setiap ganti route (sebelum paint)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setShowLoader(true);
  }, [location.pathname]);

  // Saat loader selesai → langsung reveal main
  const handleDone = () => {
    setShowLoader(false);
  };

  // Saat loader aktif: sembunyikan main sepenuhnya (no peek).
  // Saat loader selesai: main fade-in cepat + unblur halus.
  const hidden = showLoader;

  const mainStyle = reduceMotion
    ? {
        visibility: hidden ? "hidden" : "visible",
        opacity: hidden ? 0 : 1,
        transition: "opacity 140ms linear",
        pointerEvents: hidden ? "none" : "auto",
      }
    : {
        visibility: hidden ? "hidden" : "visible",
        opacity: hidden ? 0 : 1,
        transform: hidden
          ? "translateY(6px) scale(0.995)"
          : "translateY(0) scale(1)",
        filter: hidden ? "blur(10px)" : "blur(0)",
        transition:
          "opacity 160ms cubic-bezier(0.2,0.8,0.2,1), " +
          "transform 200ms cubic-bezier(0.22,0.61,0.36,1), " +
          "filter 420ms cubic-bezier(0.22,0.61,0.36,1)",
        willChange: "opacity, transform, filter",
        pointerEvents: hidden ? "none" : "auto",
      };

  return (
    <>
      <LoaderOverlay show={showLoader} onDone={handleDone} />

      <header>
        <Header />
      </header>

      <main aria-busy={hidden ? "true" : "false"} style={mainStyle}>
        <Outlet />
      </main>
    </>
  );
}
