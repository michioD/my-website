import { motion } from 'motion/react';
import { GraduationCap, Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { PROJECTS, BLOG_POSTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { BlogCard } from '../components/BlogCard';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-4">
            <GraduationCap size={18} />
            <span>Teknisk Matematik @ KTH</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            {/* Engineering Mathematics student focused on numerical analysis and optimization. */}
            Welcome 😸
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Hi, I'm Lucas. I study Engineering Mathematics at KTH Royal Institute of Technology in Stockholm. I'm passionate about solving complex problems using mathematical modeling and computational methods.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="mailto:lfrykman@kth.se" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors flex items-center space-x-2">
              <Mail size={16} />
              <span>Get in touch</span>
            </a>
            <div className="flex items-center space-x-3">
              <a href="https://github.com/michioD" className="p-2.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Github size={18} />
              </a>
              <a href="https://www.linkedin.com/in/lucas-frykman-ab289518a/" className="p-2.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 border-t border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Academic Projects</h2>
          <a href="https://github.com/michioD" className="text-sm font-semibold text-blue-600 hover:underline flex items-center space-x-1">
            <span>View GitHub</span>
            <ArrowUpRight size={14}/>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 border-t border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Writing & Notes</h2>
        </div>

        <div className="max-w-3xl">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
