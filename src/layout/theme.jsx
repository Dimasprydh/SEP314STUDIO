import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoaderOverlay from "../components/LoaderOverlay.jsx";
import SmoothScroll from "../components/SmoothScroll.jsx";
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
  const firstRoute = useRef(true);
  const revealFrame = useRef(0);
  const [showLoader, setShowLoader] = useState(shouldShowInitialLoader);
  const [routeVisible, setRouteVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Respect prefers-reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return undefined;

    const apply = () => setReduceMotion(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);

    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Internal navigation now uses a short page reveal instead of replaying
  // the full-screen loader on every route change.
  useLayoutEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return undefined;
    }

    setRouteVisible(false);
    cancelAnimationFrame(revealFrame.current);

    const lenis = window.__sepLenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    revealFrame.current = requestAnimationFrame(() => {
      revealFrame.current = requestAnimationFrame(() => {
        setRouteVisible(true);
      });
    });

    return () => cancelAnimationFrame(revealFrame.current);
  }, [location.pathname]);

  const handleDone = useCallback(() => {
    setShowLoader(false);
  }, []);

  const introHidden = showLoader;
  const changingRoute = !routeVisible;
  const interactionLocked = introHidden || changingRoute;

  const mainStyle = reduceMotion
    ? {
        visibility: introHidden ? "hidden" : "visible",
        opacity: interactionLocked ? 0 : 1,
        transition: "opacity 140ms linear",
        pointerEvents: interactionLocked ? "none" : "auto",
      }
    : {
        visibility: introHidden ? "hidden" : "visible",
        opacity: interactionLocked ? 0 : 1,
        transform: introHidden
          ? "translateY(6px) scale(0.995)"
          : changingRoute
            ? "translateY(14px) scale(0.998)"
            : "translateY(0) scale(1)",
        filter: introHidden
          ? "blur(10px)"
          : changingRoute
            ? "blur(4px)"
            : "blur(0)",
        transition:
          "opacity 420ms cubic-bezier(0.22,1,0.36,1), " +
          "transform 520ms cubic-bezier(0.22,1,0.36,1), " +
          "filter 520ms cubic-bezier(0.22,1,0.36,1)",
        willChange: "opacity, transform, filter",
        pointerEvents: interactionLocked ? "none" : "auto",
      };

  return (
    <>
      <Seo />
      <SmoothScroll disabled={showLoader} />
      <LoaderOverlay show={showLoader} onDone={handleDone} />

      <header>
        <Header />
      </header>

      <main
        aria-busy={interactionLocked ? "true" : "false"}
        style={mainStyle}
      >
        <Outlet />
      </main>
    </>
  );
}
