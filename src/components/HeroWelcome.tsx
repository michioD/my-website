import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';

interface FullscreenPhysicsCat {
  id: number;
  imageSrc: string;
  x: number; // Viewport clientX (px)
  y: number; // Viewport clientY (px)
  vx: number; // horizontal velocity (px/s)
  vy: number; // vertical velocity (px/s)
  rotation: number; // degrees
  vRot: number; // angular velocity (deg/s)
  size: number; // width/height in px
  bounces: number;
  resting: boolean;
  opacity: number;
  createdAt: number;
}

const REAL_CAT_IMAGES = [
  // '/images/cats/cat1.png',
  // '/images/cats/cat2.png',
  '/images/cats/cat3.png',
  '/images/cats/cat4.png',
  '/images/cats/cat5.png',
  // '/images/cats/cat6.png',
  '/images/cats/cat7.png',
  '/images/cats/mauricio.png',
  '/images/cats/pluton.png',
  '/images/cats/dorian.png',
];

export const HeroWelcome: React.FC = () => {
  // Coin flip: 50% typewriter vs 50% cannon shot
  const [mode, setMode] = useState<'typewriter' | 'cannon'>(() => {
    return Math.random() < 0.5 ? 'cannon' : 'typewriter';
  });

  // Typewriter state
  const [displayedText, setDisplayedText] = useState('');
  const [typePhase, setTypePhase] = useState<'typing' | 'waiting' | 'deleting' | 'done'>('typing');

  // Cannon state
  const [welcomeFired, setWelcomeFired] = useState(false);
  const [welcomeLanded, setWelcomeLanded] = useState(false);
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [recoil, setRecoil] = useState(false);
  const [cats, setCats] = useState<FullscreenPhysicsCat[]>([]);
  const [catShotCount, setCatShotCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const catsRef = useRef<FullscreenPhysicsCat[]>([]);
  catsRef.current = cats;

  // Typewriter effect
  useEffect(() => {
    if (mode !== 'typewriter') return;
    const text = 'Welcome :)';
    let index = 0;

    if (typePhase === 'typing') {
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(intervalId);
          setTypePhase('waiting');
        }
      }, 100);
      return () => clearInterval(intervalId);
    }

    if (typePhase === 'waiting') {
      const timeoutId = setTimeout(() => {
        setTypePhase('deleting');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }

    if (typePhase === 'deleting') {
      index = text.length;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, index - 1));
        index--;
        if (index <= 0) {
          clearInterval(intervalId);
          setTypePhase('done');
        }
      }, 50);
      return () => clearInterval(intervalId);
    }
  }, [typePhase, mode]);

  // Cannon initial launch
  useEffect(() => {
    if (mode === 'cannon') {
      const timer = setTimeout(() => {
        fireWelcomeBanner();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const fireWelcomeBanner = () => {
    setMuzzleFlash(true);
    setRecoil(true);
    setWelcomeFired(true);

    setTimeout(() => setMuzzleFlash(false), 200);
    setTimeout(() => setRecoil(false), 250);
    setTimeout(() => setWelcomeLanded(true), 900);
  };

  // Continuous physics simulation loop bouncing across the entire viewport/screen
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (catsRef.current.length > 0) {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        const gravity = 850; // px/s^2 (snappy, energetic bounce gravity)
        const bounceRestitution = 0.75; // energetic bounciness
        const friction = 0.98; // smooth horizontal glide

        const updated = catsRef.current
          .map((cat) => {
            const age = (time - cat.createdAt) / 1000;
            // Fade out after 14 seconds
            const opacity = age > 11 ? Math.max(0, 1 - (age - 11) / 3) : 1;

            if (cat.resting) {
              return { ...cat, opacity };
            }

            let nx = cat.x + cat.vx * dt;
            let ny = cat.y + cat.vy * dt;
            let nvx = cat.vx * friction;
            let nvy = cat.vy + gravity * dt;
            let nRot = cat.rotation + cat.vRot * dt;
            let nvRot = cat.vRot * 0.99;
            let bounces = cat.bounces;
            let resting = false;

            const radius = cat.size / 2;

            // Bottom edge collision (screen floor)
            if (ny + radius >= screenH) {
              ny = screenH - radius;
              nvy = -Math.abs(nvy) * bounceRestitution;
              nvRot = nvRot * 0.85;
              bounces += 1;

              // Settle if barely moving after several bounces
              if (Math.abs(nvy) < 40 && bounces >= 5) {
                nvy = 0;
                nvx = 0;
                nvRot = 0;
                resting = true;
              }
            }

            // Top edge collision (ceiling)
            if (ny - radius <= 0) {
              ny = radius;
              nvy = Math.abs(nvy) * bounceRestitution;
              bounces += 1;
            }

            // Right edge collision
            if (nx + radius >= screenW) {
              nx = screenW - radius;
              nvx = -Math.abs(nvx) * bounceRestitution;
              nvRot = -nvRot * 0.8;
              bounces += 1;
            }

            // Left edge collision
            if (nx - radius <= 0) {
              nx = radius;
              nvx = Math.abs(nvx) * bounceRestitution;
              nvRot = -nvRot * 0.8;
              bounces += 1;
            }

            return {
              ...cat,
              x: nx,
              y: ny,
              vx: nvx,
              vy: nvy,
              rotation: nRot,
              vRot: nvRot,
              bounces,
              resting,
              opacity,
            };
          })
          .filter((cat) => cat.opacity > 0);

        setCats(updated);
      }

      animFrame = requestAnimationFrame(updatePhysics);
    };

    animFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const shootCat = () => {
    const id = ++nextId.current;
    const imageSrc = REAL_CAT_IMAGES[Math.floor(Math.random() * REAL_CAT_IMAGES.length)];

    let startX = window.innerWidth * 0.65;
    let startY = window.innerHeight * 0.35;

    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect();
      // Muzzle location in viewport coordinates:
      startX = bounds.left + bounds.width * 0.86;
      startY = bounds.top + bounds.height * 0.36;
    }

    // Randomized launch power profiles (ranging from soft pop ~300px/s to hypersonic blast ~1800px/s)
    const speed = Math.random() < 0.25
      ? 350 + Math.random() * 250 // Gentle pop
      : Math.random() < 0.75
        ? 700 + Math.random() * 500 // Medium cannon blast
        : 1300 + Math.random() * 600; // Hypersonic rocket launch

    // Highly randomized trajectory angle (-65 deg steep mortar up to -5 deg laser beam)
    const angleDeg = -35 + (Math.random() * 50 - 25);
    const angleRad = angleDeg * (Math.PI / 180);

    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;
    const vRot = (Math.random() - 0.5) * (speed * 0.9); // spin proportional to launch speed
    const size = 48 + Math.random() * 32;

    const newCat: FullscreenPhysicsCat = {
      id,
      imageSrc,
      x: startX,
      y: startY,
      vx,
      vy,
      rotation: (Math.random() - 0.5) * 60,
      vRot,
      size,
      bounces: 0,
      resting: false,
      opacity: 1,
      createdAt: performance.now(),
    };

    setCats((prev) => [...prev.slice(-25), newCat]);
    setMuzzleFlash(true);
    setRecoil(true);
    setCatShotCount((c) => c + 1);

    setTimeout(() => setMuzzleFlash(false), 150);
    setTimeout(() => setRecoil(false), 200);
  };

  const handleCannonClick = () => {
    if (!welcomeFired) {
      fireWelcomeBanner();
    } else {
      shootCat();
    }
  };

  const rerollMode = () => {
    setMode((prev) => (prev === 'cannon' ? 'typewriter' : 'cannon'));
    setWelcomeFired(false);
    setWelcomeLanded(false);
    setTypePhase('typing');
    setDisplayedText('');
    setCats([]);
  };

  return (
    <div className="relative mb-8">
      {/* Fullscreen Fixed Physics Layer for Bouncing Cats across the whole page */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {cats.map((cat) => (
          <div
            key={cat.id}
            style={{
              position: 'absolute',
              left: `${cat.x}px`,
              top: `${cat.y}px`,
              width: `${cat.size}px`,
              height: `${cat.size}px`,
              transform: `translate(-50%, -50%) rotate(${cat.rotation}deg)`,
              opacity: cat.opacity,
              transition: 'opacity 0.25s ease',
            }}
            className="pointer-events-none select-none drop-shadow-xl"
          >
            <img
              src={cat.imageSrc}
              alt="Bouncing cat"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        ))}
      </div>

      {/* Mode Indicator & Reroll */}
      {/* <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] bg-[var(--card-bg)] px-2 py-0.5 rounded border border-[var(--border-color)]">
          Hero Mode: {mode === 'cannon' ? '🎯 Cannon Shot' : '⌨️ Typewriter'} (50/50 roll)
        </span>
        <button
          onClick={rerollMode}
          className="text-[10px] font-mono uppercase text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
          title="Switch hero mode"
        >
          <RefreshCw size={10} /> Reroll
        </button>
      </div> */}

      {mode === 'typewriter' ? (
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-heading)] tracking-tight mb-6 min-h-[3rem] md:min-h-[4rem] flex items-center">
          <AnimatePresence mode="wait">
            {typePhase !== 'done' && (
              <motion.span key="welcome" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="block">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-[4px] h-[0.9em] bg-blue-500 align-middle ml-2"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </h1>
      ) : (
        <div className="relative w-full max-w-2xl">
          {/* Main Title Heading that gets shot out or rests */}
          <div className="min-h-[3.5rem] md:min-h-[4.5rem] flex items-center">
            {welcomeLanded ? (
              <motion.h1 
                initial={{ scale: 1.3, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl md:text-6xl font-bold text-[var(--text-heading)] tracking-tight flex items-center gap-2"
              >
                <span>Welcome :)</span>
                {catShotCount > 0 && (
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {catShotCount} 🐱 bouncing
                  </span>
                )}
              </motion.h1>
            ) : (
              <div className="h-12" />
            )}
          </div>

          {/* Cannon Stage Canvas */}
          <div 
            ref={containerRef}
            onClick={handleCannonClick}
            className="relative w-full h-48 sm:h-60 md:h-72 flex items-end justify-center cursor-pointer select-none group"
          >
            {/* Recoil wrapper on the cutout image */}
            <motion.div
              animate={recoil ? { x: -14, y: 4, rotate: -2 } : { x: 0, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 700, damping: 14 }}
              className="relative w-full h-full flex items-end justify-center"
            >
              <img
                src="/images/goobers_cutout.png"
                alt="Posed under cannon"
                className="max-h-full max-w-full object-contain filter drop-shadow-xl pointer-events-none"
              />

              {/* Muzzle Flash VFX */}
              <AnimatePresence>
                {muzzleFlash && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: 1, scale: 1.8 }}
                    exit={{ opacity: 0, scale: 2.2 }}
                    transition={{ duration: 0.15 }}
                    style={{ top: '35%', left: '86%' }}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-radial from-amber-200 via-orange-500 to-transparent rounded-full blur-xs animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-amber-100">
                      💥
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Welcome Projectile Arc */}
            <AnimatePresence>
              {welcomeFired && !welcomeLanded && (
                <motion.div
                  initial={{
                    left: '86%',
                    top: '36%',
                    scale: 0.3,
                    opacity: 1,
                    rotate: -30,
                  }}
                  animate={{
                    left: ['86%', '50%', '10%'],
                    top: ['36%', '-30%', '-60%'],
                    scale: [0.3, 1.2, 1],
                    opacity: [1, 1, 0.9],
                    rotate: [-30, 0, 10],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="absolute z-50 text-2xl md:text-4xl font-extrabold text-amber-400 drop-shadow-md bg-[var(--card-bg)] px-3 py-1 rounded-xl border border-amber-400"
                >
                  🚀 Welcome :)
                </motion.div>
              )}
            </AnimatePresence>
            {/* Click Prompt */}
            <div className="absolute bottom-1 right-2 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--card-bg)]/60 backdrop-blur-xs px-2 py-0.5 rounded border border-[var(--border-color)] pointer-events-none select-none">
              Click cannon to shoot cats 🐱
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
