// src/pages/About.jsx
import React, { useRef, useState, useCallback } from "react";
import "./about.css";
import { asset } from "src/utils/asset";

export default function About() {
  // figure mengikuti rasio asli video
  const [ratio, setRatio] = useState(3 / 4); // default portrait
  const vRef = useRef(null);

  const onMeta = useCallback(() => {
    const v = vRef.current;
    if (!v) return;
    const { videoWidth: w, videoHeight: h } = v;
    if (w && h) setRatio(w / h);
  }, []);

  return (
    <div className="about">
      <div className="about__wrap">
        {/* KIRI — lede besar overlap di atas video */}
        <section className="col col--left">
          <figure
            className="about__figure about__figure--video"
            style={{ aspectRatio: ratio }}
          >
            {/* Video */}
            <div
              className="about__videoShell"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              aria-hidden="true"
            >
              <video
                ref={vRef}
                className="about__video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate nofullscreen"
                tabIndex={-1}
                onLoadedMetadata={onMeta}
              >
                {/* pakai mp4 utama; mov sebagai fallback kalau perlu */}
               <source src={asset("assets/about-image-video/profile.mp4")} type="video/mp4" />
              </video>
              {/* shield transparan: blok klik kanan/drag */}
              <div
                className="about__shield"
                onContextMenu={(e) => e.preventDefault()}
                aria-hidden="true"
              />
            </div>

            {/* OVERLAY teks besar (menutupi ± setengah bagian atas video) */}
            <div className="about__overlay">
              <h1 className="about__name">SEP314STUDIO</h1>
              <p className="about__ledeBig">
                is a Jakarta based digital studio specializing in full-stack web
                development, by Dimasprydh. I design and build fast, readable
                websites aligned to your brand using Shopify (Liquid),
                React/Vite, PHP, and modern HTML/CSS/JS. From{" VSCODE "}
                <strong>concept</strong> to <strong>production</strong>.
              </p>
            </div>

            <figcaption className="visually-hidden">
              Portrait motion loop of SEPT314STUDIO
            </figcaption>
          </figure>
        </section>

        {/* KANAN — contact + sections (tetap sederhana) */}
        <section className="col col--right">
          <div className="about__contact">
            <h2>Contact</h2>
            <a href="mailto:hello@sept314studio.com">sep314studio@gmail.com</a>
            <span>—</span>
            <a
              href="https://instagram.com/sep314studio"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <span>—</span>
            <a href="https://vimeo.com/" target="_blank" rel="noreferrer">
              Vimeo
            </a>
          </div>

          <div className="about__sections">
            <section className="about__section">
              <h3>Education</h3>
              <ul className="list list--timeline">
                <li>
                  <b>2019 — 2023</b>
                  <span>Computer Science</span>
                  <em>Binus University - Bachelor's Degree </em>
                </li>
                <li>
                  <b>2013 — 2019</b>
                  <span>Computer and Network Engineering</span>
                  <em>Perguruan Cikini - Vocational High School</em>
                </li>
                {/* <li>
                  <b>2017</b>
                  <span>IELTS / English Certification</span>
                  <em>British Council</em>
                </li> */}
              </ul>
            </section>

            <section className="about__section">
              <h3>Work Experience</h3>
              <ul className="list list--timeline">
                <li>
                  <b>2025 — Now</b>
                  <a
                    href="https://onionwrks.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Onion Works</span>
                  </a>
                  <em>Web Designer & Developer</em>
                </li>
                <li>
                  <b>2024 — Now</b>
                  <a
                    href="https://www.scoreoffscoot.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Socre Off Scoot and Fittyandco</span>
                  </a>
                  <em>Web Designer & Developer</em>
                </li>
                <li>
                  <b>2024 — Now</b>
                  <a
                    href="https://www.roomforair.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Room For Air</span>
                  </a>
                  <em>Web Designer & Developer</em>
                </li>
                <li>
                  <b>2024 — Now</b>
                  <a
                    href="https://mediocreq.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Mediocre</span>
                  </a>
                  <em>Web Designer & Developer</em>
                </li>
                <li>
                  <b>2018 — 2019</b>
                  <a
                    href="https://www.doktermobil.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Dokter Mobil Indonesia</span>
                  </a>
                  <em>Data Analyst & Video Editor</em>
                </li>
              </ul>
            </section>

            <section className="about__section">
              <h3>Certificate</h3>
              <ul className="list list--bullets">
                <a
                  href="https://www.udemy.com/certificate/UC-7551c843-ddea-44c0-ad36-8b703e8abf3b/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <li>2023 — Learn Figma - UI/UX Design Essential Training</li>
                </a>
              </ul>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
