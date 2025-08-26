import { useEffect, useMemo } from "react";

/**
 * Overlay iframe ke /loader.html
 * Anti-bocor/see-through:
 *  - Container SELALU background #000 sampai overlay dibuang.
 *  - Lock scroll body saat overlay tampil.
 */
export default function LoaderOverlay({ show, onDone, z = 2147483647 }) {
  const base = import.meta.env.BASE_URL || "/";
  const src = useMemo(
    () => (show ? `${base}loader.html?_=${Date.now()}` : ""),
    [show, base]
  );

  // Lock scroll saat loader on
  useEffect(() => {
    if (!show) return;
    const { documentElement, body } = document;
    const prevHtml = documentElement.style.overflow;
    const prevBody = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      documentElement.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [show]);

  // Dengarkan pesan selesai dari iframe
  useEffect(() => {
    if (!show) return;
    const handleMsg = (e) => {
      if (e?.data === "s314-loader-done") onDone?.();
    };
    window.addEventListener("message", handleMsg);
    // fallback anti-stuck
    const safety = setTimeout(() => onDone?.(), 6500);
    return () => {
      window.removeEventListener("message", handleMsg);
      clearTimeout(safety);
    };
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: z,
        // PENTING: tetap hitam solid sampai overlay di-unmount
        background: "#000",
        pointerEvents: "auto",
      }}
    >
      <iframe
        title="sep-loader"
        src={src}
        allow="autoplay"
        // cukup untuk JS internal
        sandbox="allow-scripts allow-same-origin"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          display: "block",
          background: "transparent",
        }}
      />
    </div>
  );
}
