import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export default function Tutoring() {
  return (
    <div className="pt-32 pb-16 md:pt-48 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          Tutoring
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          I offer tutoring in mathematics and programming. Whether you're struggling with calculus, linear algebra, or want to learn how to code, I'm here to help.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
            <Calendar size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Book a Session</h2>
          <p className="text-slate-600 mb-8">
            Select a time that works for you. Calendly link coming soon!
          </p>
          <div className="inline-block px-8 py-3 bg-slate-200 text-slate-500 font-semibold rounded-md cursor-not-allowed">
            Booking Unavailable
          </div>
        </div>
      </motion.div>
    </div>
  );
}
