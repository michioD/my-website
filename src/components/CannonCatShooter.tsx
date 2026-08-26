import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';

interface ProjectileCat {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  velocity: number;
  angle: number;
  rotation: number;
}

const CAT_EMOJIS = ['🐱', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐈', '🐈‍⬛'];

export const CannonCatShooter: React.FC = () => {
  const [cats, setCats] = useState<ProjectileCat[]>([]);
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [recoil, setRecoil] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [shotCount, setShotCount] = useState(0);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const shootCat = () => {
    const id = ++nextId.current;
    const emoji = CAT_EMOJIS[Math.floor(Math.random() * CAT_EMOJIS.length)];

    // Muzzle position relative to the container in percentages:
    // The cannon muzzle in goobers_cutout.png is around top-right of the cannon barrel (x: ~86%, y: ~36%)
    const startX = 86;
    const startY = 36;
    const angle = -25 + (Math.random() * 14 - 7); // ~ -25 deg upward trajectory
    const velocity = 800 + Math.random() * 300;
    const rotation = (Math.random() - 0.5) * 720;

    const newCat: ProjectileCat = {
      id,
      emoji,
      startX,
      startY,
      velocity,
      angle,
      rotation,
    };

    setCats((prev) => [...prev.slice(-15), newCat]);
    setMuzzleFlash(true);
    setRecoil(true);
    setShotCount((c) => c + 1);

    setTimeout(() => setMuzzleFlash(false), 150);
    setTimeout(() => setRecoil(false), 200);

    // Audio cue if sound is enabled (synthesized web audio pop/meow)
    if (soundEnabled && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {
        // audio context failed
      }
    }
  };

  // Clean up cats after animation
  useEffect(() => {
    if (cats.length === 0) return;
    const timer = setTimeout(() => {
      setCats((prev) => prev.filter((cat) => Date.now() - cat.id < 3000));
    }, 2500);
    return () => clearTimeout(timer);
  }, [cats]);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-12 rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl p-4 md:p-8">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-heading)] flex items-center gap-2">
            <Sparkles className="text-amber-400" size={20} />
            Cat Cannon
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-muted)]">
            Click the cannon or press the button to fire tactical felines
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-inner-bg)] text-[var(--text-muted)] hover:text-[var(--text-heading)] transition cursor-pointer"
            title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button
            onClick={shootCat}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>FIRE!</span>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-mono">{shotCount}</span>
          </button>
        </div>
      </div>

      {/* Interactive Cannon Scene Stage */}
      <div 
        ref={containerRef}
        onClick={shootCat}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-gradient-to-b from-sky-950/20 via-transparent to-emerald-950/20 border border-[var(--border-color)] flex items-end justify-center cursor-crosshair select-none group"
      >
        {/* Recoil wrapper on the cutout image */}
        <motion.div
          animate={recoil ? { x: -14, y: 4, rotate: -1 } : { x: 0, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 15 }}
          className="relative w-full h-full flex items-end justify-center"
        >
          <img
            src="/images/goobers_cutout.png"
            alt="Posed with cannon"
            className="max-h-full max-w-full object-contain filter drop-shadow-2xl pointer-events-none"
          />

          {/* Muzzle Flash VFX */}
          <AnimatePresence>
            {muzzleFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 0.15 }}
                style={{ top: '33%', left: '85%' }}
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-radial from-amber-200 via-orange-500 to-transparent rounded-full blur-xs animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-amber-100">
                  💥
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Flying Cats Trajectory Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          <AnimatePresence>
            {cats.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{
                  left: `${cat.startX}%`,
                  top: `${cat.startY}%`,
                  scale: 0.4,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  left: `${cat.startX + 90}%`,
                  top: `${cat.startY - 35}%`,
                  scale: [0.4, 1.4, 0.9],
                  opacity: [1, 1, 0],
                  rotate: cat.rotation,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.4,
                  ease: [0.15, 0.85, 0.35, 1.2],
                }}
                className="absolute text-3xl md:text-5xl drop-shadow-lg -translate-x-1/2 -translate-y-1/2"
              >
                {cat.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Hover Hint Overlay */}
        <div className="absolute bottom-3 right-3 text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] bg-[var(--card-bg)]/80 px-2 py-1 rounded backdrop-blur-xs border border-[var(--border-color)] pointer-events-none">
          Click anywhere to fire
        </div>
      </div>
    </div>
  );
};
