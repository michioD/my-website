import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Tutoring from './pages/Tutoring';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import Admin from './pages/Admin';
import LedMatrixLog from './pages/LedMatrixLog';
import VisitorStatsPage from './pages/VisitorStatsPage';
import SLMetro from './pages/SLMetro';
import { VisitorStats } from './components/VisitorStats';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:border-[var(--border-hover)] transition-all flex items-center justify-center cursor-pointer shadow-sm"
    >
      {theme === 'dark' ? (
        <Sun size={17} className="text-amber-400" />
      ) : (
        <Moon size={17} className="text-slate-700" />
      )}
    </button>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Tutoring', href: '/tutoring' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Visitor Stats Floating Widget */}
      <div className="fixed top-4 left-4 z-[60] scale-75 origin-top-left opacity-70 hover:opacity-100 transition-all hover:scale-90 pointer-events-auto">
        <VisitorStats />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-[var(--nav-bg)] backdrop-blur-md py-3 border-b border-[var(--border-color)]' : 'bg-transparent py-6'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-[var(--text-heading)]">
            Lucas Frykman
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="mailto:lfrykman@kth.se"
              className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
            <ThemeToggleButton />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggleButton />
            <button
              className="p-2 text-[var(--text-heading)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-[var(--bg-page)] pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xl font-semibold text-[var(--text-heading)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="mailto:lfrykman@kth.se"
                className="text-xl font-semibold text-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6 min-h-[calc(100-24rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} Lucas Frykman. Built with React & Tailwind.
          </p>
          <div className="flex items-center space-x-6">
            <a href="https://github.com/michioD" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-heading)] uppercase tracking-widest transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/lucas-frykman-ab289518a/" className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-heading)] uppercase tracking-widest transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    fetch('/api/track').catch((err) => console.error('Error tracking visit:', err));
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/tutoring" element={<Tutoring />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/projects/led-matrix" element={<LedMatrixLog />} />
            <Route path="/visitor-stats" element={<VisitorStatsPage />} />
            <Route path="/sl-metro" element={<SLMetro />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
