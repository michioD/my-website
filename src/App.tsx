import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Linkedin, Mail, ArrowUpRight, GraduationCap, MapPin } from 'lucide-react';
import { PROJECTS, BLOG_POSTS } from './constants';
import { ProjectCard } from './components/ProjectCard';
import { BlogCard } from './components/BlogCard';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Blog', href: '#blog' },
    { name: 'About', href: '#about' },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 backdrop-blur-sm py-3 border-b border-slate-100' : 'bg-transparent py-6'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="text-lg font-bold tracking-tight text-slate-900">
            Lucas Frykman
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
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
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xl font-semibold text-slate-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="mailto:hello@example.com"
                className="text-xl font-semibold text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-48 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-4">
              <GraduationCap size={18} />
              <span>Teknisk Matematik @ KTH</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Engineering Mathematics student focused on numerical analysis and optimization.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Hi, I'm Lucas. I study Engineering Mathematics at KTH Royal Institute of Technology in Stockholm. I'm passionate about solving complex problems using mathematical modeling and computational methods.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:lfrykman@kth.se" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors flex items-center space-x-2">
                <Mail size={16} />
                <span>Get in touch</span>
              </a>
              <div className="flex items-center space-x-3">
                <a href="https://github.com/michioD" className="p-2.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/lucas-frykman-ab289518a/" className="p-2.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 border-t border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Academic Projects</h2>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:underline flex items-center space-x-1">
              <span>View GitHub</span>
              <ArrowUpRight size={14}/>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-16 border-t border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Writing & Notes</h2>
          </div>

          <div className="max-w-3xl">
            {BLOG_POSTS.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">About Me</h2>
              <div className="text-slate-600 space-y-4 leading-relaxed">
                <p>
                  I am currently pursuing my Master's degree in Engineering Mathematics at KTH. My academic interests lie at the intersection of applied mathematics, computer science, and physics.
                </p>
                <p>
                  Throughout my studies, I have developed a strong foundation in multivariable calculus, linear algebra, and differential equations, complemented by practical skills in programming and data analysis.
                </p>
                <p>
                  When I'm not studying, I enjoy working on side projects that challenge my understanding of algorithms and system design.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Location</h3>
                <div className="flex items-center space-x-2 text-slate-600">
                  <MapPin size={16} />
                  <span>Stockholm, Sweden</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Education</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-900">KTH Royal Institute of Technology</p>
                    <p className="text-sm text-slate-500">M.Sc. Engineering Mathematics</p>
                    <p className="text-xs text-slate-400">2024 — Present</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">KTH Royal Institute of Technology</p>
                    <p className="text-sm text-slate-500">B.Sc. Engineering Mathematics</p>
                    <p className="text-xs text-slate-400">2021 — 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Lucas Frykman. Built with React & Tailwind.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Twitter</a>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">GitHub</a>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
