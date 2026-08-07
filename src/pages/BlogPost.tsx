import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BLOG_POSTS } from '../constants';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);

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
      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>
      
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-slate-500 space-x-4">
          <span>{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      <div className="prose prose-slate prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
