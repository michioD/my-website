import React from 'react';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      className="group flex flex-col space-y-3 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--border-hover)] hover:shadow-lg transition-all cursor-pointer relative"
    >
      {/* Main stretched link for the card */}
      {project.link.startsWith('/') ? (
        <Link to={project.link} className="absolute inset-0 z-0"><span className="sr-only">View {project.title}</span></Link>
      ) : (
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0"><span className="sr-only">View {project.title}</span></a>
      )}

      {/* Card Content wrapper */}
      <div className="relative z-10 pointer-events-none flex flex-col h-full flex-grow">
        <CardContent project={project} />
      </div>
    </motion.div>
  );
};

const CardContent: React.FC<{ project: Project }> = ({ project }) => (
  <>
    <div className="aspect-video overflow-hidden rounded-md bg-[var(--card-inner-bg)] mb-3 flex items-center justify-center border border-[var(--border-color)]">
      <img 
        src={project.image} 
        alt={project.title}
        className={`h-full w-full grayscale group-hover:grayscale-0 transition-all duration-500 ${project.imageClassName || 'object-cover object-center'}`}
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="flex flex-col space-y-1.5 flex-grow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text-heading)] group-hover:text-blue-500 transition-colors">{project.title}</h3>
      </div>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-2">
        {project.description}
      </p>
      <div className="flex items-end justify-between pt-2 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="font-mono text-[10px] text-[var(--tag-text)] bg-[var(--tag-bg)] px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        {project.githubLink && (
          <a 
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto text-[var(--text-muted)] hover:text-[var(--text-heading)] transition-colors ml-2"
            aria-label="View source on GitHub"
          >
            <Github size={16} />
          </a>
        )}
      </div>
    </div>
  </>
);
