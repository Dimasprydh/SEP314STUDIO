import { useEffect, useMemo, useRef } from "react";
import "./home.css";
import { asset } from "../utils/asset";

const projects = [
  {
    slug: "forhermoment",
    title: "FOR HER MOMENT",
    years: "WEB / 2026—NOW",
    img: "assets/portofolio-website/fhm-website.png",
    role: "Full-stack",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Live",
    href: "https://forhermoment.com/",
    subtitle: "For Her Moment | 2026 — Present",
  },
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
    role: "Full-stack",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Live",
    href: "https://www.scoreoffscoot.com/",
    subtitle: "Score Off Scoot | 2024 — Present",
  },
];

function Card({ p, hiddenCard = false }) {
  return (
    <article className="card card--reveal" data-title={p.subtitle}>
      <img
        className="card__img"
        src={asset(p.img)}
        alt={`${p.title} website preview`}
        loading={hiddenCard ? "lazy" : "eager"}
        decoding="async"
        draggable="false"
        onError={(e) => {
          const tried = e.currentTarget.dataset.tried || "png";

          if (tried === "png") {
            e.currentTarget.dataset.tried = "jpg";
            e.currentTarget.src = asset(p.img.replace(/\.png$/i, ".jpg"));
          }
        }}
      />

      <div className="cap cap--top">
        <h3>{p.title}</h3>
        <p>{p.years}</p>
      </div>

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
        tabIndex={hiddenCard ? -1 : undefined}
        aria-label={`Open ${p.title}`}
      />
    </article>
  );
}

export default function Home() {
  const trackRef = useRef(null);
  const groupRef = useRef(null);

  const marqueeProjects = useMemo(() => {
    return [...projects, ...projects];
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;

    if (!track || !group) return;

    let frame = 0;
    let resizeObserver = null;

    const measureAndSet = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const groupWidth = Math.ceil(group.getBoundingClientRect().width);

        if (!groupWidth) return;

        const isMobile = window.matchMedia("(max-width: 720px)").matches;
        const pxPerSecond = isMobile ? 24 : 30;
        const duration = Math.max(65, groupWidth / pxPerSecond);

        track.style.setProperty("--move-x", `${groupWidth}px`);
        track.style.setProperty("--duration", `${duration}s`);
        track.classList.add("is-ready");
      });
    };

    const images = Array.from(group.querySelectorAll("img"));

    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", measureAndSet, { once: true });
        img.addEventListener("error", measureAndSet, { once: true });
      }
    });

    measureAndSet();

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(measureAndSet);
      resizeObserver.observe(group);
      resizeObserver.observe(document.documentElement);
    }

    window.addEventListener("resize", measureAndSet, { passive: true });
    window.addEventListener("orientationchange", measureAndSet, {
      passive: true,
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureAndSet).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(frame);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      window.removeEventListener("resize", measureAndSet);
      window.removeEventListener("orientationchange", measureAndSet);

      images.forEach((img) => {
        img.removeEventListener("load", measureAndSet);
        img.removeEventListener("error", measureAndSet);
      });
    };
  }, []);

  return (
    <main className="home">
      <section className="stage" aria-label="Selected portfolio projects">
        <div className="strip-wrap">
          <div className="strip">
            <div className="track" ref={trackRef}>
              <div className="marquee-group" ref={groupRef}>
                {marqueeProjects.map((p, index) => (
                  <Card key={`base-${index}-${p.slug}`} p={p} />
                ))}
              </div>

              <div className="marquee-group" aria-hidden="true">
                {marqueeProjects.map((p, index) => (
                  <Card
                    key={`clone-${index}-${p.slug}`}
                    p={p}
                    hiddenCard={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="stamp-foot" aria-hidden="true">
          <span className="stamp-foot__word" data-word="SEP314STUDIO">
            SEP314STUDIO
          </span>
        </div>
      </section>
    </main>
  );
}
