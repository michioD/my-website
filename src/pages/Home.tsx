import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { PROJECTS, BLOG_POSTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { BlogCard } from '../components/BlogCard';

const TypewriterTitle = () => {
  const text = "Welcome :)";
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting' | 'done'>('typing');

  useEffect(() => {
    let index = 0;
    
    if (phase === 'typing') {
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(intervalId);
          setPhase('waiting');
        }
      }, 100);
      return () => clearInterval(intervalId);
    } 
    
    if (phase === 'waiting') {
      const timeoutId = setTimeout(() => {
        setPhase('deleting');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
    
    if (phase === 'deleting') {
      index = text.length;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, index - 1));
        index--;
        if (index <= 0) {
          clearInterval(intervalId);
          setPhase('done');
        }
      }, 50); // Deleting is slightly faster for a better effect
      return () => clearInterval(intervalId);
    }
  }, [phase]);

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-heading)] tracking-tight mb-6 min-h-[3rem] md:min-h-[4rem] flex items-center">
      <AnimatePresence mode="wait">
        {phase !== 'done' && (
          <motion.span
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="block"
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-[4px] h-[0.9em] bg-blue-500 align-middle ml-2"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </h1>
  );
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <TypewriterTitle />
          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
            Hi, I'm Lucas. I study Engineering Mathematics at KTH Royal Institute of Technology in Stockholm. I'm passionate about solving complex problems using mathematical modeling and computational methods.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="mailto:lfrykman@kth.se" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors flex items-center space-x-2 shadow-sm">
              <Mail size={16} />
              <span>Get in touch</span>
            </a>
            <div className="flex items-center space-x-3">
              <a href="https://github.com/michioD" className="p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:border-[var(--border-hover)] transition-colors">
                <Github size={18} />
              </a>
              <a href="https://www.linkedin.com/in/lucas-frykman-ab289518a/" className="p-2.5 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:border-[var(--border-hover)] transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-[var(--text-heading)]">Portfolio Projects</h2>
          <a href="https://github.com/michioD" className="text-sm font-semibold text-blue-500 hover:text-blue-400 hover:underline flex items-center space-x-1">
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

      {/* Blog Section
      <section id="blog" className="py-16 border-t border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Writing & Notes</h2>
        </div>

        <div className="max-w-3xl">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section> */}
    </>
  );
}
