import React from 'react';
import { motion } from 'motion/react';
import { BlogCard } from '../components/BlogCard';
import { BLOG_POSTS } from '../constants';

export default function Blog() {
  return (
    <div className="pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Blog & Mini Projects
          </h1>
          <p className="text-lg text-slate-500">
            A collection of small things I do, side projects, and random thoughts.
          </p>
        </div>

        <div className="space-y-8">
          {BLOG_POSTS.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
