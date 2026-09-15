/**
 * Shared site header/footer, matching adamastechconsulting.com's live top bar and footer.
 * Injected via JS so both index.html and post.html stay in sync from one source.
 */
const CHEVRON_SVG = `<svg class="chevron" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ARROW_SVG = `<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 8.5L8.5 1.5M8.5 1.5H3M8.5 1.5V7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const CTA_BANNER_HTML = `
  <div class="cta-banner__inner">
    <svg class="cta-banner__pattern" viewBox="0 0 500 200" preserveAspectRatio="xMaxYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M560 -40C480 40 460 120 380 200" stroke="currentColor" stroke-width="1"/>
      <path d="M590 -40C510 40 490 120 410 200" stroke="currentColor" stroke-width="1"/>
      <path d="M620 -40C540 40 520 120 440 200" stroke="currentColor" stroke-width="1"/>
      <path d="M650 -40C570 40 550 120 470 200" stroke="currentColor" stroke-width="1"/>
      <path d="M680 -40C600 40 580 120 500 200" stroke="currentColor" stroke-width="1"/>
      <path d="M710 -40C630 40 610 120 530 200" stroke="currentColor" stroke-width="1"/>
      <path d="M740 -40C660 40 640 120 560 200" stroke="currentColor" stroke-width="1"/>
      <path d="M770 -40C690 40 670 120 590 200" stroke="currentColor" stroke-width="1"/>
    </svg>
    <div class="cta-banner__content">
      <p class="cta-banner__eyebrow">Our Team</p>
      <h2>Our professional experts</h2>
      <p>we believe in transparency as the foundation of trust with our clients.</p>
    </div>
    <a href="https://adamastechconsulting.com/contact/" class="btn btn-primary cta-banner__action">Book an appointment with our experts now</a>
  </div>
`;

const HEADER_HTML = `
  <div class="site-header__inner">
    <a href="https://adamastechconsulting.com" class="site-header__logo">
      <img src="assets/logo-header.webp" alt="Adamas Tech Consulting" />
    </a>
    <nav class="site-header__nav">
      <a href="https://adamastechconsulting.com/">Home</a>
      <a href="https://adamastechconsulting.com/about-us">About Us</a>
      <div class="nav-dropdown">
        <button class="nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false">Products ${CHEVRON_SVG}</button>
        <div class="nav-dropdown__menu">
          <a href="https://arivoo.in/arivoo-ums" target="_blank" rel="noopener">Arivoo UMS</a>
          <a href="https://arivoo.in/arivoo-sms" target="_blank" rel="noopener">Arivoo SMS</a>
          <a href="https://arivoo.in/arivoo-lms" target="_blank" rel="noopener">Arivoo LMS</a>
          <a href="https://arivoo.in/testguard" target="_blank" rel="noopener">TestGUARD</a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button class="nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false">Services ${CHEVRON_SVG}</button>
        <div class="nav-dropdown__menu">
          <a href="https://adamastechconsulting.com/aws-solutions-old/">AWS Services</a>
          <a href="https://adamastechconsulting.com/sap-solution-consulting/">SAP Solutions &amp; Consulting</a>
          <a href="https://adamastechconsulting.com/ai-data-analytics/">AI/ML &amp; Data Analytics</a>
          <a href="https://adamastechconsulting.com/data-science-analytics/">Data Science &amp; Analytics</a>
          <a href="https://adamastechconsulting.com/application-development/">Application Development</a>
        </div>
      </div>
      <a href="https://adamastechconsulting.com/consulting/">Consulting</a>
    </nav>
    <div class="site-header__right">
      <a href="tel:+91-6296680677" class="site-header__call">
        <span class="site-header__call-label">Call Us ${ARROW_SVG}</span>
        <span class="site-header__call-number">+91-6296680677</span>
      </a>
      <a href="https://adamastechconsulting.com/contact/" class="btn btn-primary">Contact Us</a>
    </div>
  </div>
`;

const FOOTER_HTML = `
  <div class="site-footer__top">
    <div class="site-footer__brand">
      <a href="https://adamastechconsulting.com/">
        <img src="assets/logo-footer.png" alt="Adamas Tech Consulting" />
      </a>
      <p>We provide the expertise and support to propel your business forward.</p>
    </div>
    <div class="site-footer__cta">
      <h3>Let's get started on something great</h3>
      <p>Our team of IT experts looks forward to meeting with you and providing valuable insights tailored to your business.</p>
      <a href="https://adamastechconsulting.com/contact/" class="btn btn-primary">Get an appointment now</a>
      <div class="site-footer__stats">
        <div><strong>5 Mins</strong><span>Response Time</span></div>
        <div><strong>99%</strong><span>Client Satisfaction</span></div>
        <div><strong>26.8k Hours</strong><span>Field Experience</span></div>
      </div>
    </div>
  </div>

  <div class="site-footer__columns">
    <div>
      <h4>Services</h4>
      <a href="https://adamastechconsulting.com/aws-solutions-old/">AWS Solutions</a>
      <a href="https://adamastechconsulting.com/ai-data-analytics/">AI/ML &amp; Data Analytics</a>
      <a href="https://adamastechconsulting.com/sap-solution-consulting/">SAP Solutions &amp; Consulting</a>
      <a href="https://adamastechconsulting.com/openedx/">Open edX&reg; Platform Services</a>
      <a href="https://adamastechconsulting.com/technology-transformation/">Technology Transformation</a>
      <a href="https://adamastechconsulting.com/master-data-governance/">Master Data Governance</a>
      <a href="https://adamastechconsulting.com/data-science-analytics/">Data Science &amp; Analytics</a>
      <a href="https://adamastechconsulting.com/e-invoicing-uae/">UAE E-invoicing</a>
      <a href="https://adamastechconsulting.com/application-development/">Application Development</a>
      <a href="https://adamastechconsulting.com/consulting/">Consulting</a>
    </div>
    <div>
      <h4>Company</h4>
      <a href="https://adamastechconsulting.com/about-us/">About Us</a>
      <a href="https://adamastechconsulting.com/terms-of-use/">Terms of use</a>
      <a href="https://adamastechconsulting.com/privacy-policy/">Privacy Policy</a>
      <a href="https://adamastechconsulting.com/clients/">Clients</a>
    </div>
    <div>
      <h4>Products</h4>
      <a href="https://arivoo.in/arivoo-sms">Arivoo SMS</a>
      <a href="https://arivoo.in/arivoo-lms">Arivoo LMS</a>
      <a href="https://arivoo.in/arivoo-ums">Arivoo UMS</a>
      <a href="https://arivoo.in/testguard">TestGUARD</a>
    </div>
    <div>
      <h4>Mobile</h4>
      <a href="tel:+91-6296680677">+91-6296680677</a>
      <h4 class="mt">Mail</h4>
      <a href="mailto:marketing@adamastech.in">marketing@adamastech.in</a>
    </div>
  </div>

  <div class="site-footer__bottom">
    <ul class="site-footer__social">
      <li><a href="https://www.facebook.com/AdamasTechConsulting/" aria-label="Facebook" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>
      </a></li>
      <li><a href="https://www.linkedin.com/company/adamas-tech-consulting/" aria-label="LinkedIn" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
      </a></li>
    </ul>
    <p>&copy; ${new Date().getFullYear()} Adamas Tech Consulting Pvt. Ltd. All Rights Reserved.</p>
  </div>
`;

function injectLayout() {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  const ctaEl = document.getElementById("cta-banner");
  if (headerEl) headerEl.innerHTML = HEADER_HTML;
  if (footerEl) footerEl.innerHTML = FOOTER_HTML;
  if (ctaEl) ctaEl.innerHTML = CTA_BANNER_HTML;

  document.querySelectorAll(".nav-dropdown__toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = btn.closest(".nav-dropdown");
      const isOpen = dropdown.classList.contains("is-open");
      document.querySelectorAll(".nav-dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
      if (!isOpen) dropdown.classList.add("is-open");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
  });
}

document.addEventListener("DOMContentLoaded", injectLayout);
