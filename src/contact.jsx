import { useEffect } from "react";
import './App.css';
import './contact.css';

const imageModules = import.meta.glob('./images/*', {
  eager: true,
  import: 'default',
});

const imageSrc = (fileName) => imageModules[`./images/${fileName}`];

/*
  NOTE ON HEAD TAGS
  ------------------
  The original file's <head> contained page-level tags that don't belong
  inside a React component (they configure the document, not the page body):

    <title>Contact us | Negi Physiotherapy</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="contact.css">
    <link rel="stylesheet" href="utility.css">

  Nothing here was dropped — just relocated. Depending on your setup:
    - Plain React (CRA/Vite, no router head management): add the stylesheet
      <link> tags to public/index.html <head>, and set
      <title>Contact us | Negi Physiotherapy</title> there too.
    - If you use react-helmet / react-helmet-async or Next.js <Head>, drop
      the same tags into that instead.
    - The three CSS files (styles.css, contact.css, utility.css) can also
      just be imported at the top of this file if you'd rather keep it
      self-contained, e.g.:
        import "./styles.css";
        import "./contact.css";
        import "./utility.css";

  FORM NOTE
  ---------
  The Formspree <form> is left as a plain HTML form (action="https://formspree.io/f/xrewlekl"
  method="POST") rather than converted to a controlled React form with onSubmit/useState.
  This preserves the original behaviour exactly: a normal browser POST to Formspree with a
  redirect back to contact.html?success=true, no JavaScript required for it to work. All
  field names, the honeypot, and the hidden _next redirect are unchanged.

  Everything else — every section, card, label, and the scroll-reveal / success-banner
  script — is preserved below exactly as it was in the HTML.
*/

export default function ContactPage() {
  useEffect(() => {
    const header = document.getElementById('header');
    const utilityButtons = document.getElementById('utilityButtons');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const mobileBookBtn = document.querySelector('.mobile-book-btn');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    /* Scroll reveal */
    const revealEls = document.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));

    const syncChrome = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }

      if (utilityButtons) {
        utilityButtons.classList.toggle('visible', window.scrollY > 300);
      }
    };

    const closeMobileMenu = () => {
      if (!mobileMenu || !hamburger) return;

      mobileMenu.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    };

    const toggleMobileMenu = () => {
      if (!mobileMenu || !hamburger) return;

      mobileMenu.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');

      if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', syncChrome);
    syncChrome();

    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    if (mobileBookBtn) {
      mobileBookBtn.addEventListener('click', closeMobileMenu);
    }

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', scrollToTop);
    }

    /* Show success banner if redirected back from Formspree */
    if (window.location.search.includes("success=true")) {
      const banner = document.getElementById("successBanner");

      if (banner) banner.style.display = "flex";

      window.scrollTo({
        top: document.querySelector(".form-col").offsetTop - 40,
        behavior: "smooth",
      });
    }

    return () => {
      window.removeEventListener('scroll', syncChrome);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <header id="header">
        <div className="header-container">
          <div className="logo-section">
            <img src={imageSrc('logo.png')} alt="Negi Physiotherapy Logo" className="logo" />

            <div className="logo-text">
              <h1>Negi Physiotherapy Clinic</h1>

              <p style={{ color: "#525151" }}>Ortho & Neuro Rehab Center</p>
            </div>
          </div>

          <nav className="nav-center">
            <ul className="nav-links">
              <li>
                <a href="/">Home</a>
              </li>

              <li>
                <a href="/services">Services</a>
              </li>

              <li>
                <a href="/about">About Us</a>
              </li>

              <li>
                <a href="/contact">Contact</a>
              </li>

              <li>
                <a href="/blog">Blog</a>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <a href="/contact" className="book-now-btn">
              Book Now
            </a>

            <div className="hamburger">
              <span></span>

              <span></span>

              <span></span>
            </div>
          </div>
        </div>

        <div className="mobile-menu">
          <ul className="mobile-nav-links">
            <li>
              <a href="/">Home</a>
            </li>

            <li>
              <a href="/services">Services</a>
            </li>

            <li>
              <a href="/about">About Us</a>
            </li>

            <li>
              <a href="/contact">Contact</a>
            </li>

            <li>
              <a href="/blog">Blog</a>
            </li>

            <li>
              <a href="/contact" className="book-now-btn mobile-book-btn">
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </header>

      <section className="hero2">
        <h1>Contact Us</h1>

        <p className="hero-sub">Book a session, ask a question, or find your way to the clinic.</p>

        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>

          <span>/</span>

          <span>Contact</span>
        </nav>
      </section>

      {/* MAIN CONTACT GRID */}
      <section className="main-section">
        <div className="contact-grid">
          {/* LEFT: INFO CARDS */}
          <div className="info-col">
            <div className="info-header reveal">
              <div className="section-tag">Get in Touch</div>

              <h2>We're here to help you recover</h2>

              <p>
                Visit us at the clinic or reach out before your first appointment — we'll guide
                you through the process.
              </p>
            </div>

            <div className="info-cards">
              {/* Phone */}
              <div className="info-card reveal">
                <div className="ic-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 5.58 5.58l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>

                <div className="ic-body">
                  <div className="ic-label">Telephone</div>

                  <div className="ic-val">
                    <a href="tel:+918219652502">+91 82196 52502</a>
                    <br />
                    <a href="tel:+919719604206">+91 97196 04206</a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="info-card reveal">
                <div className="ic-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <div className="ic-body">
                  <div className="ic-label">Address</div>

                  <div className="ic-val">
                    Malviya Udhyan, Near Nagar Nigam Office,
                    <br />
                    Kotdwara, Uttarakhand 246149
                  </div>
                </div>
              </div>

              {/* Clinic Timings */}
              <div className="info-card reveal">
                <div className="ic-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>

                <div className="ic-body">
                  <div className="ic-label">Clinic Timings</div>

                  <div className="ic-val">
                    <div className="timing-rows">
                      <div className="timing-row">
                        <span className="timing-season">Summer:</span>

                        <span className="timing-time">
                          9:00 AM – 1:00 PM &nbsp;·&nbsp; 4:00 PM – 8:00 PM
                        </span>
                      </div>

                      <div className="timing-row">
                        <span className="timing-season">Winter:</span>

                        <span className="timing-time">
                          10:00 AM – 1:00 PM &nbsp;·&nbsp; 3:00 PM – 6:00 PM
                        </span>
                      </div>

                      <div className="timing-row">
                        <span className="timing-season">Sunday:</span>

                        <span className="timing-time">9:00 AM – 2:00 PM</span>
                      </div>
                    </div>

                    <div className="timing-note" style={{ marginTop: "10px" }}>
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Appointment required for all clinic timings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="form-col reveal">
            <div className="form-header">
              <h2>Send a Message</h2>

              <p>Fill in the form and we'll get back to you within one business day.</p>
            </div>

            {/* SUCCESS BANNER (shown after Formspree redirects with ?success) */}
            <div className="success-banner" id="successBanner">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Message sent! We'll be in touch shortly.
            </div>

            {/*
              FORMSPREE: Replace YOUR_FORM_ID below with your Formspree endpoint.
              e.g. action="https://formspree.io/f/xyzwabcd"
            */}
            <form action="https://formspree.io/f/xrewlekl" method="POST">
              {/* Formspree honeypot spam filter */}
              <input type="text" name="_gotcha" style={{ display: "none" }} />

              {/* Redirect back to this page after submit */}
              <input type="hidden" name="_next" value="/contact?success=true" />

              <div className="form-row">
                <div className="field">
                  <label htmlFor="fname">Full Name</label>

                  <input type="text" id="fname" name="name" placeholder="Your full name" required />
                </div>

                <div className="field">
                  <label htmlFor="femail">Email Address</label>

                  <input
                    type="email"
                    id="femail"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="fphone">Phone Number</label>

                <input type="tel" id="fphone" name="phone" placeholder="+91 98765 43210" />
              </div>

              <div className="field">
                <label htmlFor="fsubject">Subject</label>

                <input
                  type="text"
                  id="fsubject"
                  name="subject"
                  placeholder="e.g. Book an appointment"
                />
              </div>

              <div className="field">
                <label htmlFor="fmessage">Message</label>

                <textarea
                  id="fmessage"
                  name="message"
                  placeholder="Tell us briefly about your condition or query…"
                  required
                ></textarea>
              </div>

              <div className="form-divider"></div>

              <button type="submit" className="btn-submit">
                Send Message
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>

              <div className="form-privacy">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your information is kept private and never shared.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="map-section">
        <div className="map-header reveal">
          <div>
            <h3>Find the Clinic</h3>
            <p>Malviya Udhyan, Near Nagar Nigam Office, Kotdwara, Uttarakhand</p>
          </div>
        </div>

        <div className="map-wrapper reveal">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3134.8011768364286!2d78.52169369999999!3d29.7467433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39097dab340f647d%3A0x59f6120e4b5f503b!2sNegi%20Physiotherapy%20clinic%20ortho%20and%20neuro%20rehab%20center!5e1!3m2!1sen!2sin!4v1782109582582!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Negi Physiotherapy Clinic Location"
          ></iframe>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h2>Negi Physiotherapy Clinic</h2>

            <p className="footer-tagline">Ortho & Neuro Rehab Center</p>

            <p>
              Personalized physiotherapy care for pain relief, mobility, sports injuries,
              post-surgery recovery, and neuro rehabilitation in Kotdwara.
            </p>
          </div>

          <div className="footer-contact">
            <h3>Contact</h3>

            <ul>
              <li>
                <span className="footer-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 0 1 18 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>

                <span>Malviya Udhyan, Near Nagar Nigam Office, Kotdwara, Uttarakhand 246149</span>
              </li>

              <li>
                <span className="footer-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.62a16 16 0 0 0 6.29 6.29l1.19-1.19a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>

                <span>
                  <a href="tel:+918219652502">+91 82196 52502</a>
                  <br />
                  <a href="tel:+919719604206">+91 97196 04206</a>
                </span>
              </li>
            </ul>
          </div>

          <div className="footer-visit">
            <h3>Visit Us</h3>

            <ul>
              <li>
                <span className="footer-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>

                <span>Summer: 9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM</span>
              </li>

              <li>
                <span className="footer-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>

                <span>Winter: 10:00 AM - 1:00 PM, 3:00 PM - 6:00 PM</span>
              </li>

              <li>
                <span className="footer-icon">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                    <path d="m9 16 2 2 4-5" />
                  </svg>
                </span>

                <span>Sunday: 9:00 AM - 2:00 PM. Appointment required.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; Negi Physiotherapy Clinic. All rights reserved.</p>
        </div>
      </footer>

      {/* Utility Buttons */}
      <div className="utility-buttons" id="utilityButtons">
        <button 
          className="scroll-top-btn" 
          id="scrollTopBtn" 
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <a
          href="https://wa.me/918219652502"
          className="whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact via WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </>
  );
}