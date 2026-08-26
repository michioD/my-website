import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL } from '../config';

export default function LedMatrixLog() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [devlogContent, setDevlogContent] = useState<string>('Loading devlog...');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/devlog`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.text();
      })
      .then((text) => setDevlogContent(text))
      .catch((err) => {
        console.error('Failed to fetch devlog:', err);
        setDevlogContent('Failed to load devlog content. Please try again later.');
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="py-12 md:py-24 max-w-3xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)] mb-8 group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-heading)] mb-4">
          Building a Remote LED Matrix with ESP-32
        </h1>
        <div className="flex items-center text-sm text-[var(--text-muted)] space-x-4">
          <span>Developer Log</span>
          <span>•</span>
          <span>March 2026</span>
        </div>
      </header>

      <div className="markdown-body">
        <motion.img
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          src="/images/ledmatrix.png"
          alt="LED Matrix in action"
          className={`w-full rounded-xl shadow-lg mb-10 cursor-pointer object-cover transition-all duration-500 ${isExpanded ? 'h-auto aspect-auto' : 'h-64 md:h-80 aspect-video'}`}
          title="Click to expand"
        />
        <div className="mt-8">
          <ReactMarkdown>{devlogContent}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
