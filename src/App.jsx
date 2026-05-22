// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Theme from "./layout/theme.jsx";
import Home from "./pages/home.jsx";
import About from "./pages/About.jsx";
import Work from "./pages/Work.jsx";
import Service from "./pages/Service";

export default function App() {
  return (
    <Routes>
      {/* Layout utama (header + loader ada di Theme) */}
      <Route element={<Theme />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
  
