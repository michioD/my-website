import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../constants';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col space-y-3 p-4 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all"
    >
      <div className="aspect-video overflow-hidden rounded-md bg-slate-100">
        <img 
          src={project.image} 
          alt={project.title}
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{project.title}</h3>
          <div className="flex space-x-2">
            <a href={project.link} className="text-slate-400 hover:text-slate-600 transition-colors">
              <Github size={16} />
            </a>
            <a href={project.link} className="text-slate-400 hover:text-slate-600 transition-colors">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map(tag => (
            <span key={tag} className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
