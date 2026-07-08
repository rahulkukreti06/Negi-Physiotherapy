import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ServicesPage from './services.jsx'
import AboutPage from './about.jsx'
import ContactPage from './contact.jsx'
import BlogPage from './blog.jsx'
import BlogStudio from './adminblog.jsx'
import BlogPostPage from './blog-post.jsx'

function Root() {
  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();

  if (pathname === '/services') {
    return <ServicesPage />;
  }

  if (pathname === '/about') {
    return <AboutPage />;
  }

  if (pathname === '/contact') {
    return <ContactPage />;
  }

  if (pathname === '/blog') {
    return <BlogPage />;
  }

  if (pathname === '/adminblog') {
    return <BlogStudio />;
  }

  // Handle blog post detail pages: /blog/slug
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.split('/blog/')[1];
    return <BlogPostPage slug={slug} />;
  }

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
