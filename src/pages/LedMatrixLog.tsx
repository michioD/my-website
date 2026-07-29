import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LedMatrixLog() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="py-12 md:py-24 max-w-3xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Building a Remote LED Matrix with ESP-32
        </h1>
        <div className="flex items-center text-sm text-slate-500 space-x-4">
          <span>Developer Log</span>
          <span>•</span>
          <span>March 2026</span>
        </div>
      </header>

      <div className="prose prose-slate prose-lg max-w-none">
        <motion.img
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          src="/images/ledmatrix.png"
          alt="LED Matrix in action"
          className={`w-full rounded-xl shadow-lg mb-10 cursor-pointer object-cover transition-all duration-500 ${isExpanded ? 'h-auto aspect-auto' : 'h-64 md:h-80 aspect-video'}`}
          title="Click to expand"
        />
      </div>
    </motion.div>
  );
}
