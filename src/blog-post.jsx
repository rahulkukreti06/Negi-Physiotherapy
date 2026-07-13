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

export default function BlogPostPage({ slug }) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    const syncChrome = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', syncChrome);
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', scrollToTop);
    }

    return () => {
      window.removeEventListener('scroll', syncChrome);
      if (scrollTopBtn) {
        scrollTopBtn.removeEventListener('click', scrollToTop);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        
        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Post not found');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPost();
  }, [slug]);

  function renderHeader(useDarkText) {
    const desktopLinkStyle = useDarkText ? { color: "#000" } : undefined;
    const desktopBookNowStyle = useDarkText ? { color: "#000", borderColor: "#000" } : undefined;

    return (
      <header id="header">
        <div className="header-container">
          <div className="logo-section">
            <img src={imageSrc('logo.png')} alt="Negi Physiotherapy Logo" className="logo" />
            <div className="logo-text">
              <h1 style={useDarkText ? { color: "#000" } : undefined}>Negi Physiotherapy Clinic</h1>
              <p style={useDarkText ? { color: "#000" } : { color: "#525151" }}>Ortho & Neuro Rehab Center</p>
            </div>
          </div>

          <nav className="nav-center">
            <ul className="nav-links">
              <li><a href="/" style={desktopLinkStyle}>Home</a></li>
              <li><a href="/services" style={desktopLinkStyle}>Services</a></li>
              <li><a href="/about" style={desktopLinkStyle}>About Us</a></li>
              <li><a href="/contact" style={desktopLinkStyle}>Contact</a></li>
              <li><a href="/blog" style={desktopLinkStyle}>Blog</a></li>
            </ul>
          </nav>

          <div className="header-right">
            <a href="/contact" className="book-now-btn" style={desktopBookNowStyle}>Book Now</a>

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

        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            <li><a href="/" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="/services" onClick={closeMobileMenu}>Services</a></li>
            <li><a href="/about" onClick={closeMobileMenu}>About Us</a></li>
            <li><a href="/contact" onClick={closeMobileMenu}>Contact</a></li>
            <li><a href="/blog" onClick={closeMobileMenu}>Blog</a></li>
            <li>
              <a href="/contact" className="book-now-btn mobile-book-btn" onClick={closeMobileMenu}>
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </header>
    );
  }

  if (isLoading) {
    return (
      <div className="site-wrapper">
        {renderHeader(false)}
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="site-wrapper">
        {renderHeader(false)}
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Post Not Found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/blog'}
            style={{ 
              color: '#0d9488', 
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-wrapper">
      {renderHeader(true)}

      <main style={{ padding: '80px 20px 60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={() => {
              console.log('Back to Blog clicked');
              window.location.href = '/blog';
            }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              color: '#0d9488', 
              textDecoration: 'none',
              background: '#f0fdfa',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 20px',
              fontSize: '16px',
              fontFamily: 'inherit',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>
        </div>

        {post.thumb && (
          <img 
            src={post.thumb} 
            alt={post.title} 
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: '12px', 
              marginBottom: '30px' 
            }} 
          />
        )}

        <div style={{ marginBottom: '20px' }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            backgroundColor: '#0d9488', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '14px',
            marginBottom: '15px'
          }}>
            {post.category || 'General'}
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#1f2937' }}>
          {post.title}
        </h1>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '30px', 
          color: '#6b7280', 
          fontSize: '14px' 
        }}>
          <span>By {post.author || 'Dr. Mangesh Negi'}</span>
          <span>•</span>
          <span>
            {new Date(post.created_at).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>

        {post.excerpt && (
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#4b5563', 
            marginBottom: '30px', 
            fontStyle: 'italic',
            lineHeight: '1.8'
          }}>
            {post.excerpt}
          </p>
        )}

        <div 
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ 
            lineHeight: '1.8', 
            color: '#374151',
            fontSize: '1.1rem'
          }}
        />
        <style>{`
          .blog-post-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            display: block;
          }
        `}</style>

        <div style={{ 
          marginTop: '60px', 
          padding: '30px', 
          backgroundColor: '#f0fdfa', 
          borderRadius: '12px',
          border: '1px solid #0d9488'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#0d9488' }}>Need Professional Help?</h3>
          <p style={{ marginBottom: '20px', color: '#4b5563' }}>
            If you're experiencing any of the issues mentioned in this article, our expert physiotherapists are here to help.
          </p>
          <a 
            href="/contact" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#0d9488', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Book Appointment
          </a>
        </div>
      </main>

      {/* Footer */}
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

                <span>Malviya Udhyan, Near Nagar Nigam Office, nainital bank, Kotdwara, Uttarakhand 246149</span>
              </li>

              <li>
                <span className="footer-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.62a16 16 0 0 0 6.29 6.29l1.19-1.19a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>

                <span>
                  <a href="tel:+918218652502">+91 82186 52502</a>
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

      {/* Scroll to top button */}
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
      </div>
    </div>
  );
}
