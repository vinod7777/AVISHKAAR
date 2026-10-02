import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic dive: sky -> water surface -> deep ocean.
 * ~3.2s total, skippable. Locks scroll while playing.
 */
const CinematicDiveIntro = ({ onDone }) => {
  const [phase, setPhase] = useState(0); // 0 sky, 1 splash, 2 dive, 3 done
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // Lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const t1 = setTimeout(() => setPhase(1), 700);   // splash
    const t2 = setTimeout(() => setPhase(2), 1500);  // dive
    const t3 = setTimeout(() => setPhase(3), 3200);  // done
    const t4 = setTimeout(() => {
      document.body.style.overflow = prevOverflow;
      onDone && onDone();
    }, 3600);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
      document.body.style.overflow = prevOverflow;
    };
  }, [onDone]);

  const skip = () => {
    if (skipped) return;
    setSkipped(true);
    setPhase(3);
    document.body.style.overflow = "";
    setTimeout(() => onDone && onDone(), 250);
  };

  if (phase >= 3 && skipped) return null;

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          key="dive"
          className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={skip}
          aria-label="Intro animation, click to skip"
        >
          {/* Sky -> Surface -> Deep gradient that shifts with phase */}
          <motion.div
            className="absolute inset-0"
            initial={{
              background:
                "linear-gradient(180deg, #87CEEB 0%, #4FB3D9 35%, #1E5F8C 70%, #062c43 100%)",
            }}
            animate={{
              background:
                phase >= 2
                  ? "linear-gradient(180deg, #021a2e 0%, #011627 40%, #000814 75%, #000000 100%)"
                  : phase >= 1
                  ? "linear-gradient(180deg, #4FB3D9 0%, #1E5F8C 30%, #062c43 70%, #011627 100%)"
                  : "linear-gradient(180deg, #87CEEB 0%, #4FB3D9 35%, #1E5F8C 70%, #062c43 100%)",
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Sun glow up top, fades when we plunge under */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: "-15%",
              width: "60vw",
              height: "60vw",
              background:
                "radial-gradient(circle, rgba(255,240,200,0.9) 0%, rgba(255,200,140,0.4) 35%, transparent 70%)",
              filter: "blur(20px)",
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: phase >= 2 ? 0 : phase >= 1 ? 0.5 : 1, scale: phase >= 1 ? 1.2 : 1 }}
            transition={{ duration: 1 }}
          />

          {/* Water surface line that rushes up past camera */}
          <motion.div
            className="absolute left-0 right-0"
            style={{
              height: "8vh",
              background:
                "linear-gradient(180deg, rgba(180,230,255,0.0) 0%, rgba(180,230,255,0.6) 40%, rgba(120,200,240,0.95) 60%, rgba(20,80,130,0.9) 100%)",
              boxShadow: "0 -20px 40px rgba(255,255,255,0.4), 0 20px 60px rgba(0,40,80,0.6)",
              filter: "blur(2px)",
            }}
            initial={{ top: "55%" }}
            animate={{ top: phase >= 2 ? "-15%" : phase >= 1 ? "20%" : "55%" }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* Splash burst */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.div
                className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 6, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                <div
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(180,230,255,0.5) 40%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bubble streams while diving — scaled down for mobile screens */}
          {phase >= 1 && (() => {
            const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
            const bubbleCount = isMobile ? 6 : 24;
            return Array.from({ length: bubbleCount }).map((_, i) => {
              const left = (i * (100 / bubbleCount)) % 100;
              const size = 6 + ((i * 7) % 18);
              const dur = 1.4 + (i % 5) * 0.25;
              const delay = (i % 8) * 0.08;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-cyan-200/50"
                  style={{
                    left: `${left}%`,
                    bottom: "-10%",
                    width: size,
                    height: size,
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(34,211,238,0.2), transparent)",
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: "-120vh", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: dur, delay, ease: "easeIn" }}
                />
              );
            });
          })()}

          {/* Caustic light streaks while underwater */}
          {phase >= 2 && (
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.8 }}
              style={{
                background:
                  "repeating-linear-gradient(180deg, transparent 0 40px, rgba(120,220,255,0.08) 40px 42px)",
              }}
            />
          )}

          {/* Vignette darkens as we descend */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 0.85 : 0.2 }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* Title pulse */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="font-display font-black tracking-[0.3em] md:tracking-[0.5em] text-cyan-50 drop-shadow-[0_0_30px_rgba(34,211,238,1)] text-center"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
              animate={{ 
                scale: phase >= 2 ? 1.5 : 1, 
                opacity: phase >= 2 ? 0 : 1,
              }}
              transition={{ duration: 1 }}
            >
              AVISHKAAR
            </motion.h1>
            <motion.div
              className="mt-6 px-8 py-2 border border-cyan-400/40 bg-cyan-900/30 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              animate={{ opacity: phase >= 2 ? 0 : 1, y: phase >= 2 ? 20 : 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <p className="text-sm md:text-lg font-mono font-bold uppercase tracking-[0.4em] text-cyan-100">
                Season 4
              </p>
            </motion.div>
          </motion.div>

          {/* Skip hint */}
          <div className="absolute bottom-6 right-6 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-cyan-100/70 pointer-events-none">
            Tap to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicDiveIntro;
