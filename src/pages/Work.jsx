import React, { useEffect, useMemo, useRef, useState } from "react";
import "./work.css";
import { asset } from "src/utils/asset";

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
   HERO MARK — SEP314STUDIO particle text (dipendekkan)
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
    if (reduced) return;

    const el = hostRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const build = () => {
      const box = el.getBoundingClientRect();
      c.width = Math.floor(box.width * dpr);
      c.height = Math.floor(box.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const w = c.width / dpr, h = c.height / dpr;
      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const o = off.getContext("2d");
      o.clearRect(0, 0, w, h);
      const fs = Math.min(w * 0.18, 150);
      o.font = `800 ${fs}px Space Grotesk, system-ui, -apple-system, sans-serif`;
      o.textAlign = "center"; o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText(text, w / 2, h / 2);

      const data = o.getImageData(0, 0, w, h).data;
      const step = Math.max(3, Math.floor(w / 180));
      const pts = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 8) pts.push({ x, y, vx: 0, vy: 0, hx: x, hy: y });
        }
      }
      particlesRef.current = pts;
    };

    const render = () => {
      const w = c.width / dpr, h = c.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const pts = particlesRef.current, mx = pointerRef.current.x, my = pointerRef.current.y;

      for (const p of pts) {
        p.vx += (p.hx - p.x) * 0.02;
        p.vy += (p.hy - p.y) * 0.02;
        const dx = p.x - mx, dy = p.y - my, r = 140, d2 = dx*dx + dy*dy;
        if (d2 < r*r) {
          const f = (1 - d2 / (r*r)) * 0.6;
          p.vx += dx * f; p.vy += dy * f;
        }
        p.vx *= 0.88; p.vy *= 0.88; p.x += p.vx; p.y += p.vy;
      }

      ctx.fillStyle = "#fff";
      const sz = Math.max(1, Math.floor(w / 500));
      for (const p of pts) ctx.fillRect(p.x, p.y, sz, sz);

      rafRef.current = requestAnimationFrame(render);
    };

    build();
    rafRef.current = requestAnimationFrame(render);
    const onR = () => build();
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onR); };
  }, [text, reduced]);

  const onMove = (e) => {
    const r = hostRef.current.getBoundingClientRect();
    pointerRef.current.x = e.clientX - r.left; pointerRef.current.y = e.clientY - r.top;
  };
  const onLeave = () => { pointerRef.current.x = 1e6; pointerRef.current.y = 1e6; };

  return (
    <div className={`heroMark${reduced ? " is-static" : ""}`} ref={hostRef} onMouseMove={onMove} onMouseLeave={onLeave} aria-label={text}>
      {!reduced && <canvas ref={canvasRef} />}
      <span className="heroMark__shadow" aria-hidden>{text}</span>
    </div>
  );
}

export default function Work() {
  const [active, setActive] = useState(null);
  const [engaged, setEngaged] = useState(false);
  const activeRef = useRef(active);
  const itemRefs = useRef([]);
  activeRef.current = active;

  // DEBUG: cek URL yang dipakai sebenarnya
  useEffect(() => {
    projects.forEach(p => {
      const url = asset(p.img);
      const img = new Image();
      img.onload  = () => console.log("OK  :", p.slug, url);
      img.onerror = () => console.warn("MISS:", p.slug, url);
      img.src = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
    });
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const items = itemRefs.current.filter(Boolean);
      if (!items.length) return;

      const vh = window.innerHeight, mid = vh / 2;
      const first = items[0].getBoundingClientRect();
      if (first.top >= vh * 0.35) { if (engaged) setEngaged(false); if (activeRef.current !== null) setActive(null); return; }

      const engageRadius = Math.max(180, vh * 0.33);
      let bestSlug = null, bestDist = Infinity;
      for (const el of items) {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) { bestDist = d; bestSlug = el.getAttribute("data-slug"); }
      }

      const now = bestDist < engageRadius;
      setEngaged(now);
      if (now && bestSlug && bestSlug !== activeRef.current) setActive(bestSlug);
      else if (!now && activeRef.current !== null) setActive(null);
    };

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [engaged]);

  const activeProject = useMemo(() => projects.find(p => p.slug === active) || null, [active]);
  const index = active ? projects.findIndex(p => p.slug === active) + 1 : null;

  return (
    <div className="work">
      <div className="work__wrap">
        {/* LEFT: sticky panel */}
        <aside className="work__left">
          <div className={`work__sticky ${engaged ? "" : "work__idle"}`}>
            <div className="work__kicker">SELECTED WORK</div>
            <h1 className="work__title" key={engaged ? activeProject?.slug : "idle"}>
              {engaged ? activeProject?.title : "WORK"}
            </h1>
            <div className="work__meta">{engaged ? activeProject?.years : "—"}</div>
            <a
              className="work__cta"
              href={engaged ? activeProject?.href : undefined}
              target={engaged ? "_blank" : undefined}
              rel={engaged ? "noreferrer" : undefined}
              aria-disabled={engaged ? "false" : "true"}
              onClick={(e) => { if (!engaged) e.preventDefault(); }}
            >
              Open project ↗
            </a>
            <div className="work__count">{engaged && index ? `${index}/${projects.length}` : `0/${projects.length}`}</div>
          </div>
        </aside>

        {/* RIGHT: vertical gallery */}
        <section className="work__right">
          <div className="work__spacer" aria-hidden="true" />
          <HeroMark text="SEP314STUDIO" />

          {projects.map((p, i) => (
            <article key={p.slug} className={`work-card ${active === p.slug ? "is-active" : ""}`} data-slug={p.slug} ref={(el) => (itemRefs.current[i] = el)}>
              <figure className="work-card__figure" onClick={() => window.open(p.href, "_blank")}>
                <img
                  className="work-card__img"
                  src={asset(p.img)}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => {
                    // fallback & log kalau masih tidak ketemu
                    const tried = e.currentTarget.dataset.tried || "png";
                    console.warn("MISS <img>:", p.slug, asset(p.img));
                    if (tried === "png") {
                      e.currentTarget.src = asset(p.img.replace(/\.png$/i, ".jpg"));
                      e.currentTarget.dataset.tried = "jpg";
                    }
                  }}
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
