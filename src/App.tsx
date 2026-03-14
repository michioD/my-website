import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Tutoring from './pages/Tutoring';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 backdrop-blur-sm py-3 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
            Lucas Frykman
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="mailto:lfrykman@kth.se"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xl font-semibold text-slate-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="mailto:lfrykman@kth.se"
                className="text-xl font-semibold text-blue-600"
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
      <footer className="mt-24 py-12 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Lucas Frykman. Built with React & Tailwind.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Twitter</a>
            <a href="https://github.com/michioD" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/lucas-frykman-ab289518a/" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tutoring" element={<Tutoring />} />
        </Routes>
      </Layout>
    </Router>
  );
}
