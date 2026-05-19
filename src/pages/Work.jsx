import { useEffect, useMemo, useRef, useState } from "react";
import "./work.css";
import { asset } from "../utils/asset";

const projects = [
  {
    slug: "mediocre",
    title: "MEDIOCRE",
    years: "WEB / 2024—NOW",
    img: "assets/portofolio-website/mediocre.png",
    href: "https://mediocreq.com/",
  },
  {
    slug: "roomforair",
    title: "ROOM FOR AIR",
    years: "WEB / 2024—NOW",
    img: "assets/portofolio-website/roomforair.png",
    href: "https://www.roomforair.com/",
  },
  {
    slug: "onionworks",
    title: "ONION WORKS",
    years: "WEB / 2025—NOW",
    img: "assets/portofolio-website/onionwrks.png",
    href: "https://onionwrks.com/",
  },
  {
    slug: "sos",
    title: "SCORE OFF SCOOT",
    years: "WEB / 2024—NOW",
    img: "assets/portofolio-website/sos.png",
    href: "https://www.scoreoffscoot.com/",
  },
];

/* =========================================================
   HERO MARK — SEP314STUDIO particle text
   Same concept as the original, but lighter for Safari/mobile.
========================================================= */
function HeroMark({ text = "SEP314STUDIO" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: 100000, y: 100000 });
  const activeUntilRef = useRef(0);
  const visibleRef = useRef(true);
  const sizeRef = useRef({ width: 0, height: 0 });
  const startRef = useRef(() => {});
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const apply = () => {
      setReduced(Boolean(mq?.matches));
    };

    apply();

    if (mq?.addEventListener) {
      mq.addEventListener("change", apply);
    } else if (mq?.addListener) {
      mq.addListener(apply);
    }

    return () => {
      if (mq?.removeEventListener) {
        mq.removeEventListener("change", apply);
      } else if (mq?.removeListener) {
        mq.removeListener(apply);
      }
    };
  }, []);

  useEffect(() => {
    if (reduced) return;

    const host = hostRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });

    if (!host || !canvas || !ctx) return;

    let destroyed = false;
    let resizeTimer = 0;
    let observer = null;
    let intersectionObserver = null;
    let lastFrame = 0;
    let dpr = 1;

    const detectDevice = () => {
      const ua = navigator.userAgent || "";

      const isSafari =
        /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua);

      const isMobile =
        window.matchMedia("(max-width: 720px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;

      return { isSafari, isMobile };
    };

    const getSettings = () => {
      const { isSafari, isMobile } = detectDevice();

      return {
        dpr: Math.max(
          1,
          Math.min(
            window.devicePixelRatio || 1,
            isMobile ? 1.05 : isSafari ? 1.25 : 1.45
          )
        ),
        stepMin: isMobile ? 6 : isSafari ? 5 : 3,
        maxParticles: isMobile ? 520 : isSafari ? 900 : 1500,
        fps: isMobile ? 24 : isSafari ? 32 : 45,
        radius: isMobile ? 92 : isSafari ? 118 : 140,
      };
    };

    const fitFont = (offCtx, width, height) => {
      const { isMobile } = detectDevice();

      let fontSize = Math.min(
        width * (isMobile ? 0.155 : 0.18),
        height * 0.72,
        150
      );

      fontSize = Math.max(fontSize, isMobile ? 32 : 52);

      offCtx.font = `800 ${fontSize}px Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

      while (offCtx.measureText(text).width > width * 0.96 && fontSize > 24) {
        fontSize -= 2;
        offCtx.font = `800 ${fontSize}px Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      }
    };

    const drawStatic = () => {
      const { width, height } = sizeRef.current;

      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";

      const dotSize = Math.max(1, Math.floor(width / 520));

      for (const p of particlesRef.current) {
        ctx.fillRect(p.hx, p.hy, dotSize, dotSize);
      }
    };

    const build = () => {
      if (destroyed) return;

      const box = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(box.width));
      const height = Math.max(1, Math.round(box.height));

      if (width < 10 || height < 10) return;

      const settings = getSettings();

      dpr = settings.dpr;
      sizeRef.current = { width, height };

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;

      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.clearRect(0, 0, width, height);
      fitFont(offCtx, width, height);
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#fff";
      offCtx.fillText(text, width / 2, height / 2);

      const data = offCtx.getImageData(0, 0, width, height).data;
      const step = Math.max(settings.stepMin, Math.floor(width / 180));
      const points = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (data[(y * width + x) * 4 + 3] > 8) {
            points.push({
              x,
              y,
              hx: x,
              hy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }

      if (points.length > settings.maxParticles) {
        const skip = Math.ceil(points.length / settings.maxParticles);
        particlesRef.current = points.filter((_, index) => index % skip === 0);
      } else {
        particlesRef.current = points;
      }

      drawStatic();
    };

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const render = (now) => {
      if (destroyed) return;

      const settings = getSettings();
      const interval = 1000 / settings.fps;

      if (!visibleRef.current || document.hidden) {
        stop();
        return;
      }

      if (now - lastFrame < interval) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      lastFrame = now;

      const { width, height } = sizeRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, width, height);

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;
      const radius = settings.radius;
      const radiusSq = radius * radius;
      const dotSize = Math.max(1, Math.floor(width / 520));

      let stillMoving = false;

      for (const p of particles) {
        p.vx += (p.hx - p.x) * 0.02;
        p.vy += (p.hy - p.y) * 0.02;

        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq) {
          const force = (1 - distSq / radiusSq) * 0.55;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        if (
          Math.abs(p.x - p.hx) > 0.35 ||
          Math.abs(p.y - p.hy) > 0.35 ||
          Math.abs(p.vx) > 0.04 ||
          Math.abs(p.vy) > 0.04
        ) {
          stillMoving = true;
        }
      }

      ctx.fillStyle = "#fff";

      for (const p of particles) {
        ctx.fillRect(p.x, p.y, dotSize, dotSize);
      }

      if (now < activeUntilRef.current || stillMoving) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        pointerRef.current.x = 100000;
        pointerRef.current.y = 100000;

        for (const p of particles) {
          p.x = p.hx;
          p.y = p.hy;
          p.vx = 0;
          p.vy = 0;
        }

        drawStatic();
        rafRef.current = 0;
      }
    };

    const start = () => {
      if (!rafRef.current && visibleRef.current && !document.hidden) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    startRef.current = () => {
      activeUntilRef.current = performance.now() + 850;
      start();
    };

    const rebuild = () => {
      window.clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        build();
      }, 120);
    };

    build();

    if ("ResizeObserver" in window) {
      observer = new ResizeObserver(rebuild);
      observer.observe(host);
    }

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = Boolean(entry?.isIntersecting);

          if (!visibleRef.current) {
            stop();
          } else {
            drawStatic();
          }
        },
        { threshold: 0.08 }
      );

      intersectionObserver.observe(host);
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        drawStatic();
      }
    };

    window.addEventListener("resize", rebuild, { passive: true });
    window.addEventListener("orientationchange", rebuild, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (document.fonts?.ready) {
      document.fonts.ready.then(rebuild).catch(() => {});
    }

    return () => {
      destroyed = true;
      stop();
      window.clearTimeout(resizeTimer);

      if (observer) observer.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();

      window.removeEventListener("resize", rebuild);
      window.removeEventListener("orientationchange", rebuild);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      startRef.current = () => {};
    };
  }, [text, reduced]);

  const onPointerMove = (e) => {
    const host = hostRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();

    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;

    startRef.current();
  };

  const onPointerLeave = () => {
    pointerRef.current.x = 100000;
    pointerRef.current.y = 100000;

    startRef.current();
  };

  return (
    <div
      className={`heroMark${reduced ? " is-static" : ""}`}
      ref={hostRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label={text}
    >
      {!reduced && <canvas ref={canvasRef} aria-hidden="true" />}
      <span className="heroMark__shadow" aria-hidden="true">
        {text}
      </span>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState(null);
  const [engaged, setEngaged] = useState(false);

  const activeRef = useRef(active);
  const engagedRef = useRef(engaged);
  const itemRefs = useRef([]);

  activeRef.current = active;
  engagedRef.current = engaged;

  useEffect(() => {
    let ticking = false;

    const setActiveSafe = (value) => {
      if (activeRef.current !== value) {
        activeRef.current = value;
        setActive(value);
      }
    };

    const setEngagedSafe = (value) => {
      if (engagedRef.current !== value) {
        engagedRef.current = value;
        setEngaged(value);
      }
    };

    const update = () => {
      ticking = false;

      const items = itemRefs.current.filter(Boolean);
      if (!items.length) return;

      const vh = window.innerHeight || document.documentElement.clientHeight;
      const mid = vh / 2;
      const first = items[0].getBoundingClientRect();

      if (first.top >= vh * 0.42) {
        setEngagedSafe(false);
        setActiveSafe(null);
        return;
      }

      let bestSlug = null;
      let bestDist = Infinity;

      for (const el of items) {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);

        if (dist < bestDist) {
          bestDist = dist;
          bestSlug = el.getAttribute("data-slug");
        }
      }

      const radius = Math.max(160, vh * 0.34);
      const shouldEngage = bestDist < radius;

      setEngagedSafe(shouldEngage);
      setActiveSafe(shouldEngage ? bestSlug : null);
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("orientationchange", requestUpdate, {
      passive: true,
    });

    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
    };
  }, []);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.slug === active) || null;
  }, [active]);

  const index = active
    ? projects.findIndex((p) => p.slug === active) + 1
    : null;

  const openProject = (href) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="work">
      <div className="work__wrap">
        <aside className="work__left">
          <div className={`work__sticky ${engaged ? "" : "work__idle"}`}>
            <div className="work__kicker">SELECTED WORK</div>

            <h1
              className="work__title"
              key={engaged ? activeProject?.slug : "idle"}
            >
              {engaged ? activeProject?.title : "WORK"}
            </h1>

            <div className="work__meta">
              {engaged ? activeProject?.years : "—"}
            </div>

            <a
              className="work__cta"
              href={engaged ? activeProject?.href : "#"}
              target={engaged ? "_blank" : undefined}
              rel={engaged ? "noreferrer" : undefined}
              aria-disabled={engaged ? "false" : "true"}
              onClick={(e) => {
                if (!engaged) e.preventDefault();
              }}
            >
              Open project ↗
            </a>

            <div className="work__count">
              {engaged && index
                ? `${index}/${projects.length}`
                : `0/${projects.length}`}
            </div>
          </div>
        </aside>

        <section className="work__right" aria-label="Project gallery">
          <div className="work__spacer" aria-hidden="true" />

          <HeroMark text="SEP314STUDIO" />

          {projects.map((p, i) => (
            <article
              key={p.slug}
              className={`work-card ${active === p.slug ? "is-active" : ""}`}
              data-slug={p.slug}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              <figure
                className="work-card__figure"
                role="button"
                tabIndex={0}
                onClick={() => openProject(p.href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProject(p.href);
                  }
                }}
              >
                <img
                  className="work-card__img"
                  src={asset(p.img)}
                  alt={p.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable="false"
                  onError={(e) => {
                    const tried = e.currentTarget.dataset.tried || "png";

                    if (tried === "png") {
                      e.currentTarget.dataset.tried = "jpg";
                      e.currentTarget.src = asset(
                        p.img.replace(/\.png$/i, ".jpg")
                      );
                    }
                  }}
                />

                <figcaption className="work-card__cap">
                  <b>{p.title}</b>
                  <span> — {p.years}</span>
                </figcaption>
              </figure>
            </article>
          ))}

          <div className="work__spacer" aria-hidden="true" />
        </section>
      </div>
    </main>
  );
}
