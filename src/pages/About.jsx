// src/pages/About.jsx
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./about.css";
import { asset } from "../utils/asset";

export default function About() {
  const [ratio, setRatio] = useState(3 / 4);
  const [mediaState, setMediaState] = useState("loading");

  const vRef = useRef(null);
  const mountedRef = useRef(false);
  const readyRef = useRef(false);
  const framePendingRef = useRef(false);
  const retryCountRef = useRef(0);
  const errorRetryCountRef = useRef(0);
  const retryTimerRef = useRef(0);
  const fallbackFrameTimerRef = useRef(0);
  const videoFrameCallbackRef = useRef(0);

  const clearPlaybackTimers = useCallback(() => {
    window.clearTimeout(retryTimerRef.current);
    window.clearTimeout(fallbackFrameTimerRef.current);

    const video = vRef.current;
    if (
      video &&
      videoFrameCallbackRef.current &&
      typeof video.cancelVideoFrameCallback === "function"
    ) {
      video.cancelVideoFrameCallback(videoFrameCallbackRef.current);
    }

    retryTimerRef.current = 0;
    fallbackFrameTimerRef.current = 0;
    videoFrameCallbackRef.current = 0;
    framePendingRef.current = false;
  }, []);

  const onMeta = useCallback(() => {
    const video = vRef.current;
    if (!video) return;

    const { videoWidth: width, videoHeight: height } = video;
    if (width && height) setRatio(width / height);
  }, []);

  const confirmRenderedFrame = useCallback(() => {
    const video = vRef.current;

    if (
      !video ||
      !mountedRef.current ||
      readyRef.current ||
      framePendingRef.current ||
      video.readyState < 2 ||
      video.paused
    ) {
      return;
    }

    const commitReady = () => {
      framePendingRef.current = false;

      requestAnimationFrame(() => {
        if (
          !mountedRef.current ||
          readyRef.current ||
          video.readyState < 2 ||
          video.paused
        ) {
          return;
        }

        readyRef.current = true;
        retryCountRef.current = 0;
        errorRetryCountRef.current = 0;
        setMediaState("ready");
      });
    };

    framePendingRef.current = true;

    if (typeof video.requestVideoFrameCallback === "function") {
      videoFrameCallbackRef.current = video.requestVideoFrameCallback(() => {
        videoFrameCallbackRef.current = 0;
        commitReady();
      });
      return;
    }

    fallbackFrameTimerRef.current = window.setTimeout(commitReady, 140);
  }, []);

  const attemptPlayback = useCallback(() => {
    const video = vRef.current;

    if (!video || !mountedRef.current || readyRef.current) return;

    window.clearTimeout(retryTimerRef.current);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playPromise = video.play();

    if (!playPromise || typeof playPromise.catch !== "function") return;

    playPromise.catch(() => {
      if (!mountedRef.current || readyRef.current) return;

      retryCountRef.current += 1;
      const delay = Math.min(250 + retryCountRef.current * 180, 1000);
      retryTimerRef.current = window.setTimeout(attemptPlayback, delay);
    });
  }, []);

  const handlePlaying = useCallback(() => {
    retryCountRef.current = 0;
    window.clearTimeout(retryTimerRef.current);
    confirmRenderedFrame();
  }, [confirmRenderedFrame]);

  const handleWaiting = useCallback(() => {
    if (readyRef.current) return;

    window.clearTimeout(retryTimerRef.current);
    retryTimerRef.current = window.setTimeout(attemptPlayback, 180);
  }, [attemptPlayback]);

  const handleMediaError = useCallback(() => {
    const video = vRef.current;

    if (!video || !mountedRef.current || readyRef.current) return;

    clearPlaybackTimers();

    if (errorRetryCountRef.current < 2) {
      errorRetryCountRef.current += 1;
      setMediaState("loading");

      retryTimerRef.current = window.setTimeout(() => {
        if (!mountedRef.current || readyRef.current) return;

        try {
          video.load();
        } catch {
          // load() may throw on a browser that is already tearing down media.
        }

        attemptPlayback();
      }, 260 * errorRetryCountRef.current);

      return;
    }

    setMediaState("error");
  }, [attemptPlayback, clearPlaybackTimers]);

  const handleMetadata = useCallback(() => {
    onMeta();
    attemptPlayback();
  }, [attemptPlayback, onMeta]);

  useEffect(() => {
    mountedRef.current = true;
    readyRef.current = false;
    retryCountRef.current = 0;
    errorRetryCountRef.current = 0;
    setMediaState("loading");

    const video = vRef.current;
    if (!video) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const retryStartup = window.setTimeout(() => {
      if (video.readyState === 0) {
        try {
          video.load();
        } catch {
          // Ignore browsers that reject an unnecessary load() call.
        }
      }

      attemptPlayback();
    }, 60);

    const resumeWhenVisible = () => {
      if (document.hidden || readyRef.current) return;
      attemptPlayback();
    };

    document.addEventListener("visibilitychange", resumeWhenVisible);
    window.addEventListener("focus", resumeWhenVisible);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(retryStartup);
      clearPlaybackTimers();
      document.removeEventListener("visibilitychange", resumeWhenVisible);
      window.removeEventListener("focus", resumeWhenVisible);
    };
  }, [attemptPlayback, clearPlaybackTimers]);

  const figureClassName = [
    "about__figure",
    "about__figure--video",
    mediaState === "ready" ? "is-media-ready" : "",
    mediaState === "error" ? "is-media-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="about">
      <div className="about__wrap">
        {/* KIRI — video + overlay */}
        <section className="col col--left">
          <figure
            className={figureClassName}
            style={{ aspectRatio: ratio }}
            aria-busy={mediaState === "loading"}
          >
            <div
              className="about__videoShell"
              onContextMenu={(event) => event.preventDefault()}
              draggable={false}
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
                onLoadedMetadata={handleMetadata}
                onLoadedData={attemptPlayback}
                onCanPlay={attemptPlayback}
                onPlaying={handlePlaying}
                onTimeUpdate={confirmRenderedFrame}
                onWaiting={handleWaiting}
                onStalled={handleWaiting}
                onError={handleMediaError}
              >
                <source
                  src={asset("assets/about-image-video/profile.mp4")}
                  type="video/mp4"
                />
              </video>

              <div className="about__mediaState" aria-hidden="true">
                <div className="about__mediaStateMeta">
                  <span>SEP314STUDIO</span>
                  <span>
                    {mediaState === "error"
                      ? "VIDEO UNAVAILABLE"
                      : "LOADING VIDEO"}
                  </span>
                </div>
                <div className="about__mediaStateLine">
                  <span />
                </div>
              </div>

              <div
                className="about__shield"
                onContextMenu={(event) => event.preventDefault()}
                aria-hidden="true"
              />
            </div>

            {/* OVERLAY teks besar */}
            <div className="about__overlay">
              <h1 className="about__name">SEP314STUDIO</h1>
              <p className="about__ledeBig">
                is a Jakarta based digital studio specializing in full-stack web
                development, by Dimasprydh. I design and build fast, readable
                websites aligned to your brand using Shopify (Liquid),
                React/Vite, PHP, and modern HTML/CSS/JS. From VSCODE{" "}
                <strong>concept</strong> to <strong>production</strong>.
              </p>
            </div>

            <figcaption className="visually-hidden">
              Portrait motion loop of SEP314STUDIO
            </figcaption>
          </figure>
        </section>

        {/* KANAN — contact + sections */}
        <section className="col col--right">
          {/* Contact */}
          <div className="about__contact">
            <h2>Contact</h2>
            <a href="mailto:sep314studio@gmail.com">Email</a>
            <span className="sep">—</span>
            <a
              href="https://instagram.com/sep314studio"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <span className="sep">—</span>
            <a
              href="https://www.linkedin.com/in/dimasprydh/"
              target="_blank"
              rel="noreferrer"
            >
              Linkedin
            </a>
          </div>

          <div className="about__sections">
            {/* Education */}
            <section className="about__section">
              <h3>Education</h3>
              <ul className="list list--timeline">
                <li>
                  <b>2019 — 2023</b>
                  <span>Computer Science</span>
                  <em>Binus University - Bachelor&apos;s Degree</em>
                </li>
                <li>
                  <b>2013 — 2019</b>
                  <span>Computer and Network Engineering</span>
                  <em>Perguruan Cikini - Vocational High School</em>
                </li>
              </ul>
            </section>

            {/* Work Experience */}
            <section className="about__section">
              <h3>Work Experience</h3>
              <ul className="list list--timeline">
                <li>
                  <b>2026 — Now</b>
                  <span>
                    <a
                      href="https://forhermoment.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      For Her Moment
                    </a>
                  </span>
                  <em>Web Designer &amp; Developer</em>
                </li>
                <li>
                  <b>2025 — Now</b>
                  <span>
                    <a
                      href="https://onionwrks.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Onion Works
                    </a>
                  </span>
                  <em>Web Designer &amp; Developer</em>
                </li>
                <li>
                  <b>2024 — Now</b>
                  <span>
                    <a
                      href="https://www.scoreoffscoot.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Socre Off Scoot and Fittyandco
                    </a>
                  </span>
                  <em>Web Designer &amp; Developer</em>
                </li>
                <li>
                  <b>2024 — Now</b>
                  <span>
                    <a
                      href="https://www.roomforair.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Room For Air
                    </a>
                  </span>
                  <em>Web Designer &amp; Developer</em>
                </li>
                <li>
                  <b>2024 — Now</b>
                  <span>
                    <a
                      href="https://mediocreq.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mediocre
                    </a>
                  </span>
                  <em>Web Designer &amp; Developer</em>
                </li>
                <li>
                  <b>2018 — 2019</b>
                  <span>
                    <a
                      href="https://www.doktermobil.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Dokter Mobil Indonesia
                    </a>
                  </span>
                  <em>Data Analyst &amp; Video Editor</em>
                </li>
              </ul>
            </section>

            {/* Certificate */}
            <section className="about__section">
              <h3>Certificate</h3>
              <ul className="list list--bullets">
                <li>
                  <a
                    href="https://www.udemy.com/certificate/UC-7551c843-ddea-44c0-ad36-8b703e8abf3b/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    2023 — Learn Figma - UI/UX Design Essential Training
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
