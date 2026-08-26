import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BlogCard } from '../components/BlogCard';
import { BLOG_POSTS, BlogPost } from '../constants';
import { API_BASE_URL } from '../config';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then((data: BlogPost[]) => {
        if (data && data.length > 0) {
          // Merge dynamic DB posts with static ones
          setPosts([...data, ...BLOG_POSTS]);
        }
      })
      .catch(err => console.error('Failed to fetch blogs:', err));
  }, []);

  return (
    <div className="pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-12"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-heading)]">
            Blog & Mini Projects
          </h1>
          <p className="text-lg text-[var(--text-muted)]">
            A collection of small things I do, side projects, and random thoughts.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
