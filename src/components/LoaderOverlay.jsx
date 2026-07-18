import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { asset } from "../utils/asset";
import "./loader-overlay.css";
import "./loader-overlay-exit.css";

const START_SECOND = 4;
const TARGET_SECOND = 10;
const ENTER_MS = 420;
const TICK_MS = 170;
const LOCK_HOLD_MS = 260;
const EXIT_MS = 760;

const CRITICAL_OVERVIEW_ASSETS = [
  "assets/portofolio-website/fhm-website.png",
  "assets/portofolio-website/mediocre.png",
  "assets/portofolio-website/roomforair.png",
  "assets/portofolio-website/onionwrks.png",
];

function padSecond(value) {
  return String(value).padStart(2, "0");
}

export default function LoaderOverlay({
  show,
  onReveal,
  onDone,
  z = 2147483647,
}) {
  const [phase, setPhase] = useState("enter");
  const [counter, setCounter] = useState({
    previous: null,
    current: START_SECOND,
    tick: 0,
  });
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  const rootClassName = useMemo(
    () => `intro-loader intro-loader--${phase}`,
    [phase]
  );

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    if (!show) return undefined;

    completedRef.current = false;

    const timers = [];
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
      return timer;
    };

    setPhase("enter");
    setCounter({ previous: null, current: START_SECOND, tick: 0 });
    setProgress(0);

    CRITICAL_OVERVIEW_ASSETS.forEach((path) => {
      const image = new Image();
      image.decoding = "async";
      image.src = asset(path);
    });

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (reducedMotion) {
      setCounter({
        previous: null,
        current: TARGET_SECOND,
        tick: TARGET_SECOND - START_SECOND,
      });
      setProgress(1);
      setPhase("locked");

      schedule(() => {
        onReveal?.();
        setPhase("exit");
      }, 120);
      schedule(finish, 260);
    } else {
      schedule(() => setPhase("counting"), 70);

      const totalSteps = TARGET_SECOND - START_SECOND;

      for (let step = 1; step <= totalSteps; step += 1) {
        const nextSecond = START_SECOND + step;

        schedule(() => {
          setCounter((current) => ({
            previous: current.current,
            current: nextSecond,
            tick: step,
          }));
          setProgress(step / totalSteps);
        }, ENTER_MS + step * TICK_MS);
      }

      const lockAt = ENTER_MS + totalSteps * TICK_MS + 110;
      const revealAt = lockAt + LOCK_HOLD_MS;
      const exitAt = revealAt + 34;

      schedule(() => setPhase("locked"), lockAt);

      // Prepare the already-rendered page one frame before the panel moves.
      schedule(() => onReveal?.(), revealAt);
      schedule(() => setPhase("exit"), exitAt);

      // Safety fallback only. Normal completion is driven by transitionend.
      schedule(finish, exitAt + EXIT_MS + 260);
    }

    const { documentElement, body } = document;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [finish, onReveal, show]);

  const handleTransitionEnd = useCallback(
    (event) => {
      if (
        phase !== "exit" ||
        event.target !== event.currentTarget ||
        event.propertyName !== "transform"
      ) {
        return;
      }

      finish();
    },
    [finish, phase]
  );

  if (!show) return null;

  return (
    <div
      className={rootClassName}
      style={{
        zIndex: z,
        "--intro-progress": progress,
        "--intro-ghost-shift": `${progress * 12}px`,
      }}
      aria-label="SEP314STUDIO introduction"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="intro-loader__noise" aria-hidden="true" />
      <div className="intro-loader__ghost" aria-hidden="true">
        3.14
      </div>

      <div className="intro-loader__meta intro-loader__meta--top">
        <span>SEP314STUDIO</span>
      </div>

      <div className="intro-loader__stage">
        <div className="intro-loader__aperture">
          <div className="intro-loader__slogan">
            <span>SEP 3.14 PM 10:44:</span>
            <span className="intro-loader__seconds" aria-live="polite">
              {counter.previous !== null && (
                <span
                  key={`previous-${counter.tick}`}
                  className="intro-loader__second intro-loader__second--out"
                  aria-hidden="true"
                >
                  {padSecond(counter.previous)}
                </span>
              )}
              <span
                key={`current-${counter.tick}`}
                className={`intro-loader__second intro-loader__second--in ${
                  counter.tick === 0 ? "is-initial" : ""
                }`}
              >
                {padSecond(counter.current)}
              </span>
            </span>
          </div>
        </div>

        <div className="intro-loader__progress" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="intro-loader__meta intro-loader__meta--bottom">
        <span>JAKARTA, IDN</span>
        <span>DESIGN / DEVELOPMENT</span>
      </div>
    </div>
  );
}
