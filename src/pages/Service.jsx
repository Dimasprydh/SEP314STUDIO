// src/pages/Service.jsx
import React from "react";
import "./Service.css";
import { asset } from "../utils/asset";

export default function Service() {
  return (
    <main className="service-page">
      <section className="service-hero">
        <div className="service-kicker">SHOPIFY WEBSITE SERVICE</div>

        <h1>
          Shopify websites for brands that need more than just a basic online
          store.
        </h1>

        <p>
          I help product-based brands build Shopify websites that match their
          identity, feel considered, and are ready to support real online sales.
        </p>

        <div className="service-hero__actions">
          <a
            href="mailto:dimascoeg87@gmail.com?subject=Shopify Website Inquiry"
            className="service-btn service-btn--primary"
          >
            DISCUSS PROJECT
          </a>

          <a href="/SEP314STUDIO/work" className="service-btn service-btn--ghost">
            VIEW WORK
          </a>
        </div>
      </section>

      <section className="service-section service-intro">
        <div className="service-label">WHO IT IS FOR</div>

        <div className="service-copy">
          <p>
            This service is made for fashion brands, fragrance brands, beauty
            and skincare, accessories, jewelry, lifestyle products, F&B,
            handmade products, and local brands that want to have their own
            Shopify website.
          </p>

          <p>
            The website direction can be adjusted to your brand’s vibe, whether
            it needs to feel minimal, premium, bold, elegant, playful,
            streetwear, feminine, luxury, or editorial.
          </p>
        </div>
      </section>

      <section className="service-grid">
        <article className="service-card">
          <span>01</span>
          <h2>Store Setup</h2>
          <p>
            Shopify store setup, basic configuration, navigation, pages,
            collections, product structure, and launch preparation.
          </p>
        </article>

        <article className="service-card">
          <span>02</span>
          <h2>Website Design</h2>
          <p>
            Homepage, product pages, collection pages, cart, search, and layout
            direction based on the brand’s visual identity.
          </p>
        </article>

        <article className="service-card">
          <span>03</span>
          <h2>Custom Layout</h2>
          <p>
            Custom sections and layout adjustments so the website does not feel
            like a basic template with only logo and color changes.
          </p>
        </article>

        <article className="service-card">
          <span>04</span>
          <h2>Payment & Shipping</h2>
          <p>
            Guidance for payment gateway, shipping setup, domain connection,
            store settings, and other basic requirements before launch.
          </p>
        </article>
      </section>

      <section className="service-section service-included">
        <div className="service-label">WHAT CAN BE BUILT</div>

        <div className="service-list-wrap">
          <ul className="service-list">
            <li>Shopify website setup</li>
            <li>Homepage direction</li>
            <li>Product page layout</li>
            <li>Collection or catalog page</li>
            <li>Cart and search page</li>
            <li>About and contact page</li>
            <li>Policy pages</li>
            <li>Navigation and footer</li>
          </ul>

          <ul className="service-list">
            <li>Mobile responsive layout</li>
            <li>Product upload setup</li>
            <li>Basic product metafields</li>
            <li>Theme customization</li>
            <li>Domain setup guidance</li>
            <li>Payment gateway guidance</li>
            <li>Shipping setup guidance</li>
            <li>Launch preparation</li>
          </ul>
        </div>
      </section>

      <section className="service-section service-process">
        <div className="service-label">PROCESS</div>

        <div className="process-row">
          <div className="process-item">
            <span>01</span>
            <h3>Brief</h3>
            <p>
              We start by understanding the brand, products, references, target
              market, and website needs.
            </p>
          </div>

          <div className="process-item">
            <span>02</span>
            <h3>Direction</h3>
            <p>
              The website structure and visual direction are planned based on
              the brand’s identity and product type.
            </p>
          </div>

          <div className="process-item">
            <span>03</span>
            <h3>Build</h3>
            <p>
              The Shopify store is built, customized, and prepared with pages,
              products, layout, and basic settings.
            </p>
          </div>

          <div className="process-item">
            <span>04</span>
            <h3>Launch</h3>
            <p>
              Final checking, mobile review, domain setup, payment and shipping
              guidance, then the store is ready to go live.
            </p>
          </div>
        </div>
      </section>

      <section className="service-section service-admin">
        <div className="service-label">SHOPIFY ADMIN</div>

        <div className="service-copy">
          <p>
            After the website is ready, the store can be managed from the
            Shopify dashboard. You can upload products, edit prices, update
            images, manage stock, create collections, check orders, create
            discount codes, and update selected website content from the theme
            editor.
          </p>

          <p>
            Shopify plan, domain, paid apps, payment gateway fees, and other
            official third-party costs are handled separately by the client
            through their own account.
          </p>
        </div>
      </section>

      <section className="service-cta">
        <p>Need a Shopify website for your brand?</p>

        <a
          href="mailto:dimascoeg87@gmail.com?subject=Shopify Website Inquiry"
          className="service-cta__link"
        >
          LET'S DISCUSS
        </a>
      </section>
    </main>
  );
}
