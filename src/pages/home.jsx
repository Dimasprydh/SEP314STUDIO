import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
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

async function markImageReady(image, isError = false) {
  if (!image || image.dataset.ready === "true") return;

  if (!isError && typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {
      // Some browsers reject decode() even though the image can still render.
    }
  }

  image.dataset.ready = "true";
  image.closest(".card")?.classList.add("is-image-loaded");
  image.dispatchEvent(new CustomEvent("sep:image-ready"));
}

const cardStatusStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  zIndex: 5,
  transform: "translate(-50%, -50%)",
  padding: "6px 8px",
  border: "1px solid rgba(255,255,255,0.78)",
  background: "#000",
  color: "#fff",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
  fontSize: "9px",
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "0.08em",
  whiteSpace: "nowrap",
  pointerEvents: "none",
};

function Card({ p, hiddenCard = false, priority = false }) {
  const [mediaState, setMediaState] = useState("loading");

  const finishImage = async (image, isError = false) => {
    await markImageReady(image, isError);
    setMediaState(isError ? "error" : "ready");
  };

  return (
    <article
      className="card card--reveal"
      data-title={p.subtitle}
      aria-busy={mediaState === "loading"}
    >
      <img
        className="card__img"
        src={asset(p.img)}
        alt={`${p.title} website preview`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable="false"
        onLoad={(event) => {
          void finishImage(event.currentTarget);
        }}
        onError={(event) => {
          const image = event.currentTarget;
          const tried = image.dataset.tried || "png";

          if (tried === "png") {
            image.dataset.tried = "jpg";
            image.src = asset(p.img.replace(/\.png$/i, ".jpg"));
            return;
          }

          void finishImage(image, true);
        }}
      />

      {mediaState !== "ready" && (
        <div style={cardStatusStyle} aria-hidden="true">
          {mediaState === "error" ? "VISUAL UNAVAILABLE" : "LOADING VISUAL"}
        </div>
      )}

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
  const outletContext = useOutletContext();
  const initialLoaderActive = Boolean(outletContext?.initialLoaderActive);
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    const group = groupRef.current;

    if (!strip || !track || !group) return undefined;

    let disposed = false;
    let ready = false;
    let frame = 0;
    let revealFrame = 0;
    let resizeObserver = null;
    let safetyTimer = 0;

    // A first-visit intro may already have preloaded the assets, but its panel
    // must fully leave before any Overview reveal or marquee movement begins.
    if (initialLoaderActive) {
      strip.classList.remove("is-media-ready");
      track.classList.remove("is-ready");
    }

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
      });
    };

    const revealTrack = () => {
      if (disposed || ready || initialLoaderActive) return;
      ready = true;
      measureAndSet();

      // Keep two painted frames after the loader is gone before starting the
      // original visual reveal, so the first frame is never skipped.
      revealFrame = requestAnimationFrame(() => {
        revealFrame = requestAnimationFrame(() => {
          if (disposed) return;
          strip.classList.add("is-media-ready");
          track.classList.add("is-ready");
        });
      });
    };

    const criticalImages = Array.from(group.querySelectorAll("img")).slice(0, 4);

    const checkCriticalImages = () => {
      if (!criticalImages.length) {
        revealTrack();
        return;
      }

      const allReady = criticalImages.every(
        (image) => image.dataset.ready === "true"
      );

      if (allReady) revealTrack();
    };

    const onImageReady = () => checkCriticalImages();

    criticalImages.forEach((image) => {
      image.addEventListener("sep:image-ready", onImageReady);

      if (image.complete && image.naturalWidth > 0) {
        void markImageReady(image).then(checkCriticalImages);
      }
    });

    measureAndSet();
    checkCriticalImages();

    // The timeout only applies after the intro gate is open. During the intro,
    // the effect reruns from a clean state when LoaderOverlay reports done.
    if (!initialLoaderActive) {
      safetyTimer = window.setTimeout(revealTrack, 3200);
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(measureAndSet);
      resizeObserver.observe(group);
      resizeObserver.observe(document.documentElement);
    }

    window.addEventListener("resize", measureAndSet, { passive: true });
    window.addEventListener("orientationchange", measureAndSet, {
      passive: true,
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(measureAndSet).catch(() => {});
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(revealFrame);
      window.clearTimeout(safetyTimer);
      resizeObserver?.disconnect();

      window.removeEventListener("resize", measureAndSet);
      window.removeEventListener("orientationchange", measureAndSet);

      criticalImages.forEach((image) => {
        image.removeEventListener("sep:image-ready", onImageReady);
      });
    };
  }, [initialLoaderActive]);

  return (
    <main className="home">
      <section className="stage" aria-label="Selected portfolio projects">
        <div className="strip-wrap">
          <div className="strip" ref={stripRef}>
            <div className="track" ref={trackRef}>
              <div className="marquee-group" ref={groupRef}>
                {projects.map((project, index) => (
                  <Card
                    key={`base-${project.slug}`}
                    p={project}
                    priority={index < 4}
                  />
                ))}
              </div>

              <div className="marquee-group" aria-hidden="true">
                {projects.map((project) => (
                  <Card
                    key={`clone-${project.slug}`}
                    p={project}
                    hiddenCard={true}
                  />
                ))}
              </div>
            </div>

            <div className="strip-loader" aria-live="polite">
              <div className="strip-loader__meta">
                <span>SELECTED WORK</span>
                <span>LOADING VISUALS</span>
              </div>
              <div className="strip-loader__line" aria-hidden="true">
                <span />
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
