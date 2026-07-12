import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://sep314studio.xyz";
const DEFAULT_IMAGE = `${SITE_URL}/assets/photo-icon/1-black-icon-porto.png`;

const PAGE_SEO = {
  "/": {
    title: "SEP314STUDIO — Web Designer & Developer in Jakarta",
    description:
      "SEP314STUDIO is a Jakarta-based web design and development studio creating custom Shopify and React websites for fashion and creative brands.",
  },
  "/work": {
    title: "Selected Work — SEP314STUDIO",
    description:
      "Explore selected website projects by SEP314STUDIO for fashion, lifestyle, and creative brands, built with Shopify, React, and modern web technologies.",
  },
  "/service": {
    title: "Web Design & Development Services — SEP314STUDIO",
    description:
      "Custom web design and development services by SEP314STUDIO, including Shopify stores, portfolio websites, landing pages, and React development.",
  },
  "/about": {
    title: "About SEP314STUDIO — Web Designer & Developer",
    description:
      "Learn about SEP314STUDIO, a Jakarta-based digital studio by Dimasprydh specializing in web design, Shopify development, React, and front-end development.",
  },
};

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");

    const [key, name] = attribute.split("=");
    element.setAttribute(key, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", url);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
    const knownPage = PAGE_SEO[normalizedPath];
    const page = knownPage || PAGE_SEO["/"];
    const canonicalUrl = knownPage
      ? `${SITE_URL}${normalizedPath === "/" ? "/" : normalizedPath}`
      : `${SITE_URL}/`;

    document.title = page.title;
    setCanonical(canonicalUrl);

    setMeta('meta[name="description"]', "name=description", page.description);
    setMeta(
      'meta[name="robots"]',
      "name=robots",
      knownPage ? "index, follow" : "noindex, follow",
    );
    setMeta('meta[property="og:type"]', "property=og:type", "website");
    setMeta(
      'meta[property="og:site_name"]',
      "property=og:site_name",
      "SEP314STUDIO",
    );
    setMeta('meta[property="og:title"]', "property=og:title", page.title);
    setMeta(
      'meta[property="og:description"]',
      "property=og:description",
      page.description,
    );
    setMeta('meta[property="og:url"]', "property=og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property=og:image", DEFAULT_IMAGE);
    setMeta(
      'meta[property="og:image:secure_url"]',
      "property=og:image:secure_url",
      DEFAULT_IMAGE,
    );
    setMeta(
      'meta[property="og:image:type"]',
      "property=og:image:type",
      "image/png",
    );
    setMeta(
      'meta[name="twitter:card"]',
      "name=twitter:card",
      "summary_large_image",
    );
    setMeta('meta[name="twitter:title"]', "name=twitter:title", page.title);
    setMeta(
      'meta[name="twitter:description"]',
      "name=twitter:description",
      page.description,
    );
    setMeta(
      'meta[name="twitter:image"]',
      "name=twitter:image",
      DEFAULT_IMAGE,
    );
  }, [pathname]);

  return null;
}
