import { useEffect, useRef } from "react";

const LENIS_VERSION = "1.3.25";
const LENIS_SCRIPT_ID = "sep314-lenis-script";
const LENIS_STYLE_ID = "sep314-lenis-style";

function ensureLenisStyles() {
  if (document.getElementById(LENIS_STYLE_ID)) return;

  const link = document.createElement("link");
  link.id = LENIS_STYLE_ID;
  link.rel = "stylesheet";
  link.href = `https://cdn.jsdelivr.net/npm/lenis@${LENIS_VERSION}/dist/lenis.css`;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

function loadLenis() {
  if (window.Lenis) return Promise.resolve(window.Lenis);

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(LENIS_SCRIPT_ID);

    const onLoad = () => {
      if (window.Lenis) resolve(window.Lenis);
      else reject(new Error("Lenis loaded without exposing window.Lenis"));
    };

    const onError = () => reject(new Error("Unable to load Lenis"));

    if (existing) {
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = LENIS_SCRIPT_ID;
    script.src = `https://cdn.jsdelivr.net/npm/lenis@${LENIS_VERSION}/dist/lenis.min.js`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    document.head.appendChild(script);
  });
}

export default function SmoothScroll({ disabled = false }) {
  const lenisRef = useRef(null);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    disabledRef.current = disabled;

    const lenis = lenisRef.current;
    if (!lenis) return;

    if (disabled) lenis.stop();
    else lenis.start();
  }, [disabled]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let loading = false;

    const destroy = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;

      lenis.destroy();
      lenisRef.current = null;

      if (window.__sepLenis === lenis) {
        delete window.__sepLenis;
      }
    };

    const initialise = async () => {
      if (loading || lenisRef.current || mediaQuery?.matches) return;

      loading = true;
      ensureLenisStyles();

      try {
        const Lenis = await loadLenis();
        if (cancelled || mediaQuery?.matches) return;

        const lenis = new Lenis({
          autoRaf: true,
          autoResize: true,
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.9,
          touchMultiplier: 1,
          anchors: true,
          stopInertiaOnNavigate: true,
        });

        lenisRef.current = lenis;
        window.__sepLenis = lenis;

        if (disabledRef.current) lenis.stop();
        else lenis.start();
      } catch {
        // Progressive enhancement: native browser scrolling remains available.
      } finally {
        loading = false;
      }
    };

    const onMotionPreferenceChange = () => {
      if (mediaQuery?.matches) destroy();
      else initialise();
    };

    initialise();
    mediaQuery?.addEventListener?.("change", onMotionPreferenceChange);

    return () => {
      cancelled = true;
      mediaQuery?.removeEventListener?.("change", onMotionPreferenceChange);
      destroy();
    };
  }, []);

  return null;
}
