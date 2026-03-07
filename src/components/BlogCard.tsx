import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../constants';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group border-b border-slate-100 py-6 first:pt-0 last:border-0 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.category}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-slate-500 max-w-2xl">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-medium text-slate-400 group-hover:text-slate-900 transition-colors">
          <span>{post.readTime}</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};
