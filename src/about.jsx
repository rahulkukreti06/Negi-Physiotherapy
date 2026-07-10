import { useEffect } from "react";
import './App.css';
import './about.css';

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

    <title>About Us | Negi Physiotherapy</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="about.css">
    <link rel="stylesheet" href="utility.css">

  Nothing here was dropped — just relocated. Depending on your setup:
    - Plain React (CRA/Vite, no router head management): add the stylesheet
      <link> tags to public/index.html <head>, and set
      <title>About Us | Negi Physiotherapy</title> there too.
    - If you use react-helmet / react-helmet-async or Next.js <Head>, drop
      the same tags into that instead.
    - The three CSS files (styles.css, about.css, utility.css) can also
      just be imported at the top of this file if you'd rather keep it
      self-contained, e.g.:
        import "./styles.css";
        import "./about.css";
        import "./utility.css";

  Everything else — every section, heading, paragraph, image, credential,
  testimonial, and the scroll-reveal script — is preserved below exactly as
  it was in the HTML.
*/

export default function AboutPage() {
  useEffect(() => {
    const header = document.getElementById('header');
    const utilityButtons = document.getElementById('utilityButtons');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (e.target.classList.contains('testi-card')) {
              e.target.classList.add('is-visible');
            } else {
              e.target.classList.add('visible');
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal, .testi-card").forEach((el) => io.observe(el));

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

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', scrollToTop);
    }

    const scrollToHashTarget = () => {
      if (!window.location.hash) return;

      const targetId = window.location.hash.slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToHashTarget);
    });

    return () => io.disconnect();
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

      <div className="abt-page">
        {/* ════════════════════════════════
             HERO
        ════════════════════════════════ */}
        <section
          className="abt-hero"
          style={{
            backgroundImage: `url('${imageSrc('12019-landscape-78058.jpg')}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <h1>Healing You Is Our Purpose</h1>
            <p>
              A trusted centre for orthopedic, neurological, and sports rehabilitation —
              combining advanced technology with personalised, compassionate care.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════
             ABOUT THE CLINIC
        ════════════════════════════════ */}
        <section className="abt-clinic">
          <div className="container">
            <div className="abt-split reveal">
              {/* Image side */}
              <div className="abt-img-wrap">
                <div className="abt-img-main">
                  <img src={imageSrc('clinic-photo.webp')} alt="Negi Physiotherapy Clinic interior" />
                  <div className="abt-img-badge">Est. 2009 · Kotdwara</div>
                </div>
                <div className="abt-img-accent">
                  <img src={imageSrc('clinic-photo-2.webp')} alt="Advanced treatment equipment" />
                </div>
             
              </div>

              {/* Text side */}
              <div className="abt-text-side">
                <div className="abt-label">About the Clinic</div>
                <h2 className="abt-title">
                  Where Recovery Meets
                  <br />
                  Modern Science
                </h2>
                <p>
                  Founded in 2009, Negi Physiotherapy Clinic has grown to become Kotdwara's most
                  trusted rehabilitation centre. We bring together evidence-based clinical
                  practice and state-of-the-art technology to deliver outcomes that genuinely
                  change lives.
                </p>
                <p>
                  From a young athlete recovering from a sports injury to an elderly patient
                  regaining independence after surgery — every patient who walks through our
                  doors receives a thorough assessment, a personalised treatment plan, and the
                  full attention of our clinical team.
                </p>
                <p>
                  Our clinic is equipped with the only European CE Certified Class IV Therapeutic
                  Laser in Kotdwar — a technology that places us at the frontier of non-surgical
                  pain management and tissue healing in the region.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
             MEET THE DOCTOR
        ════════════════════════════════ */}
        <section className="abt-doctor" id="meet-physiotherapist">
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "60px" }} className="reveal">
              <div className="abt-label light">Our Physiotherapist</div>
              <h2 className="abt-title light">Meet Your Physiotherapist</h2>
            </div>

            <div className="abt-doctor-split">
              {/* Photo side */}
              <div className="abt-doc-photo-wrap reveal">
                <div className="abt-doc-photo">
                  <img
                    src={imageSrc('WhatsApp Image 2026-06-18 at 7.19.03 AM.jpeg')}
                    alt="Dr. Mangesh Negi – Physiotherapist"
                  />
                </div>
                <div className="abt-doc-cred-card">
                  <strong>Dr. Mangesh Negi</strong>
                  <span>BPT · MPT · 15+ Years Experience</span>
                </div>
              </div>

              {/* Info side */}
              <div className="abt-doc-info reveal reveal-delay-1">
                <div className="abt-label light">
                  15 Years of Helping Patients Recover and Move Better
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "clamp(22px,3vw,34px)",
                    fontWeight: 500,
                    color: "#242323",
                    lineHeight: 1.15,
                    letterSpacing: "-.02em",
                    marginBottom: "20px",
                  }}
                >
                  Dedicated to Restoring
                  <br />
                  Movement &amp; Eliminating Pain
                </h3>

                <p>
                  With over 15 years of clinical experience, Dr. Mangesh Negi has built a
                  reputation as one of Uttarakhand's most trusted physiotherapists. He specialises
                  in orthopedic physiotherapy, sports rehabilitation, spinal care, and advanced
                  pain management — bringing a calm, thorough approach to every patient he treats.
                </p>
                <p>
                  Dr. Negi's philosophy is simple: understand the root cause, build a precise
                  plan, and guide the patient every step of the way. He has successfully treated
                  patients ranging from post-surgical recovery cases to elite athletes — always
                  prioritising long-term recovery over short-term relief.
                </p>

                <div className="abt-doc-stats">
                  <div className="abt-doc-stat">
                    <strong>15+</strong>
                    <span>Years of clinical experience</span>
                  </div>
                  <div className="abt-doc-stat">
                    <strong>40,000+</strong>
                    <span>Patients successfully treated</span>
                  </div>
                  <div className="abt-doc-stat">
                    <strong>12+</strong>
                    <span>Advanced treatment modalities</span>
                  </div>
                  <div className="abt-doc-stat">
                    <strong>CE</strong>
                    <span>Certified in Class IV Laser Therapy</span>
                  </div>
                </div>

                <div className="abt-doc-tags">
                  <span>Orthopedic & Neuro Rehab</span>
                  <span>Sports Injury Specialist</span>
                  <span>Advanced Laser Therapy</span>
                  <span>Spinal Care</span>
                  <span>Manual Therapy</span>
                  <span>Pain Management</span>
                </div>

                <ul className="abt-credentials">
                  <li>
                    <span className="cred-dot">🎓</span>
                    <span>
                      Bachelor of Physiotherapy (BPT) &amp; Master of Physiotherapy (MPT) — with
                      specialisation in musculoskeletal and sports rehabilitation
                    </span>
                  </li>
                  <li>
                    <span className="cred-dot">🏅</span>
                    <span>
                      Certified practitioner in Class IV High-Power Laser Therapy — European CE
                      Certified technology, the only one of its kind in Kotdwar
                    </span>
                  </li>
                  <li>
                    <span className="cred-dot">🦴</span>
                    <span>
                      Advanced training in chiropractic spinal manipulation, dry needling, IASTM,
                      and kinesiology taping techniques
                    </span>
                  </li>
                  <li>
                    <span className="cred-dot">⭐</span>
                    <span>
                      Highly rated across Google Reviews for patient outcomes, clear
                      communication, and genuine commitment to recovery
                    </span>
                  </li>
                  <li>
                    <span className="cred-dot">👩🏻‍⚕️</span>
                    <span>
                       Secialist in total knee or hip replacement rehab program or prehab exercises protocol
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="testi-section">
        <div className="testi-header">
          <span className="testi-eyebrow">Patient Stories</span>

          <h2 className="testi-heading">What Our Patients Say</h2>

          <p className="testi-sub">
            Real recovery stories from patients we've had the privilege to treat.
          </p>
        </div>

        <div className="testi-grid" id="testiGrid">
          <article className="testi-card">
            <div className="testi-quote">
              <svg viewBox="0 0 32 32">
                <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8zm18 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8z" />
              </svg>
            </div>

            <div className="testi-stars">
              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>
            </div>

            <p className="testi-text">
              I was suffering from neck pain due to bad posture. I visited Kotdwara
              Physiotherapy, where Negi sir treated me with great care and professionalism. He
              identified the root cause, guided me with correct posture and exercises, and
              motivated me throughout the recovery process. I have experienced significant relief
              and improvement. I am very satisfied with the treatment. Highly recommended.
            </p>

            <div className="testi-foot">
              <div className="testi-avatar">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
                </svg>
              </div>

              <div className="testi-name-wrap">
                <span className="testi-name">Suraj Vedwal</span>

                <span className="testi-badge">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Google Review
                </span>
              </div>
            </div>
          </article>

          <article className="testi-card">
            <div className="testi-quote">
              <svg viewBox="0 0 32 32">
                <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8zm18 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8z" />
              </svg>
            </div>

            <div className="testi-stars">
              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>
            </div>

            <p className="testi-text">
              Highly recommend! I was suffering from a slip disc in my neck and chronic lower back
              pain for a long time. Thanks to Dr. Mangesh Negi Sir's expert physiotherapy
              treatment and chiropractic sessions, I experienced significant relief and
              improvement in my mobility. He is knowledgeable, professional, and genuinely cares
              about his patients' recovery. I'm very grateful for the excellent care and results.
            </p>

            <div className="testi-foot">
              <div className="testi-avatar">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
                </svg>
              </div>

              <div className="testi-name-wrap">
                <span className="testi-name">Shiva Pandey</span>

                <span className="testi-badge">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Google Review
                </span>
              </div>
            </div>
          </article>

          <article className="testi-card">
            <div className="testi-quote">
              <svg viewBox="0 0 32 32">
                <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8zm18 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8z" />
              </svg>
            </div>

            <div className="testi-stars">
              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>

              <svg viewBox="0 0 20 20">
                <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
              </svg>
            </div>

            <p className="testi-text">
              Great help from Dr. Mangesh Negi. I was dealing with pain in my right glute from a
              strained muscle. He took the time to properly understand the issue, calmly treated
              it using his equipment, and gave me some great exercises to try at home. I couldn't
              visit again because of time constraints, but I highly recommend this clinic to
              anyone needing physiotherapy.
            </p>

            <div className="testi-foot">
              <div className="testi-avatar">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
                </svg>
              </div>

              <div className="testi-name-wrap">
                <span className="testi-name">Deep Dhoundiya</span>

                <span className="testi-badge">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Google Review
                </span>
              </div>
            </div>
          </article>
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