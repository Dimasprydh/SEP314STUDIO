// src/pages/Service.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Service.css";

export default function Service() {
  return (
    <main className="service-page">
      <section className="service-hero">
        <div className="service-hero__inner">
          <p className="service-label">SEP314STUDIO / SERVICE</p>

          <h1>
            Website design and development for brands that need a proper online
            presence.
          </h1>

          <p className="service-hero__text">
            I design and build websites for brands, businesses, and independent
            projects, whether it needs to be an online store, brand website,
            portfolio, or a custom coded site built from scratch.
          </p>
        </div>
      </section>

      <section className="service-overview">
        <div className="service-overview__left">
          <p className="service-label">WHAT I DO</p>
        </div>

        <div className="service-overview__right">
          <p>
            I work on websites for fashion, fragrance, beauty, skincare,
            lifestyle, F&B, accessories, personal projects, and product based
            brands.
          </p>

          <p>
            The website can be built using Shopify, WordPress, WooCommerce, or
            custom code depending on what the brand actually needs.
          </p>
        </div>
      </section>

      <section className="service-list-section">
        <div className="service-row">
          <span className="service-num">01</span>

          <div className="service-row__content">
            <h2>Shopify Website</h2>
            <p>
              Shopify store setup, theme customization using HTML, CSS,
              JavaScript, Liquid and JSON, product pages, collections, cart,
              search, custom sections, payment setup guidance, shipping setup
              guidance, and launch preparation.
            </p>
          </div>
        </div>

        <div className="service-row">
          <span className="service-num">02</span>

          <div className="service-row__content">
            <h2>WordPress / WooCommerce</h2>
            <p>
              Website or online store built with WordPress and WooCommerce for
              brands that need a CMS, product catalog, blog, content based
              website, or a familiar dashboard to manage their site.
            </p>
          </div>
        </div>

        <div className="service-row">
          <span className="service-num">03</span>

          <div className="service-row__content">
            <h2>Custom Coded Website</h2>
            <p>
              Website built outside of platforms using code such as React,
              Vite, HTML, CSS, JavaScript, PHP, or other stack based on the
              project. Suitable for portfolio, brand site, landing page,
              campaign page, or custom layout.
            </p>
          </div>
        </div>

        <div className="service-row">
          <span className="service-num">04</span>

          <div className="service-row__content">
            <h2>Website Redesign</h2>
            <p>
              Improving an existing website layout, mobile view, visual
              direction, page structure, product display, and overall user
              experience without forcing the brand into a random template look.
            </p>
          </div>
        </div>
      </section>

      <section className="service-scope">
        <div className="service-scope__header">
          <p className="service-label">SCOPE</p>
          <h2>Every project is adjusted based on the website needs.</h2>
        </div>

        <div className="service-scope__grid">
          <div className="scope-item">
            <p>Homepage</p>
          </div>

          <div className="scope-item">
            <p>Product page</p>
          </div>

          <div className="scope-item">
            <p>Collection / catalog</p>
          </div>

          <div className="scope-item">
            <p>Cart / checkout flow</p>
          </div>

          <div className="scope-item">
            <p>About page</p>
          </div>

          <div className="scope-item">
            <p>Contact page</p>
          </div>

          <div className="scope-item">
            <p>Search page</p>
          </div>

          <div className="scope-item">
            <p>Policy pages</p>
          </div>

          <div className="scope-item">
            <p>Custom section</p>
          </div>

          <div className="scope-item">
            <p>Domain setup</p>
          </div>

          <div className="scope-item">
            <p>Payment setup</p>
          </div>

          <div className="scope-item">
            <p>Shipping setup</p>
          </div>
        </div>
      </section>

      <section className="service-note">
        <div>
          <p className="service-label">HOW IT WORKS</p>
        </div>

        <div className="service-note__content">
          <p>
            We start from the brand direction, references, products, pages, and
            features needed. After that, the website is built based on the
            chosen platform or code approach.
          </p>

          <p>
            For Shopify or WooCommerce, the client can manage products, prices,
            stock, orders, and selected content from the dashboard. For custom
            coded websites, the setup depends on the project scope and how the
            content needs to be managed.
          </p>
        </div>
      </section>

      <section className="service-process">
        <p className="service-label">PROCESS</p>

        <div className="process-grid">
          <div className="process-card">
            <span>01</span>
            <h3>Brief</h3>
            <p>Understand the brand, reference, product, and website needs.</p>
          </div>

          <div className="process-card">
            <span>02</span>
            <h3>Direction</h3>
            <p>Define the structure, visual direction, pages, and platform.</p>
          </div>

          <div className="process-card">
            <span>03</span>
            <h3>Build</h3>
            <p>Develop the website, layout, pages, sections, and setup.</p>
          </div>

          <div className="process-card">
            <span>04</span>
            <h3>Launch</h3>
            <p>Final check, mobile review, domain setup, and deployment.</p>
          </div>
        </div>
      </section>

      <section className="service-pricing">
        <div className="service-pricing__header">
          <p className="service-label">ESTIMATION</p>

          <h2>
            Project cost depends on the platform, design direction, pages,
            products, features, and timeline.
          </h2>
        </div>

        <div className="pricing-grid">
          <article className="pricing-card">
            <span>SHOPIFY / WORDPRESS / WOOCOMMERCE</span>

            <div>
              <h3>Rp1.000.000 to Rp7.000.000</h3>

              <p>
                For Shopify, WordPress, or WooCommerce websites. Suitable for
                brand websites, online stores, product catalogs, landing pages,
                and standard business websites.
              </p>
            </div>
          </article>

          <article className="pricing-card">
            <span>CUSTOM CODED WEBSITE</span>

            <div>
              <h3>Starts from Rp5.000.000</h3>

              <p>
                For websites built outside of platforms using custom code. Final
                estimation depends on the layout, pages, animation, CMS needs,
                and technical complexity.
              </p>
            </div>
          </article>
        </div>

        <p className="pricing-note">
          Platform costs such as Shopify plan, domain, hosting, paid theme, paid
          apps, payment gateway, shipping tools, or other third-party services
          are not included in the development fee.
        </p>
      </section>

      <section className="service-cta">
        <div>
          <p className="service-label">START A PROJECT</p>
          <h2>Need a website for your brand?</h2>
        </div>

        <div className="service-cta__actions">
          <a
            href="mailto:sep314studio@gmail.com?subject=Website Project Inquiry"
            className="service-link"
          >
            EMAIL
          </a>

          <Link to="/work" className="service-link">
            VIEW WORK
          </Link>
        </div>
      </section>
    </main>
  );
}
