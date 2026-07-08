// Scroll effect for header
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');

        // Animate hamburger lines
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
    });
}

// Close mobile menu when clicking on a link
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (!hamburger || !mobileMenu) return;

        mobileMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking on Book Now button
const mobileBookBtn = document.querySelector('.mobile-book-btn');
if (mobileBookBtn) {
    mobileBookBtn.addEventListener('click', function(e) {
        if (!hamburger || !mobileMenu) return;

        mobileMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
}

// Scroll animation for cards
// Scroll animation for all animated elements
// Added all your different card classes into the selector list below
const animatedElements = document.querySelectorAll(
  '.creds-card, .treat-card, .physio-card, .cond-card, .why-item, .testi-card'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Find index relative to its sibling elements in the same grid for staggered animations
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);

        entry.target.style.transitionDelay = (idx * 110) + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => observer.observe(el));
} else {
  animatedElements.forEach(el => el.classList.add('is-visible'));
}

// Utility Buttons - Scroll to Top and WhatsApp visibility
const utilityButtons = document.getElementById('utilityButtons');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Show/hide utility buttons based on scroll position (after hero section)
window.addEventListener('scroll', function() {
    if (!utilityButtons) return;

    // Show buttons after scrolling past 300px (past hero section)
    if (window.scrollY > 300) {
        utilityButtons.classList.add('visible');
    } else {
        utilityButtons.classList.remove('visible');
    }
});

// Scroll to top functionality
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}