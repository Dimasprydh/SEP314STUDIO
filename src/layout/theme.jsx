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
  const [loaderRevealing, setLoaderRevealing] = useState(false);
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

  const handleReveal = useCallback(() => {
    setLoaderRevealing(true);
  }, []);

  const handleDone = useCallback(() => {
    setLoaderRevealing(true);
    setShowLoader(false);
  }, []);

  const interactionLocked = showLoader || transitionBusy;
  const contentRevealed = !showLoader || loaderRevealing;

  const mainStyle = reduceMotion
    ? {
        visibility: "visible",
        opacity: contentRevealed ? 1 : 0,
        transition: "opacity 140ms linear",
        pointerEvents: interactionLocked ? "none" : "auto",
      }
    : {
        visibility: "visible",
        opacity: contentRevealed ? 1 : 0.72,
        transform: contentRevealed
          ? "translateY(0) scale(1)"
          : "translateY(12px) scale(0.985)",
        filter: contentRevealed ? "blur(0)" : "blur(5px)",
        transition:
          "opacity 520ms cubic-bezier(0.22,1,0.36,1), " +
          "transform 680ms cubic-bezier(0.22,1,0.36,1), " +
          "filter 620ms cubic-bezier(0.22,1,0.36,1)",
        willChange: showLoader ? "opacity, transform, filter" : "auto",
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
      <LoaderOverlay
        show={showLoader}
        onReveal={handleReveal}
        onDone={handleDone}
      />

      <header>
        <Header />
      </header>

      <main
        data-site-main
        aria-busy={interactionLocked ? "true" : "false"}
        style={mainStyle}
      >
        <Outlet />
      </main>
    </>
  );
}
