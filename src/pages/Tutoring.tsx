import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { PopupButton } from "react-calendly";

export default function Tutoring() {
  return (
    <div className="pt-32 pb-16 md:pt-48 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-heading)] tracking-tight mb-6">
          Tutoring
        </h1>

        <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
          I offer tutoring in mathematics and programming. Whether you're
          struggling with calculus, linear algebra, or want to learn how to
          code, I'm here to help.
        </p>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-8 md:p-12 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full mb-6">
            <Calendar size={32} />
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-4">
            Book a Session
          </h2>

          <p className="text-[var(--text-muted)] mb-8">
            Select a time that works for you.
          </p>

          <PopupButton
            url="https://calendly.com/frykman"
            rootElement={document.getElementById("root")}
            text="Book a Session"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition shadow-sm cursor-pointer"
          />
        </div>
      </motion.div>
    </div>
  );
}
