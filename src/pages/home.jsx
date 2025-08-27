// src/pages/index.jsx
import React, { useEffect, useRef } from "react";
import "./home.css"; // CSS khusus halaman ini
import { asset } from "../utils/asset";

// Data proyek (tanpa "lead")
const projects = [
  {
    slug: "mediocre",
    title: "MEDIOCRE",
    years: "WEB / 2024—NOW",
    img: "assets/portofolio-website/mediocre.png",
    role: "Full-stack",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Inactive",
    href: "https://mediocreq.com/",
    subtitle: "Mediocre | 2023 — Present",
  },
  {
    slug: "roomforair",
    title: "ROOM FOR AIR",
    years: "WEB / 2024—NOW",
    img: "assets/portofolio-website/roomforair.png",
    role: "Full-stack",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Live",
    href: "https://www.roomforair.com/",
    subtitle: "Room For Air | 2024 — Present",
  },
  {
    slug: "onionworks",
    title: "ONION WORKS",
    years: "WEB / 2025—NOW",
    img: "assets/portofolio-website/onionwrks.png",
    role: "Full-stack",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Live",
    href: "https://onionwrks.com/",
    subtitle: "Onion Works | 2025 — Present",
  },
  {
    slug: "sos",
    title: "SCORE OFF SCOOT",
    years: "WEB / 2024—NOW",
    img: "assets/portofolio-website/sos.png",
    role: "Full-stackd",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Live",
    href: "https://www.scoreoffscoot.com/",
    subtitle: "Score Off Scoot | 2024 — Present",
  },
];

// Komponen kartu (tanpa lead)
function Card({ p }) {
  return (
    <article className="card card--reveal" data-title={p.subtitle}>
      <img className="card__img" src={p.img} alt={p.title} />
      {/* Top spec */}
      <div className="cap cap--top">
        <h3>{p.title}</h3>
        <p>{p.years}</p>
      </div>
      {/* Bottom spec (lead dihapus) */}
      <div className="cap cap--bottom">
        <div className="meta">
          <div>
            <span>ROLE</span>
            <b>{p.role}</b>
          </div>
          <div>
            <span>STACK</span>
            <b>{p.stack}</b>
          </div>
          <div>
            <span>STATUS</span>
            <b>{p.status}</b>
          </div>
        </div>
      </div>
      <a
        className="card__link"
        href={p.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${p.title}`}
      />
    </article>
  );
}

export default function Home() {
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const baseSetRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const baseSet = baseSetRef.current;
    if (!track || !baseSet) return;

    let setW = 0,
      x = 0,
      rafId = 0,
      last = 0;
    const SPEED = 48;

    const whenImagesReady = () =>
      Promise.all(
        [...track.querySelectorAll("img")].map((img) =>
          (img.decode ? img.decode() : Promise.resolve()).catch(() => {})
        )
      );

    const measure = () => {
      const rect = baseSet.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      setW = rect.width + gap;
    };

    const loop = (now) => {
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;

      if (!pausedRef.current && setW) {
        x -= SPEED * dt;
        if (x <= -setW) x += setW;
        track.style.transform = `translate3d(${x}px,0,0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    const onResize = () => {
      const offsetInSet = setW ? ((x % setW) + setW) % setW : 0;
      measure();
      x = -offsetInSet;
    };

    window.addEventListener("resize", onResize);
    whenImagesReady().then(() => {
      measure();
      rafId = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="home">
      <section className="stage">
        <div className="strip-wrap">
          <div
            className="strip"
            ref={stripRef}
            onPointerEnter={() => (pausedRef.current = true)}
            onPointerLeave={() => (pausedRef.current = false)}
          >
            <div className="track" ref={trackRef}>
              {/* SET #1 */}
              <div className="set" ref={baseSetRef} id="base-set">
                {projects.map((p) => (
                  <Card key={`a-${p.slug}`} p={p} />
                ))}
              </div>

              {/* SET #2 (duplicate) */}
              <div className="set" aria-hidden="true">
                {projects.map((p) => (
                  <Card key={`b-${p.slug}`} p={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer-stamp tipografi gede, tidak menambah tinggi halaman */}
        <div className="stamp-foot" aria-hidden="true">
          <span className="stamp-foot__word" data-word="SEP314STUDIO">
            SEP314STUDIO
          </span>
        </div>
      </section>
    </div>
  );
}
