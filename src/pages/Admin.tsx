import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { API_BASE_URL } from '../config';
import { BlogPost } from '../constants';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const fetchPosts = () => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setPosts(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: BlogPost) => {
    setEditId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setContent(post.content);
    setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    setEditId(null);
    setTitle('');
    setExcerpt('');
    setCategory('');
    setContent('');
    setStatus('');
  };

  const handleDelete = async (id: string) => {
    if (!password) {
      setStatus('Please enter the admin password first to delete.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      setStatus('Post deleted successfully!');
      if (editId === id) handleClear();
      fetchPosts();
    } catch (err) {
      setStatus('Failed to delete. Check your password.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    // Auto-generate ID if it's a new post, else use existing editId
    const id = editId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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

      setStatus(`Blog ${editId ? 'updated' : 'posted'} successfully!`);
      handleClear();
      fetchPosts();
    } catch (err) {
      console.error(err);
      setStatus('Failed to post. Check your admin password.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 md:py-24 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{editId ? 'Edit Post' : 'New Post'}</h1>
          {editId && (
            <button onClick={handleClear} className="text-sm text-blue-600 hover:underline">
              Cancel Edit
            </button>
          )}
        </div>
        
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
            {editId ? 'Update Post' : 'Publish Post'}
          </button>

          {status && (
            <p className={`text-center font-medium ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          )}
        </form>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 h-fit">
        <h2 className="text-xl font-bold mb-4">Manage Posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">No dynamic posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col space-y-2">
                <span className="font-medium text-sm truncate">{post.title}</span>
                <span className="text-xs text-slate-500">{post.date}</span>
                <div className="flex space-x-3 pt-2">
                  <button onClick={() => handleEdit(post)} className="text-xs font-medium text-blue-600 hover:underline">Edit</button>
                  <button type="button" onClick={() => handleDelete(post.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
