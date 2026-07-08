import { useEffect, useState } from "react";
import "./services.css";
import './App.css';
import './script.js';
import './utility.css'

const imageModules = import.meta.glob('./images/*', {
  eager: true,
  import: 'default',
});

const imageSrc = (fileName) => imageModules[`./images/${fileName}`];

export default function ServicesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const header = document.getElementById('header');
    const utilityButtons = document.getElementById('utilityButtons');

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const cards = document.querySelectorAll(".np-cond-card");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = (parseInt(entry.target.dataset.delay || "0") % 6) * 70;
            setTimeout(() => entry.target.classList.add("np-vis"), delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    cards.forEach((c) => obs.observe(c));

    const syncChrome = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }

      if (utilityButtons) {
        utilityButtons.classList.toggle('visible', window.scrollY > 300);
      }
    };

    const scrollToHashTarget = () => {
      if (!window.location.hash) return;

      const targetId = window.location.hash.slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('scroll', syncChrome);
    syncChrome();

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToHashTarget);
    });

    return () => {
      io.disconnect();
      obs.disconnect();
      window.removeEventListener('scroll', syncChrome);
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
            <a href="contact.html" className="book-now-btn">
              Book Now
            </a>

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

        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
          <ul className="mobile-nav-links">
            <li>
              <a href="/" onClick={closeMobileMenu}>Home</a>
            </li>

            <li>
              <a href="/services" onClick={closeMobileMenu}>Services</a>
            </li>

            <li>
              <a href="/about" onClick={closeMobileMenu}>About Us</a>
            </li>

            <li>
              <a href="/contact" onClick={closeMobileMenu}>Contact</a>
            </li>

            <li>
              <a href="/blog" onClick={closeMobileMenu}>Blog</a>
            </li>

            <li>
              <a href="/contact" className="book-now-btn mobile-book-btn" onClick={closeMobileMenu}>
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </header>

      <div className="svc-page">
        {/* HERO */}
        <section className="svc-hero">
          <div className="container">
            <h1>Our Physiotherapy Services</h1>
            <p>
              Evidence-based care designed to reduce pain, restore movement, and accelerate your
              recovery.
            </p>
          </div>
        </section>

        {/* SECTION 1 – CORE SERVICES */}
        <section className="svc-cards-section">
          <div className="container">
            <div className="svc-section-head">
              <div className="svc-section-label">Core Services</div>
              <h2 className="svc-section-title">Expert Care for Every Condition</h2>
              <p className="svc-section-sub">
                Each treatment programme is individually assessed and tailored — addressing root
                causes, not just symptoms.
              </p>
            </div>
            <div className="svc-grid">
              <div className="svc-card reveal">
                <div className="svc-card-img-ph bg-teal-deep">
                  <img
                    src={imageSrc('orthopedic.jpg')}
                    alt="Orthopedic Physiotherapy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-card-body">
                  <span className="svc-card-tag">Joint & Spine Care</span>
                  <h3>Orthopedic Physiotherapy</h3>
                  <p>
                    Hands-on treatment for back pain, neck stiffness, arthritis, and ligament
                    injuries — restoring joint function through structured rehabilitation.
                  </p>
                  <ul className="svc-card-bullets">
                    <li>Manual therapy, joint mobilisation & soft tissue techniques</li>
                    <li>Postural correction and progressive strengthening programme</li>
                  </ul>
                </div>
              </div>

              <div className="svc-card reveal reveal-delay-1">
                <div className="svc-card-img-ph bg-teal-mid">
                  <img
                    src={imageSrc('neuro-rehab.jpg')}
                    alt="Neuro Rehabilitation"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-card-body">
                  <span className="svc-card-tag">Neuro Recovery</span>
                  <h3>Neuro Rehabilitation</h3>
                  <p>
                    Specialised rehabilitation following stroke, paralysis, and nerve injuries —
                    rebuilding movement, coordination, and daily independence.
                  </p>
                  <ul className="svc-card-bullets">
                    <li>Balance, gait, and coordination retraining</li>
                    <li>ADL-focused therapy for functional independence</li>
                  </ul>
                </div>
              </div>

              <div className="svc-card featured reveal reveal-delay-2">
                <div className="svc-card-img-ph bg-brass-deep">
                  <img
                    src={imageSrc('common-sports-injuries.jpg')}
                    alt=" Sports Injuries"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-card-body">
                  <span className="svc-card-tag">Athlete Rehab</span>
                  <h3>Sports Injury Rehab</h3>
                  <p>
                    Phase-wise rehabilitation for sprains, muscle tears, and overuse injuries —
                    ensuring a safe, full return to peak performance.
                  </p>
                  <ul className="svc-card-bullets">
                    <li>Return-to-sport progression with performance testing</li>
                    <li>Sports-specific movement analysis and correction</li>
                  </ul>
                </div>
              </div>

              <div className="svc-card reveal">
                <div className="svc-card-img-ph bg-teal-warm">
                  <img
                    src={imageSrc('sciatica.webp')}
                    alt="Orthopedic Physiotherapy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-card-body">
                  <span className="svc-card-tag">Chronic Pain</span>
                  <h3>Chronic Pain Rehabilitation</h3>
                  <p>
                    A movement-based approach to managing long-term pain conditions like
                    fibromyalgia, chronic fatigue, and persistent nerve issues.
                  </p>
                  <ul className="svc-card-bullets">
                    <li>Pain retraining: Advanced techniques to reset how the brain processes pain.</li>
                    <li>Myofascial release: Hands-on therapy to lower nervous system stress.</li>
                  </ul>
                </div>
              </div>

              <div className="svc-card reveal reveal-delay-1">
                <div className="svc-card-img-ph bg-slate-teal">
                  <img
                    src={imageSrc('Geriatric Physiotherapy.jpeg')}
                    alt="Geriatric Physiotherapy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-card-body">
                  <span className="svc-card-tag">Geriatric Care</span>
                  <h3>Geriatric Physiotherapy</h3>
                  <p>
                    Age-appropriate physiotherapy for elderly patients managing arthritis,
                    osteoporosis, and fall-related injuries — preserving dignity and independence.
                  </p>
                  <ul className="svc-card-bullets">
                    <li>Fall prevention assessment and balance training</li>
                    <li>Gentle mobilisation and osteoporosis-safe strengthening</li>
                  </ul>
                </div>
              </div>

              <div className="svc-card reveal reveal-delay-2">
                <div className="svc-card-img-ph bg-navy-teal">
                  <img
                    src={imageSrc('respiratory-therapy.jpg')}
                    alt="Respiratory Physiotherapy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="svc-card-body">
                  <span className="svc-card-tag">Cardio Pulmonary</span>
                  <h3>Respiratory Physiotherapy</h3>
                  <p>
                    Breathing rehabilitation for COPD, asthma, and post-COVID breathlessness —
                    improving lung function and quality of life.
                  </p>
                  <ul className="svc-card-bullets">
                    <li>Breathing retraining and airway clearance techniques</li>
                    <li>Graded cardiopulmonary exercise programme</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 – ELECTROTHERAPY */}
        <section className="svc-electro-section">
          <div className="container">
            <div className="svc-section-head">
              <div className="svc-section-label light">Advanced Technology</div>
              <h2 className="svc-section-title light">Electrotherapy Modalities</h2>
              <p className="svc-section-sub light">
                Targeted electrotherapy to reduce pain, improve circulation, and speed tissue
                healing — each session protocol personalised to your condition.
              </p>
            </div>

            {/* Laser – LEFT */}
            <div className="svc-modality reveal">
              <div
                className="svc-modality-img"
                style={{
                  backgroundImage: `url('${imageSrc('laser-therapy.jpg')}')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="svc-modality-badge">CE Certified · Class IV</div>
              </div>
              <div className="svc-modality-info">
                <div className="svc-ce-badge">
                  <span className="ce-icon">CE</span> European CE Certified · Exclusive in Kotdwar
                </div>
                <div className="svc-modality-tag">Advanced Laser Therapy</div>
                <h3>Class IV Laser Therapy</h3>
                <div className="svc-modality-subtitle">
                  High-Power Photobiomodulation — the only one of its kind in Kotdwar
                </div>
                <p>
                  Delivers deep therapeutic light energy to stimulate cellular repair, reduce
                  inflammation, and accelerate healing in tissues conventional therapy cannot
                  reach.
                </p>
                <div className="svc-best-for">
                  <div className="svc-best-for-label">Best for</div>
                  <div className="svc-best-for-tags">
                    <span>Acute injuries</span>
                    <span>Ligament & tendon tears</span>
                    <span>Cervical & lumbar radiculopathy</span>
                    <span>Knee injuries</span>
                    <span>Rotator cuff & frozen shoulder</span>
                    <span>Tennis & golfer's elbow</span>
                  </div>
                </div>
                <ul className="svc-modality-bullets">
                  <li>Stimulates cellular repair and reduces inflammation at a biological level</li>
                  <li>Drug-free deep tissue pain relief with zero side effects</li>
                </ul>
              </div>
            </div>

            {/* Winstim – RIGHT */}
            <div className="svc-modality reverse reveal">
              <div
                className="svc-modality-img"
                style={{
                  backgroundImage: `url('${imageSrc('Winstim.webp')}')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="svc-modality-badge">Advanced Winstim</div>
              </div>
              <div className="svc-modality-info">
                <div className="svc-modality-tag">Multi-modal Electrotherapy</div>
                <h3>Winstim Combination Therapy</h3>
                <div className="svc-modality-subtitle">Ultrasound + IFT + TENS in a unified session</div>
                <p>
                  Combines therapeutic ultrasound and electrotherapy currents in one synchronised
                  treatment — delivering a synergistic healing effect greater than any single
                  modality alone.
                </p>
                <div className="svc-best-for">
                  <div className="svc-best-for-label">Best for</div>
                  <div className="svc-best-for-tags">
                    <span>Chronic pain</span>
                    <span>Soft tissue injuries</span>
                    <span>Joint inflammation</span>
                    <span>Nerve pain</span>
                    <span>Muscle spasm</span>
                  </div>
                </div>
                <ul className="svc-modality-bullets">
                  <li>Ultrasound promotes deep tissue healing and reduces scar formation</li>
                  <li>IFT and TENS provide immediate pain relief and muscle relaxation</li>
                </ul>
              </div>
            </div>

            {/* SWD – LEFT */}
            <div className="svc-modality reveal">
              <div
                className="svc-modality-img bg-teal-mid"
                style={{
                  backgroundImage: `url('${imageSrc('swd.jpg')}')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="svc-modality-badge">Deep Heat</div>
              </div>
              <div className="svc-modality-info">
                <div className="svc-modality-tag">Thermal Modality</div>
                <h3>Short Wave Diathermy (SWD)</h3>
                <div className="svc-modality-subtitle">
                  Deep tissue heating for chronic stiffness and muscle spasm
                </div>
                <p>
                  Uses high-frequency electromagnetic energy to generate penetrating heat within
                  deep tissues — reducing stiffness and muscle guarding before active
                  rehabilitation.
                </p>
                <div className="svc-best-for">
                  <div className="svc-best-for-label">Best for</div>
                  <div className="svc-best-for-tags">
                    <span>Chronic back pain</span>
                    <span>Joint stiffness</span>
                    <span>Muscle spasm</span>
                    <span>Pelvic pain</span>
                  </div>
                </div>
                <ul className="svc-modality-bullets">
                  <li>Deep heat reaches joints and fascial layers that hot packs cannot</li>
                  <li>Improves circulation and tissue readiness for manual therapy</li>
                </ul>
              </div>
            </div>

            {/* Hot & Cold – RIGHT */}
            <div className="svc-modality reverse reveal">
              <div
                className="svc-modality-img bg-navy-teal"
                style={{
                  backgroundImage: `url('${imageSrc('CONTRAST-BATH.jpg')}')`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="svc-modality-badge">Hot & Cold</div>
              </div>
              <div className="svc-modality-info">
                <div className="svc-modality-tag">Thermal Contrast</div>
                <h3>Hot & Cold Contrast Therapy</h3>
                <div className="svc-modality-subtitle">
                  Vasomotor pumping to reduce swelling and accelerate recovery
                </div>
                <p>
                  Alternating heat and cold creates a pumping effect in blood vessels — flushing
                  metabolic waste, reducing oedema, and accelerating healing in acute soft tissue
                  injuries.
                </p>
                <div className="svc-best-for">
                  <div className="svc-best-for-label">Best for</div>
                  <div className="svc-best-for-tags">
                    <span>Ankle sprains</span>
                    <span>Post-surgical oedema</span>
                    <span>Sports recovery</span>
                    <span>Repetitive strain</span>
                  </div>
                </div>
                <ul className="svc-modality-bullets">
                  <li>Reduces swelling and improves lymphatic drainage effectively</li>
                  <li>Proven to shorten recovery time in sports and soft tissue injuries</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 – MANUAL THERAPIES */}
        <section className="svc-manual-section">
          <div className="container">
            <div className="svc-section-head">
              <div className="svc-section-label">Hands-On Expertise</div>
              <h2 className="svc-section-title">Advanced Manual & Sports Recovery Therapies</h2>
              <p className="svc-section-sub">
                Precision hands-on interventions addressing structural, neurological, and soft
                tissue dysfunction — trusted by athletes and everyday patients alike.
              </p>
            </div>
            <div className="svc-manual-grid">
              <div className="svc-manual-card reveal">
                <div className="svc-manual-card-img">
                  <img
                    src={imageSrc('660d2946680a0Modern Techniques For Back Pain Treatment.webp')}
                    alt="Chiropractic Adjustment"
                  />
                </div>
                <div className="svc-manual-card-body">
                  <span className="focus-tag">Cervical & Lumbar Spine</span>
                  <h3>Chiropractic Adjustment</h3>
                  <p>
                    High-velocity spinal manipulation to restore segmental mobility, relieve nerve
                    compression, and resolve acute and chronic back and neck pain.
                  </p>
                  <ul className="svc-manual-bullets">
                    <li>Cervical and lumbar spine adjustment for disc and facet pain</li>
                    <li>SI joint manipulation for pelvic and lower back dysfunction</li>
                  </ul>
                </div>
              </div>

              <div className="svc-manual-card reveal reveal-delay-1">
                <div className="svc-manual-card-img">
                  <img src={imageSrc('dry-needling.jpg')} alt="Dry Needling" />
                </div>
                <div className="svc-manual-card-body">
                  <span className="focus-tag">Sports Injuries & Myofascial Pain</span>
                  <h3>Dry Needling & Kinesiology Taping</h3>
                  <p>
                    Dry needling deactivates deep trigger points while kinesiology taping provides
                    dynamic support and proprioceptive feedback during activity and sport.
                  </p>
                  <ul className="svc-manual-bullets">
                    <li>Intramuscular stimulation to release myofascial trigger points</li>
                    <li>Kinesio taping for oedema control and movement support</li>
                  </ul>
                </div>
              </div>

              <div className="svc-manual-card reveal reveal-delay-2">
                <div className="svc-manual-card-img">
                  <img src={imageSrc('cupping-therapy.jpg')} alt="Cupping Therapy" />
                </div>
                <div className="svc-manual-card-body">
                  <span className="focus-tag">Deep Tissue & Fascial Release</span>
                  <h3>Dry & Wet Cupping Therapy</h3>
                  <p>
                    Negative pressure lifts fascial layers, improves microcirculation, and
                    decompresses pain-sensitive structures — effective for chronic tension and
                    myofascial pain.
                  </p>
                  <ul className="svc-manual-bullets">
                    <li>Dynamic cupping along fascial meridians for deep tension release</li>
                    <li>Wet cupping under sterile protocol for deep inflammatory conditions</li>
                  </ul>
                </div>
              </div>

              <div className="svc-manual-card reveal">
                <div className="svc-manual-card-img">
                  <img src={imageSrc('instrument-assisted.jpg')} alt="IASTM Therapy" />
                </div>
                <div className="svc-manual-card-body">
                  <span className="focus-tag">IASTM · Scar Tissue · Tendinopathy</span>
                  <h3>Instrument Assisted Soft Tissue Mobilisation</h3>
                  <p>
                    Steel instruments detect and break down fascial adhesions and scar tissue —
                    restarting healing in chronic tendinopathy and post-surgical restrictions.
                  </p>
                  <ul className="svc-manual-bullets">
                    <li>Remodels scar tissue and fascial adhesions for restored tissue glide</li>
                    <li>Effective for plantar fascia, Achilles, IT band, and forearm tendons</li>
                  </ul>
                </div>
              </div>

              <div className="svc-manual-card reveal reveal-delay-1">
                <div className="svc-manual-card-img">
                  <img src={imageSrc('Geriatric Physiotherapy.jpeg')} alt="Geriatric Physiotherapy" />
                </div>
                <div className="svc-manual-card-body">
                  <span className="focus-tag">Elderly Patients · Old Age Conditions</span>
                  <h3>Geriatric Physiotherapy</h3>
                  <p>
                    Compassionate therapy managing arthritis, osteoporosis, Parkinson's, and
                    post-surgical recovery — maintaining independence at every stage of life.
                  </p>
                  <ul className="svc-manual-bullets">
                    <li>Fall risk assessment, balance training, and safe strengthening</li>
                    <li>Parkinson's gait training and post-replacement rehabilitation</li>
                  </ul>
                </div>
              </div>

              <div className="svc-manual-card reveal reveal-delay-2">
                <div className="svc-manual-card-img">
                  <img src={imageSrc('sports-injury.jpg')} alt="Sports Conditioning" />
                </div>
                <div className="svc-manual-card-body">
                  <span className="focus-tag">Athletic Performance & Resilience</span>
                  <h3>Sports Conditioning & Injury Prevention</h3>
                  <p>
                    Functional movement screening and targeted conditioning to identify
                    vulnerability patterns before injury occurs — building long-term athletic
                    resilience.
                  </p>
                  <ul className="svc-manual-bullets">
                    <li>Movement screening and biomechanical correction</li>
                    <li>Plyometric and neuromuscular control training</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="np-cond" id="conditions-we-treat">
        <div className="np-cond-header">
          <span className="np-cond-eyebrow">Expert Care & Recovery</span>
          <h2 className="np-cond-title">
            Conditions <em>We Treat</em>
          </h2>
        </div>

        <div className="np-cond-grid">
          {/* ROW 1: big left + tall right */}
          {/* Card 1 — Back Pain (wide) */}
          <div className="np-cond-card np-cond-wide" data-delay="0">
            <img
              src={imageSrc('660d2946680a0Modern Techniques For Back Pain Treatment.webp')}
              alt="Back Pain"
              className="np-cond-img"
            />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Low Back Pain</span>
            </div>
          </div>

          {/* Card 2 — Sports Injuries (tall right) */}
          <div className="np-cond-card np-cond-tall" data-delay="1">
            <img src={imageSrc('common-sports-injuries.jpg')} alt="Sports Injuries" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Sports Injuries</span>
            </div>
          </div>

          {/* ROW 1 bottom-left pair */}
          {/* Card 3 — Cervical Pain */}
          <div className="np-cond-card" data-delay="2">
            <img src={imageSrc('images (2).jpg')} alt="Cervical Pain" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Cervical Pain & Vertigo</span>
            </div>
          </div>

          {/* Card 4 — Arthritis */}
          <div className="np-cond-card" data-delay="3">
            <img src={imageSrc('HipandKneePain.jpg')} alt="Arthritis" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Arthritis (Knee / Hip)</span>
            </div>
          </div>

          {/* ROW 2: 3 equal cards */}
          {/* Card 5 — Frozen Shoulder */}
          <div className="np-cond-card" data-delay="4">
            <img src={imageSrc('frozen-shoulder.jpg')} alt="Frozen Shoulder" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Frozen Shoulder</span>
            </div>
          </div>

          {/* Card 6 — Sciatica / Slip Disc */}
          <div className="np-cond-card" data-delay="5">
            <img src={imageSrc('sciatica.webp')} alt="Sciatica" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Sciatica / Slip Disc</span>
            </div>
          </div>

          {/* Card 7 — Tennis Elbow */}
          <div className="np-cond-card" data-delay="6">
            <img src={imageSrc('tennis-elbow.jpg')} alt="Tennis Elbow" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Tennis Elbow</span>
            </div>
          </div>

          {/* ROW 3: tall left + 2 stacked right */}
          {/* Card 8 — Paralysis / Cerebral Palsy (tall) */}
          <div className="np-cond-card np-cond-tall2" data-delay="7">
            <img src={imageSrc('polio.jpg')} alt="Paralysis" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Paralysis / Cerebral Palsy / Polio</span>
            </div>
          </div>

          {/* Card 9 — Total Knee Replacement */}
          <div className="np-cond-card" data-delay="8">
            <img src={imageSrc('knee-pain.webp')} alt="Knee Replacement" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Total Knee Replacement</span>
            </div>
          </div>

          {/* Card 10 — Total Hip Replacement */}
          <div className="np-cond-card" data-delay="9">
            <img src={imageSrc('hip-replacement.jpg')} alt="Hip Replacement" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Total Hip Replacement</span>
            </div>
          </div>

          {/* ROW 4: 2 equal + wide */}
          {/* Card 11 — Post Fracture Rehab */}
          <div className="np-cond-card" data-delay="10">
            <img src={imageSrc('fracture.jpg')} alt="Post Fracture" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Post Fracture Rehabilitation</span>
            </div>
          </div>

          {/* Card 12 — Ligament Reconstruction */}
          <div className="np-cond-card" data-delay="11">
            <img src={imageSrc('ligament-reconstruction.jpg')} alt="Ligament" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Ligament Reconstruction</span>
            </div>
          </div>

          {/* Card 13 — Neuropathy (wide) */}
          <div className="np-cond-card np-cond-wide2" data-delay="12">
            <img src={imageSrc('neuro-rehab.jpg')} alt="Neuropathy" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Neuropathy</span>
            </div>
          </div>

          {/* Card 14 — Spinal Surgeries */}
          <div className="np-cond-card" data-delay="13">
            <img src={imageSrc('spine-surgery.jpg')} alt="Spinal Surgeries" className="np-cond-img" />
            <div className="np-cond-overlay"></div>
            <div className="np-cond-info">
              <span className="np-cond-name">Spinal Surgeries</span>
            </div>
          </div>
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