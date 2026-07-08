import { useEffect, useState } from "react";
import './App.css';
import './blog.css';
import './utility.css';
import { supabase } from './supabaseClient';

const imageModules = import.meta.glob('./images/*', {
  eager: true,
  import: 'default',
});

const imageSrc = (fileName) => imageModules[`./images/${fileName}`];

export default function BlogPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const header = document.getElementById('header');
    const utilityButtons = document.getElementById('utilityButtons');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

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
      setIsMobileMenuOpen(false);
    };

    const toggleMobileMenuHandler = () => {
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
      hamburger.addEventListener('click', toggleMobileMenuHandler);
    }

    mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', scrollToTop);
    }

    return () => {
      window.removeEventListener('scroll', syncChrome);
      if (hamburger) {
        hamburger.removeEventListener('click', toggleMobileMenuHandler);
      }
      if (scrollTopBtn) {
        scrollTopBtn.removeEventListener('click', scrollToTop);
      }
    };
  }, []);

  // Fetch published blog posts from Supabase
  useEffect(() => {
    async function fetchBlogPosts() {
      const startTime = performance.now();
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, category, author, excerpt, thumb, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        
        const endTime = performance.now();
        console.log(`Supabase query took ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`Fetched ${data?.length || 0} posts`);
        
        if (error) throw error;
        setBlogPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBlogPosts();
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
                <a href="/blog" className="active">Blog</a>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <a href="/contact" className="book-now-btn">
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

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
          <ul className="mobile-nav-links">
            <li>
              <a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            </li>

            <li>
              <a href="/services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            </li>

            <li>
              <a href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
            </li>

            <li>
              <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </li>

            <li>
              <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="active">Blog</a>
            </li>

            <li>
              <a href="/contact" className="book-now-btn mobile-book-btn" onClick={() => setIsMobileMenuOpen(false)}>
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <div className="blog-hero-content">
          <h1 className="blog-hero-title">
            Health & Wellness Blog<br />
          </h1>
          <p className="blog-hero-subtitle">
            Expert insights on physiotherapy, rehabilitation, and holistic wellness from Dr. Mangesh Negi
          </p>
          <div className="blog-hero-stats">
            <div className="blog-hero-stat">
              <span className="blog-hero-stat-number">15+</span>
              <span className="blog-hero-stat-label">Years Experience</span>
            </div>
            <div className="blog-hero-stat-divider"></div>
            <div className="blog-hero-stat">
              <span className="blog-hero-stat-number">5000+</span>
              <span className="blog-hero-stat-label">Patients Treated</span>
            </div>
            <div className="blog-hero-stat-divider"></div>
            <div className="blog-hero-stat">
              <span className="blog-hero-stat-number">CE</span>
              <span className="blog-hero-stat-label">Certified in Class IV Laser Therapy</span>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG POSTS SECTION */}
      <section className="blog-posts-section">
        <div className="blog-container">
          <div className="blog-section-header">
            <div className="blog-section-label">Latest Articles</div>
            <h2 className="blog-section-title">Explore Our Health Insights</h2>
            <p className="blog-section-subtitle">
              Stay informed with evidence-based articles on physiotherapy, injury prevention, and wellness tips
            </p>
          </div>

          {/* Blog Posts Grid - Populated from Supabase */}
          <div className="blog-posts-grid" id="blogPostsGrid">
            {isLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>Loading articles...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="blog-empty-state" style={{ display: 'block' }}>
                <div className="blog-empty-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="blog-empty-title">No Articles Yet</h3>
                <p className="blog-empty-text">
                  Check back soon for informative articles on physiotherapy and wellness
                </p>
              </div>
            ) : (
              blogPosts.map((post) => (
                <div className="blog-post-card" key={post.id}>
                  <div className="blog-post-image">
                    {post.thumb ? (
                      <img 
                        src={post.thumb} 
                        alt={post.title} 
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div className="blog-post-placeholder">
                        <span className="blog-post-placeholder-icon">📝</span>
                      </div>
                    )}
                    <div className="blog-post-category">{post.category || 'General'}</div>
                  </div>
                  <div className="blog-post-content">
                    <div className="blog-post-meta">
                      <span className="blog-post-date">
                        {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="blog-post-read-time">By {post.author || 'Dr. Mangesh Negi'}</span>
                    </div>
                    <h3 className="blog-post-title">{post.title}</h3>
                    <p className="blog-post-excerpt">
                      {post.excerpt ? (
                        post.excerpt.length > 150 ? post.excerpt.substring(0, 150) + '...' : post.excerpt
                      ) : (
                        'Discover insights and tips for better health and wellness.'
                      )}
                    </p>
                    <a href={`/blog/${post.slug}`} className="blog-post-link">
                      Read More
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="blog-newsletter">
        <div className="blog-container">
          <div className="blog-newsletter-content">
            <div className="blog-newsletter-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="blog-newsletter-title">Stay Updated</h3>
            <p className="blog-newsletter-text">
              Subscribe to our newsletter for the latest health tips and rehabilitation insights
            </p>
            <form className="blog-newsletter-form" action="https://formspree.io/f/xrewlekl" method="POST">
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                className="blog-newsletter-input"
                required
              />
              <button type="submit" className="blog-newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
