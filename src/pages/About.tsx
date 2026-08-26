import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="pt-32 pb-16 md:pt-48 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-[var(--text-heading)] tracking-tight mb-12">About Me</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="text-[var(--text-muted)] space-y-4 leading-relaxed text-lg">
              <p>
                I am currently pursuing my Master's degree in Engineering Mathematics at KTH. My academic interests lie at the intersection of applied mathematics, computer science, and physics.
              </p>
              <p>
                
              </p>
              <p>
                When I'm not studying, I enjoy working on side projects that challenge my understanding of algorithms and system design.
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-heading)] uppercase tracking-wider mb-4">Location</h3>
              <div className="flex items-center space-x-2 text-[var(--text-muted)]">
                <MapPin size={16} />
                <span>Stockholm, Sweden</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-heading)] uppercase tracking-wider mb-4">Education</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-[var(--text-heading)]">KTH Royal Institute of Technology</p>
                  <p className="text-sm text-[var(--text-muted)]">M.Sc. Computer Science</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-heading)]">KTH Royal Institute of Technology</p>
                  <p className="text-sm text-[var(--text-muted)]">B.Sc. Engineering Mathematics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
