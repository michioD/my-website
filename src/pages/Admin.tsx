import React, { useState } from 'react';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../config';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    // Auto-generate ID and Date
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`,
        },
        body: JSON.stringify({
          id,
          title,
          excerpt,
          category,
          date,
          content,
        }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed or server error');
      }

      setStatus('Blog posted successfully!');
      setTitle('');
      setExcerpt('');
      setCategory('');
      setContent('');
    } catch (err) {
      console.error(err);
      setStatus('Failed to post. Check your admin password.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 md:py-24 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g. Mini Projects"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Markdown Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 font-mono text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={15}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Publish Post
        </button>

        {status && (
          <p className={`text-center font-medium ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
      </form>
    </motion.div>
  );
}
