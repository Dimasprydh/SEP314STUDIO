import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./site-motion.css";

const ROUTE_META = {
  "/": { label: "OVERVIEW", index: "01 / 04" },
  "/work": { label: "WORK", index: "02 / 04" },
  "/service": { label: "SERVICE", index: "03 / 04" },
  "/about": { label: "INFO", index: "04 / 04" },
};

const REVEAL_GROUPS = [
  { selector: ".strip-wrap", kind: "clip", stagger: 0 },
  { selector: ".stamp-foot", kind: "fade-up", stagger: 0 },

  {
    selector: ".work__kicker, .work__meta, .work__cta, .work__count",
    kind: "fade-up",
    stagger: 70,
  },
  { selector: ".work__title", kind: "fade", stagger: 0 },
  { selector: ".heroMark", kind: "clip", stagger: 0 },
  { selector: ".work-card__figure", kind: "clip", stagger: 55 },

  { selector: ".about__figure", kind: "clip", stagger: 0 },
  {
    selector: ".about__name, .about__ledeBig",
    kind: "fade-up",
    stagger: 90,
  },
  { selector: ".about__contact > *", kind: "fade-up", stagger: 55 },
  { selector: ".about__section", kind: "fade-up", stagger: 90 },

  { selector: ".service-hero__inner > *", kind: "fade-up", stagger: 85 },
  { selector: ".service-overview > *", kind: "fade-up", stagger: 80 },
  { selector: ".service-row", kind: "fade-up", stagger: 70 },
  {
    selector: ".service-scope__header > *",
    kind: "fade-up",
    stagger: 80,
  },
  { selector: ".scope-item", kind: "fade-up", stagger: 35 },
  { selector: ".service-note > *", kind: "fade-up", stagger: 80 },
  {
    selector: ".service-process > .service-label",
    kind: "fade-up",
    stagger: 0,
  },
  { selector: ".process-card", kind: "fade-up", stagger: 55 },
  {
    selector: ".service-pricing__header > *",
    kind: "fade-up",
    stagger: 75,
  },
  { selector: ".pricing-card", kind: "fade-up", stagger: 85 },
  { selector: ".pricing-note", kind: "fade-up", stagger: 0 },
  { selector: ".service-cta > *", kind: "fade-up", stagger: 85 },
];

function getRouteMeta(pathname) {
  return ROUTE_META[pathname] || {
    label: pathname.split("/").filter(Boolean).pop()?.toUpperCase() || "PAGE",
    index: "SEP314STUDIO",
  };
}

function scrollToTop() {
  const lenis = window.__sepLenis;

  if (lenis?.scrollTo) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

function isPlainInternalNavigation(event, anchor) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  if (anchor.hasAttribute("download")) return false;
  if (anchor.target && anchor.target !== "_self") return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

  return true;
}

export default function SiteMotion({ pathname, disabled = false, onBusyChange }) {
  const navigate = useNavigate();
  const [phase, setPhaseState] = useState("idle");
  const [routeMeta, setRouteMeta] = useState(() => getRouteMeta(pathname));
  const phaseRef = useRef("idle");
  const pendingHrefRef = useRef(null);
  const previousPathRef = useRef(pathname);
  const revealPathRef = useRef("");
  const frameRef = useRef(0);
  const timersRef = useRef([]);

  const busy = phase !== "idle";

  const setPhase = useCallback((nextPhase) => {
    phaseRef.current = nextPhase;
    setPhaseState(nextPhase);
  }, []);

  const clearMotionTimers = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  useEffect(() => {
    if (!busy) return undefined;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [busy]);

  useEffect(() => {
    if (!disabled) return undefined;

    clearMotionTimers();
    pendingHrefRef.current = null;
    setPhase("idle");

    return undefined;
  }, [clearMotionTimers, disabled, setPhase]);

  useEffect(() => {
    if (disabled) return undefined;

    const onDocumentClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!anchor || !isPlainInternalNavigation(event, anchor)) return;

      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const current = new URL(window.location.href);
      const sameDocument =
        url.pathname === current.pathname && url.search === current.search;

      if (sameDocument) return;

      event.preventDefault();

      if (phaseRef.current !== "idle") return;

      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      pendingHrefRef.current = nextHref;
      setRouteMeta(getRouteMeta(url.pathname));
      clearMotionTimers();
      setPhase("prepare");

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          setPhase("covering");

          schedule(() => {
            setPhase("covered");
            navigate(nextHref);
          }, 370);
        });
      });
    };

    document.addEventListener("click", onDocumentClick, true);

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [clearMotionTimers, disabled, navigate, schedule, setPhase]);

  useLayoutEffect(() => {
    const pathChanged = previousPathRef.current !== pathname;
    previousPathRef.current = pathname;
    setRouteMeta(getRouteMeta(pathname));

    // Enabling motion after the first-visit loader must not start another
    // full page transition. Only an actual pathname change reaches below.
    if (!pathChanged) return undefined;

    scrollToTop();

    if (disabled) {
      pendingHrefRef.current = null;
      setPhase("idle");
      return undefined;
    }

    clearMotionTimers();

    // Click navigation is already covered. Browser back/forward reaches this
    // effect without a covering phase, so it is covered before the next paint.
    if (!pendingHrefRef.current) {
      setPhase("covered");
    }

    pendingHrefRef.current = null;

    schedule(() => setPhase("revealing"), 70);
    schedule(() => setPhase("idle"), 620);

    return clearMotionTimers;
  }, [clearMotionTimers, disabled, pathname, schedule, setPhase]);

  useLayoutEffect(() => {
    const root = document.querySelector("main[data-site-main]");
    if (!root) return undefined;

    if (disabled) {
      root.querySelectorAll("[data-motion-reveal]").forEach((element) => {
        element.classList.add("is-motion-visible");
      });
      return undefined;
    }

    const readyToBind =
      phase === "revealing" ||
      (phase === "idle" && revealPathRef.current !== pathname);

    if (!readyToBind || revealPathRef.current === pathname) {
      return undefined;
    }

    revealPathRef.current = pathname;
    const elements = [];
    const seen = new Set();

    REVEAL_GROUPS.forEach(({ selector, kind, stagger }) => {
      root.querySelectorAll(selector).forEach((element, index) => {
        if (seen.has(element)) return;
        seen.add(element);

        element.dataset.motionReveal = "true";
        element.dataset.motionKind = kind;
        element.style.setProperty(
          "--motion-delay",
          `${Math.min(index * stagger, 360)}ms`
        );
        elements.push(element);
      });
    });

    if (!elements.length) return undefined;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-motion-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-motion-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [disabled, pathname, phase]);

  useEffect(() => clearMotionTimers, [clearMotionTimers]);

  const transitionClassName = useMemo(
    () => `site-transition site-transition--${phase}`,
    [phase]
  );

  return (
    <div
      className={transitionClassName}
      aria-hidden={phase === "idle" ? "true" : "false"}
    >
      <div className="site-transition__meta">
        <span>SEP314STUDIO</span>
        <span>{routeMeta.index}</span>
      </div>

      <div className="site-transition__label-mask">
        <span className="site-transition__label">{routeMeta.label}</span>
      </div>

      <div className="site-transition__rule" aria-hidden="true" />
    </div>
  );
}
