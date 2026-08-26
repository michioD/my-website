import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../constants';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`} className="block">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group border-b border-[var(--border-color)] py-6 first:pt-0 last:border-0 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2 text-[11px] text-[var(--text-muted)] font-medium">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-heading)] group-hover:text-blue-500 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-2xl">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-heading)] transition-colors">
            <span>{post.readTime}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
