import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BLOG_POSTS, BlogPost } from '../constants';
import { API_BASE_URL } from '../config';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check static posts first
    const staticPost = BLOG_POSTS.find(p => p.id === id);
    if (staticPost) {
      setPost(staticPost);
      setLoading(false);
      return;
    }

    // If not found statically, fetch from DB
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then((data: BlogPost[]) => {
        const dbPost = data.find(p => p.id === id);
        if (dbPost) {
          // Parse read time dynamically for DB posts too
          const wordCount = dbPost.content.trim().split(/\s+/).length;
          const minutes = Math.max(1, Math.ceil(wordCount / 238));
          dbPost.readTime = `${minutes} min read`;
          setPost(dbPost);
        }
      })
      .catch(err => console.error('Failed to fetch blog post:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Update browser tab title dynamically for SEO and UX
  useEffect(() => {
    if (post) {
      document.title = `${post.title} - Lucas Frykman`;
    } else {
      document.title = 'Lucas Frykman';
    }

    // Cleanup: Reset title when the user leaves the blog post
    return () => {
      document.title = 'Lucas Frykman';
    };
  }, [post]);

  if (loading) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="py-12 md:py-24 max-w-3xl mx-auto"
    >
      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)] mb-8 group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>
      
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-heading)] mb-4">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-[var(--text-muted)] space-x-4">
          <span>{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      <div className="markdown-body">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
