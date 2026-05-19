// src/pages/index.jsx
import React from "react";
import "./home.css";

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
    role: "Full-stack",
    stack: "Shopify Liquid · HTML · CSS · JavaScript",
    status: "Live",
    href: "https://www.scoreoffscoot.com/",
    subtitle: "Score Off Scoot | 2024 — Present",
  },
];

const loopSets = [0, 1, 2, 3, 4, 5];

function Card({ p }) {
  return (
    <article className="card card--reveal" data-title={p.subtitle}>
      <img
        className="card__img"
        src={p.img}
        alt={`${p.title} website preview`}
        loading="eager"
        draggable="false"
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
        aria-label={`Open ${p.title}`}
      />
    </article>
  );
}

export default function Home() {
  return (
    <main className="home">
      <section className="stage" aria-label="Selected portfolio projects">
        <div className="strip-wrap">
          <div className="strip">
            <div className="track">
              {loopSets.map((setIndex) => (
                <div
                  className="set"
                  key={`set-${setIndex}`}
                  aria-hidden={setIndex === 0 ? "false" : "true"}
                >
                  {projects.map((p) => (
                    <Card key={`${setIndex}-${p.slug}`} p={p} />
                  ))}
                </div>
              ))}
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
