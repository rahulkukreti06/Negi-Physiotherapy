import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './images/logo.png';
import heroVideo from './images/13824736_3840_2160_60fps (1) (1) (1).mp4';
import introImage from './images/12019-landscape-78058.jpg';
import treatmentLaser from './images/laser-therapy.jpg';
import treatmentChiropractic from './images/images.jpg';
import treatmentDryNeedling from './images/dry-needling.jpg';
import treatmentSportsInjury from './images/sports-injury.jpg';
import treatmentCupping from './images/cupping-therapy.jpg';
import treatmentGeriatric from './images/Geriatric Physiotherapy.jpeg';
import physioProfile from './images/WhatsApp Image 2026-06-18 at 7.19.03 AM.jpeg';
import conditionBackPain from './images/660d2946680a0Modern Techniques For Back Pain Treatment.webp';
import conditionSportsInjuries from './images/common-sports-injuries.jpg';
import conditionNeckPain from './images/images (2).jpg';
import conditionKneePain from './images/knee-pain.webp';
import conditionFrozenShoulder from './images/frozen-shoulder.jpg';
import conditionSciatica from './images/sciatica.webp';
import conditionTennisElbow from './images/tennis-elbow.jpg';

const WhyIcon = ({ type }) => {
  switch (type) {
    case 'experience':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8.5" r="4" />
          <path d="M9.4 12.1 8 20l4-2 4 2-1.4-7.9" />
        </svg>
      );
    case 'equipment':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9v6M7 7v10M17 7v10M20 9v6" />
          <path d="M7 12h10" />
        </svg>
      );
    case 'plan':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="4" width="10" height="16" rx="2" />
          <path d="M9 7h6M9 11h6M9 15h3" />
        </svg>
      );
    case 'recovery':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12a8 8 0 1 1-2.4-5.7" />
          <path d="M20 4v6h-6" />
        </svg>
      );
    case 'care':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-6-3.8-8-8.1C2.5 9.6 4.4 7 7.4 7c1.7 0 3 1 3.6 2.1C11.6 8 12.9 7 14.6 7c3 0 5 2.6 3.4 5.9C18 17.2 12 21 12 21z" />
        </svg>
      );
    case 'techniques':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 3 6.5 13H12l-1 8 6.5-10H12z" />
        </svg>
      );
    case 'therapist':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3" />
          <path d="M5.5 19c1.5-3.6 4.1-5 6.5-5s5 1.4 6.5 5" />
          <path d="M17.5 9.5h3M19 8v3" />
        </svg>
      );
    default:
      return null;
  }
};

export default function NegiPhysiotherapy() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const header = document.getElementById('header');
    const utilityButtons = document.getElementById('utilityButtons');
    const animatedElements = document.querySelectorAll(
      '.creds-card, .treat-card, .physio-card, .cond-card, .why-item, .testi-card'
    );

    const updateScrollState = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }

      if (utilityButtons) {
        utilityButtons.classList.toggle('visible', window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', updateScrollState);
    updateScrollState();

    let observer;

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement.children);
            const idx = siblings.indexOf(entry.target);

            entry.target.style.transitionDelay = `${idx * 110}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      animatedElements.forEach((element) => observer.observe(element));
    } else {
      animatedElements.forEach((element) => element.classList.add('is-visible'));
    }

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="site-wrapper">
      {/* HEADER SECTION */}
      <header id="header">
        <div className="header-container">
          <div className="logo-section">
            <img
              src={logo}
              alt="Negi Physiotherapy Logo"
              className="logo"
            />
            <div className="logo-text">
              <h1>Negi Physiotherapy Clinic</h1>
              <p>Ortho & Neuro Rehab Center</p>
            </div>
          </div>

          <nav className="nav-center">
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </nav>

          <div className="header-right">
            <a href="#book" className="book-now-btn">Book Now</a>
            <div 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
              onClick={toggleMobileMenu}
              style={{ cursor: 'pointer' }}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
          <ul className="mobile-nav-links">
            <li><a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
            <li><a href="/services" onClick={() => setIsMobileMenuOpen(false)}>Services</a></li>
            <li><a href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</a></li>
            <li><a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
            <li><a href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</a></li>
            <li>
              <a href="#book" className="book-now-btn mobile-book-btn" onClick={() => setIsMobileMenuOpen(false)}>
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-content">
          <h1>Your Journey to a Pain-Free Life Starts Here.</h1>
          <button className="hero-cta">
            <a href="#services" style={{ textDecoration: 'none', color: 'inherit' }}>Get Started</a>
          </button>
        </div>
      </section>

      {/* CREDENTIALS SECTION */}
      <section className="creds-section">
        <div className="creds-header">
          <span className="creds-eyebrow">Helping You Move Better, Recover Faster.</span>
          <h2 className="creds-heading">
            Clinical expertise, <span>built like precision equipment.</span>
          </h2>
        </div>

        <div className="creds-grid" id="credsGrid">
          <article className="creds-card">
            <div className="badge">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
            </div>
            <h3 className="card-title">15+ Years Experience</h3>
            <p className="card-sub">
              Two decades of clinical practice refining how we assess, treat, and rebuild.
            </p>
            <div className="card-rule"></div>
          </article>

          <article className="creds-card">
            <div className="badge">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
                <path d="M9 12.5 11 14.5 15.5 10" />
              </svg>
            </div>
            <h3 className="card-title">CE-Certified Technology</h3>
            <p className="card-sub">
              Diagnostic and therapeutic devices held to strict EU safety and performance standards.
            </p>
            <div className="card-rule"></div>
          </article>

          <article className="creds-card">
            <div className="badge">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h4l2 6 4-12 2 6h4" />
              </svg>
            </div>
            <h3 className="card-title">Personalized Treatment Plans</h3>
            <p className="card-sub">
              Every treatment plan is tailored to your condition, lifestyle, and recovery goals.
            </p>
            <div className="card-rule"></div>
          </article>

          <article className="creds-card">
            <div className="badge">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="4.5" r="1.6" />
                <path d="M9 21l1.5-6.5L8 12l1.5-4 3 1.5L15 8l2 2-2.5 2.5L16 21" />
              </svg>
            </div>
            <h3 className="card-title">Sports Injury &amp; Rehabilitation Experts</h3>
            <p className="card-sub">
              Specialist care from initial assessment through to full return to performance.
            </p>
            <div className="card-rule"></div>
          </article>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="intro" id="about">
        <div className="intro-content">
          <h1>PATIENT-CENTERED CARE</h1>
          <h2>Expert Guidance at Every Step.</h2>
          <h3>
            From your first consultation to full recovery, our evidence based approach ensures you receive the 
            right treatment, exercises, and support throughout your healing journey.
          </h3>
          <hr />
          <p>
            <strong>1000+ patients treated.</strong> Trusted care. Lasting results.
          </p>
        </div>
        <div className="intro-image">
          <img src={introImage} alt="Physiotherapy Session" />
        </div>
      </section>

      {/* FEATURED TREATMENTS SECTION */}
      <section className="treat-section" id="services">
        <div className="treat-header">
          <span className="treat-eyebrow">Featured Treatments</span>
          <h2 className="treat-heading">Advanced Treatments for Faster Recovery</h2>
          <p className="treat-sub">
            From sports injuries and chronic pain to postural correction and rehabilitation, we offer evidence-based 
            treatments tailored to your recovery goals.
          </p>
        </div>

        <div className="treat-grid" id="treatGrid">
          {[
            { img: treatmentLaser, title: "Advanced Class IV Laser Therapy", desc: "Deep tissue laser treatment that accelerates healing and reduces inflammation at the cellular level." },
            { img: treatmentChiropractic, title: "Chiropractic Adjustment", desc: "Precise spinal and joint adjustments that restore alignment, mobility, and nervous system function." },
            { img: treatmentDryNeedling, title: "Dry Needling", desc: "Targeted needle therapy that releases muscle tension and trigger points for faster pain relief." },
            { img: treatmentSportsInjury, title: "Sports Injury Rehabilitation", desc: "Structured recovery programs that rebuild strength and get athletes back to peak performance." },
            { img: treatmentCupping, title: "Cupping Therapy", desc: "Suction-based therapy that improves circulation, relieves tightness, and speeds tissue recovery." },
            { img: treatmentGeriatric, title: "Geriatric Physiotherapy", desc: "Gentle, age-appropriate care focused on mobility, balance, and independent living." }
          ].map((item, idx) => (
            <article className="treat-card" key={idx}>
              <div className="treat-media">
                <img className="treat-img" src={item.img} alt={item.title} />
              </div>
              <div className="treat-body">
                <h3 className="treat-title">{item.title}</h3>
                <p className="treat-desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PHYSIOTHERAPIST PROFILE SECTION */}
      <section className="physio-section">
        <div className="physio-card" id="physioCard">
          <div className="physio-image">
            <div className="placeholder-icon">
              <img
                src={physioProfile}
                alt="Dr. Mangesh Negi"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="physio-content">
            <span className="physio-label">Meet Your Physiotherapist</span>
            <h2 className="physio-heading">15 Years of Helping Patients Recover and Move Better</h2>
            <p className="physio-desc">
              With over 15 years of clinical experience, Dr. Mangesh Negi specializes in orthopedic physiotherapy, 
              sports rehabilitation, spinal care, and advanced pain management techniques. His patient-first approach 
              focuses on identifying the root cause of pain and creating personalized recovery plans that deliver lasting results.
            </p>
            <hr className="physio-divider" />
            <ul className="physio-stats">
              <li><strong>15+ Years</strong> <span>Experience</span></li>
              <li><strong>Orthopedic &amp; Neuro</strong> <span>Rehab</span></li>
              <li><strong>Advanced Laser</strong> <span>Therapy</span></li>
              <li><strong>Sports Injury</strong> <span>Specialist</span></li>
            </ul>
            <a href="/about#meet-physiotherapist" className="physio-btn">
              Learn More About Dr. Mangesh Negi
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CONDITIONS WE TREAT SECTION */}
      <section className="cond-section">
        <div className="cond-header">
          <span className="cond-eyebrow">Conditions We Treat</span>
          <h2 className="cond-heading">Comprehensive Care for What's Holding You Back</h2>
          <p className="cond-sub">
            From everyday discomfort to complex sports injuries, our treatment plans are built around your specific condition.
          </p>
        </div>

        <div className="cond-grid" id="condGrid">
          {[
            { code: 'cond-a', img: conditionBackPain, label: 'Back Pain', path: <path d="M12 3v18" /> },
            { code: 'cond-b', img: conditionSportsInjuries, label: 'Sports Injuries', path: <path d="M9 21l1.5-6.5L8 12l1.5-4 3 1.5L15 8l2 2-2.5 2.5L16 21" /> },
            { code: 'cond-c', img: conditionNeckPain, label: 'Neck Pain', path: <path d="M9 18c0-3 1.5-5 3-5s3 2 3 5" /> },
            { code: 'cond-d', img: conditionKneePain, label: 'Knee Pain', path: <path d="M9 4v7l-3 9M15 4v7l3 9" /> },
            { code: 'cond-e', img: conditionFrozenShoulder, label: 'Frozen Shoulder', path: <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11" /> },
            { code: 'cond-f', img: conditionSciatica, label: 'Sciatica', path: <path d="M13 2 6 13h5l-2 9 9-13h-6l2-7z" /> },
            { code: 'cond-g', img: conditionTennisElbow, label: 'Tennis Elbow', path: <path d="M12.5 12.5 19 19" /> }
          ].map((cond, idx) => (
            <article className={`cond-card ${cond.code}`} key={idx}>
              <img className="cond-img" src={cond.img} alt={cond.label} />
              <div className="cond-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  {cond.path}
                  {cond.label === 'Back Pain' && (
                    <>
                      <circle cx="12" cy="7" r="1.4" />
                      <circle cx="12" cy="12" r="1.4" />
                      <circle cx="12" cy="17" r="1.4" />
                    </>
                  )}
                  {cond.label === 'Sports Injuries' && <circle cx="12" cy="4.5" r="1.6" />}
                  {cond.label === 'Neck Pain' && <circle cx="12" cy="6" r="3" />}
                  {cond.label === 'Knee Pain' && <circle cx="12" cy="11" r="2" />}
                  {cond.label === 'Tennis Elbow' && <circle cx="9" cy="9" r="5" />}
                </svg>
              </div>
              <div className="cond-label">{cond.label}</div>
            </article>
          ))}
        </div>

        <div className="cond-cta">
          <a href="/services#conditions-we-treat" className="cond-btn">
            See More Treatments
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="why-section">
        <div className="why-card">
          <div className="why-header">
            <h2 className="why-heading">Why Choose Us</h2>
            <div className="why-underline"></div>
            <p className="why-sub">
              Negi Physiotherapy Clinic – Ortho &amp; Neuro Rehab Center is dedicated to restoring mobility, reducing 
              pain, and improving quality of life through structured and patient-focused physiotherapy.
            </p>
          </div>

          <div className="why-grid" id="whyGrid">
            {[
              { title: "15+ Years Experience", desc: "Result-focused care in ortho & neuro rehab.", icon: 'experience' },
              { title: "Advanced Equipment", desc: "Evidence-based therapies with clinical indications.", icon: 'equipment' },
              { title: "Personalized Plan", desc: "Each patient gets condition-specific progression.", icon: 'plan' },
              { title: "Fast Recovery Focus", desc: "Structured sessions + practical home guidance.", icon: 'recovery' },
              { title: "Personalized Treatment", desc: "We assess each patient individually and create recovery programs aligned with clinical needs.", icon: 'care' },
              { title: "Advanced Techniques", desc: "From manual therapy to modern rehabilitation protocols, we use evidence-based techniques.", icon: 'techniques' },
              { title: "Experienced Therapist", desc: "Hands-on clinical expertise in orthopedic pain, neurological rehabilitation, and post-surgical recovery.", icon: 'therapist' }
            ].map((why, idx) => (
              <div className="why-item" key={idx}>
                <div className="why-icon">
                  <WhyIcon type={why.icon} />
                </div>
                <h3 className="why-title">{why.title}</h3>
                <p className="why-desc">{why.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testi-section">
        <div className="testi-header">
          <span className="testi-eyebrow">Patient Stories</span>
          <h2 className="testi-heading">What Our Patients Say</h2>
          <p className="testi-sub">Real recovery stories from patients we've had the privilege to treat.</p>
        </div>

        <div className="testi-grid" id="testiGrid">
          {[
            {
              name: "Suraj Vedwal",
              text: "I was suffering from neck pain due to bad posture. I visited Kotdwara Physiotherapy, where Negi sir treated me with great care and professionalism. He identified the root cause, guided me with correct posture and exercises, and motivated me throughout. Highly recommended."
            },
            {
              name: "Shiva Pandey",
              text: "Highly recommend! I was suffering from a slip disc in my neck and chronic lower back pain for a long time. Thanks to Dr. Mangesh Negi Sir's expert physiotherapy treatment and chiropractic sessions, I experienced significant relief. He genuinely cares."
            },
            {
              name: "Deep Dhoundiya",
              text: "Great help from Dr. Mangesh Negi. I was dealing with pain in my right glute from a strained muscle. He took the time to properly understand the issue, calmly treated it using his equipment, and gave me some great exercises to try at home."
            }
          ].map((testi, idx) => (
            <article className="testi-card" key={idx}>
              <div className="testi-quote">
                <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
                  <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8zm18 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c0-4.4-3.6-8-8-8 0-4.4 3.6-8 8-8z" />
                </svg>
              </div>
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style={{ color: '#f59e0b' }}>
                    <path d="M10 1l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3 1.4-6.3-4.8-4.3 6.4-.6z" />
                  </svg>
                ))}
              </div>
              <p className="testi-text">{testi.text}</p>
              <div className="testi-foot">
                <div className="testi-avatar">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="3.4" />
                    <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
                  </svg>
                </div>
                <div className="testi-name-wrap">
                  <span className="testi-name">{testi.name}</span>
                  <span className="testi-badge">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '4px' }}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Verified Google Review
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* APPOINTMENT FORM HERO SECTION */}
      <section className="np-hero" id="contact">
        <div className="np-hero__bg"></div>
        <div className="np-hero__overlay"></div>
        <div className="np-hero__container">
          <div className="np-hero__content">
            <div className="np-hero__badge">
              <span className="np-hero__star">★</span> Rated 4.8/5 by 200+ Patients in Kotdwara
            </div>
            <h1 className="np-hero__title">Best Physiotherapy<br />Clinic in Kotdwara</h1>
            <p className="np-hero__subtitle">Pain Relief in 5&ndash;10 Sessions | Expert Ortho &amp; Neuro Care</p>
            <p className="np-hero__desc">
              Stop delaying recovery. Get a personalized treatment plan for back pain, neck pain, sports injury, stroke rehab, 
              and post-surgery recovery from Dr. Mangesh Negi (BPT, MPT).
            </p>
            <div className="np-hero__cta-row">
              <a href="#book" className="np-btn np-btn--primary">Book Appointment</a>
              <a href="tel:918219652502" className="np-btn np-btn--ghost">Call Now</a>
              <a href="https://wa.me/918219652502" target="_blank" rel="noreferrer" className="np-btn np-btn--outline">WhatsApp Now</a>
            </div>
          </div>

          <div className="np-hero__form-card" id="book">
            <h2 className="np-hero__form-title">Book Your Physiotherapy Consultation</h2>
            <p className="np-hero__form-sub">Share your details and pain area. Our team will call and help you choose the right plan.</p>
            
            <form className="np-hero__form" action="https://formspree.io/f/xrewlekl" method="POST">
              <input type="hidden" name="_subject" value="New Lead - Negi Physiotherapy Clinic" />
              <input className="np-input" type="text" name="name" placeholder="Full Name" required />
              <input className="np-input" type="tel" name="phone" placeholder="10-digit mobile" pattern="[0-9]{10}" maxLength={10} required />
              <textarea className="np-input np-textarea" name="problem" placeholder="Your main problem" rows={3}></textarea>
              <button type="submit" className="np-btn np-btn--submit">Request Appointment</button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
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
    </div>
  );
}