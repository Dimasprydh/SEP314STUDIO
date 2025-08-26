// import React, { useEffect, useRef } from "react";
// import "./Footer.css";

// export default function Footer() {
//   const ref = useRef(null);

//   // Simpan tinggi footer ke CSS var --footer-h (biar stage bisa hitung tinggi sisa)
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const setVar = () =>
//       document.documentElement.style.setProperty(
//         "--footer-h",
//         (el.offsetHeight || 0) + "px"
//       );
//     setVar();
//     let ro;
//     if ("ResizeObserver" in window) {
//       ro = new ResizeObserver(setVar);
//       ro.observe(el);
//     }
//     window.addEventListener("resize", setVar);
//     return () => {
//       window.removeEventListener("resize", setVar);
//       ro && ro.disconnect();
//     };
//   }, []);

//   return (
//     <footer ref={ref} className="site-footer" aria-label="Footer">
//       <div className="footer-wrap">
//         {/* Big brand mark */}
//         <h1 className="footer-mark">SEP314STUDIO</h1>

//         {/* Meta kecil */}
//         <div className="footer-meta">
//           <a href="mailto:hello@sept314studio.com">hello@sept314studio.com</a>
//           <span>Jakarta, IDN</span>
//           <span>© {new Date().getFullYear()}</span>
//         </div>
//       </div>
//     </footer>
//   );
// }
