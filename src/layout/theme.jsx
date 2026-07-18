import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoaderOverlay from "../components/LoaderOverlay.jsx";
import SmoothScroll from "../components/SmoothScroll.jsx";
import SiteMotion from "../components/SiteMotion.jsx";
import Header from "../sections/Header.jsx";
import Seo from "../components/Seo.jsx";

const LOADER_SESSION_KEY = "sep314studio:loader-seen";

function shouldShowInitialLoader() {
  if (typeof window === "undefined") return true;

  try {
    if (window.sessionStorage.getItem(LOADER_SESSION_KEY) === "1") {
      return false;
    }

    window.sessionStorage.setItem(LOADER_SESSION_KEY, "1");
    return true;
  } catch {
    // Keep the intro available when storage is blocked by the browser.
    return true;
  }
}

export default function Theme() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(shouldShowInitialLoader);
  const [transitionBusy, setTransitionBusy] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return undefined;

    const apply = () => setReduceMotion(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);

    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const handleDone = useCallback(() => {
    // LoaderOverlay calls this from the panel's real transitionend event.
    // Releasing this state is the single start signal for Overview motion.
    setShowLoader(false);
  }, []);

  const interactionLocked = showLoader || transitionBusy;

  // Keep the page fully rendered and settled behind the black intro panel.
  // Only the panel moves during exit, avoiding concurrent blur/scale work.
  const mainStyle = {
    visibility: "visible",
    opacity: 1,
    transform: "none",
    filter: "none",
    willChange: "auto",
    pointerEvents: interactionLocked ? "none" : "auto",
  };

  return (
    <>
      <Seo />
      <SmoothScroll disabled={interactionLocked || reduceMotion} />
      <SiteMotion
        pathname={location.pathname}
        disabled={showLoader || reduceMotion}
        onBusyChange={setTransitionBusy}
      />
      <LoaderOverlay show={showLoader} onDone={handleDone} />

      <header>
        <Header />
      </header>

      <main
        data-site-main
        aria-busy={interactionLocked ? "true" : "false"}
        style={mainStyle}
      >
        <Outlet context={{ initialLoaderActive: showLoader }} />
      </main>
    </>
  );
}
