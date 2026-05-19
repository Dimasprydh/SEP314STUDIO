import React, { useEffect, useMemo, useRef, useState } from "react";
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

function HeroMark({ text = "SEP314STUDIO" }) {
  return (
    <div className="heroMark" aria-label={text}>
      <div className="heroMark__eyebrow">PORTFOLIO / SELECTED WORK</div>
      <div className="heroMark__word" data-text={text}>
        {text}
      </div>
      <div className="heroMark__sub">WEB DESIGN · SHOPIFY · FRONTEND</div>
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

      const engageRadius = Math.max(160, vh * 0.34);
      const shouldEngage = bestDist < engageRadius;

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
    window.addEventListener("orientationchange", requestUpdate, { passive: true });

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

            <h1 className="work__title" key={engaged ? activeProject?.slug : "idle"}>
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
              {engaged && index ? `${index}/${projects.length}` : `0/${projects.length}`}
            </div>
          </div>
        </aside>

        <section className="work__right" aria-label="Project gallery">
          <div className="work__spacer work__spacer--top" aria-hidden="true" />

          <HeroMark text="SEP314STUDIO" />

          <div className="work__gallery">
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
                  onClick={() => openProject(p.href)}
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
          </div>

          <div className="work__spacer work__spacer--bottom" aria-hidden="true" />
        </section>
      </div>
    </main>
  );
}
