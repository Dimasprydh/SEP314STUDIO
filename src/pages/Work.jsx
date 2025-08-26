import React, { useEffect, useMemo, useRef, useState } from "react";
import "./work.css";

const projects = [
  {
    slug: "mediocre",
    title: "MEDIOCRE",
    years: "WEB / 2023—NOW",
    img: "/assets/portofolio-website/mediocre.png",
    href: "https://mediocreq.com/",
  },
  {
    slug: "roomforair",
    title: "ROOM FOR AIR",
    years: "WEB / 2024—NOW",
    img: "../assets/portofolio-website/roomforair.png",
    href: "https://www.roomforair.com/",
  },
  {
    slug: "onionworks",
    title: "ONION WORKS",
    years: "WEB / 2025—NOW",
    img: "../assets/portofolio-website/onionwrks.png",
    href: "https://onionwrks.com/",
  },
  {
    slug: "sos",
    title: "SCORE OFF SCOOT",
    years: "WEB / 2024—NOW",
    img: "/public/assets/portofolio-website/sos.png",
    href: "https://www.scoreoffscoot.com/",
  },
];

/* =========================================================
   HERO MARK — SEP314STUDIO particle text
   - 2D canvas (webgl-like), no deps
   - Partikel repel dari pointer, lalu snap balik
   - Respect prefers-reduced-motion
========================================================= */
function HeroMark({ text = "SEP314STUDIO" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: 1e6, y: 1e6 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return; // static fallback handled by CSS layer below

    const el = hostRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const buildParticles = () => {
      const box = el.getBoundingClientRect();
      c.width = Math.floor(box.width * dpr);
      c.height = Math.floor(box.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = c.width / dpr;
      const h = c.height / dpr;

      // render text ke offscreen
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      octx.clearRect(0, 0, w, h);
      const fs = Math.min(w * 0.18, 150); // ukuran font relatif
      octx.font = `800 ${fs}px Space Grotesk, system-ui, -apple-system, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#fff";
      octx.fillText(text, w / 2, h / 2);

      // sampling pixel → partikel
      const data = octx.getImageData(0, 0, w, h).data;
      const step = Math.max(3, Math.floor(w / 180)); // density
      const pts = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const a = data[(y * w + x) * 4 + 3];
          if (a > 8) pts.push({ x, y, vx: 0, vy: 0, hx: x, hy: y });
        }
      }
      particlesRef.current = pts;
    };

    const render = () => {
      const w = c.width / dpr;
      const h = c.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const pts = particlesRef.current;
      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // spring balik ke home
        p.vx += (p.hx - p.x) * 0.02;
        p.vy += (p.hy - p.y) * 0.02;

        // repel dari pointer
        const dx = p.x - mx;
        const dy = p.y - my;
        const r = 140;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < r * r) {
          const force = (1 - dist2 / (r * r)) * 0.6;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // integrasi + damping
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;
      }

      // gambar partikel
      ctx.fillStyle = "#fff";
      const sz = Math.max(1, Math.floor(w / 500));
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        ctx.fillRect(p.x, p.y, sz, sz);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    const resize = () => {
      buildParticles();
    };

    buildParticles();
    rafRef.current = requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [text, reduced]);

  const onMove = (e) => {
    const r = hostRef.current.getBoundingClientRect();
    pointerRef.current.x = e.clientX - r.left;
    pointerRef.current.y = e.clientY - r.top;
  };
  const onLeave = () => {
    pointerRef.current.x = 1e6;
    pointerRef.current.y = 1e6;
  };

  return (
    <div
      className={`heroMark${reduced ? " is-static" : ""}`}
      ref={hostRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={text}
    >
      {/* canvas = partikel */}
      {!reduced && <canvas ref={canvasRef} />}
      {/* outline text (shadow layer) — selalu ada agar tetap “brutalist” */}
      <span className="heroMark__shadow" aria-hidden>
        {text}
      </span>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState(null); // null = belum engage → "WORK"
  const [engaged, setEngaged] = useState(false);
  const activeRef = useRef(active);
  const itemRefs = useRef([]);
  activeRef.current = active;

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;

      const items = itemRefs.current.filter(Boolean);
      if (!items.length) return;

      const vh = window.innerHeight;
      const mid = vh / 2;

      // START GUARD: jangan engage kalau kartu pertama belum cukup dekat
      const firstRect = items[0].getBoundingClientRect();
      const startGuardPassed = firstRect.top < vh * 0.35;
      if (!startGuardPassed) {
        if (engaged) setEngaged(false);
        if (activeRef.current !== null) setActive(null);
        return;
      }

      const engageRadius = Math.max(180, vh * 0.33);
      let bestSlug = null;
      let bestDist = Infinity;

      for (const el of items) {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          bestSlug = el.getAttribute("data-slug");
        }
      }

      const nowEngaged = bestDist < engageRadius;
      setEngaged(nowEngaged);
      if (nowEngaged && bestSlug && bestSlug !== activeRef.current) {
        setActive(bestSlug);
      } else if (!nowEngaged && activeRef.current !== null) {
        setActive(null);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [engaged]);

  const activeProject = useMemo(
    () => projects.find((p) => p.slug === active) || null,
    [active]
  );
  const index = active
    ? projects.findIndex((p) => p.slug === active) + 1
    : null;

  return (
    <div className="work">
      <div className="work__wrap">
        {/* LEFT: sticky panel */}
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
              href={engaged ? activeProject?.href : undefined}
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

        {/* RIGHT: vertical gallery */}
        <section className="work__right">
          {/* Spacer atas (agar awalnya tetap "WORK") */}
          <div className="work__spacer" aria-hidden="true" />

          {/* HERO MARK tepat di atas project pertama */}
          <HeroMark text="SEP314STUDIO" />

          {projects.map((p, i) => (
            <article
              key={p.slug}
              className={`work-card ${active === p.slug ? "is-active" : ""}`}
              data-slug={p.slug}
              ref={(el) => (itemRefs.current[i] = el)}
            >
              <figure
                className="work-card__figure"
                onClick={() => window.open(p.href, "_blank")}
              >
                <img
                  className="work-card__img"
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                />
                <figcaption className="work-card__cap">
                  <b>{p.title}</b> <span>— {p.years}</span>
                </figcaption>
              </figure>
            </article>
          ))}

          <div className="work__spacer" aria-hidden="true" />
        </section>
      </div>
    </div>
  );
}
