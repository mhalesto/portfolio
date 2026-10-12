import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Cursor from './Cursor';
import { resetScroll, startSmoothScroll, stopSmoothScroll } from '../scroll';

// Wraps the dark, immersive pages (home, projects, contact).
export default function SiteShell({ children, className = '' }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('theme-dark');
    resetScroll();
    startSmoothScroll();
    return () => {
      root.classList.remove('theme-dark');
      stopSmoothScroll();
    };
  }, []);

  return (
    <div className={`site ${className}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header tone="overlay" />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      {children}
      <Footer />
    </div>
  );
}
