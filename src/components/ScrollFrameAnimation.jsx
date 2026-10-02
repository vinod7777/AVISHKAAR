import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ScrollFrameAnimation = ({ children }) => {
  const videoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);

  // Track if hero is in viewport to freeze offscreen animations
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
      },
      { rootMargin: '100px 0px', threshold: 0.02 }
    );
    return () => observer.disconnect();
  }, []);

  // Lock scroll until video ends
  useEffect(() => {
    if (!videoEnded) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [videoEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    let hasStarted = false;
    let isStarting = false;
    let hasEnded = false;

    const startPlayback = async () => {
      if (hasStarted || isStarting) return;
      isStarting = true;
      video.pause();
      video.currentTime = 0;

      try {
        await video.play();
        hasStarted = true;
        video.currentTime = 0;
      } catch {
        // Browsers may block unmuted autoplay; start silently so loading never stalls.
        video.muted = true;
        try {
          await video.play();
          hasStarted = true;
          video.currentTime = 0;
        } catch {
          setVideoEnded(true);
        }
      } finally {
        isStarting = false;
      }
    };

    const handleMetadata = () => {
      video.pause();
      video.currentTime = 0;
    };
    const onEnded = () => {
      hasEnded = true;
      setVideoEnded(true);
    };
    const onError = () => {
      hasEnded = true;
      setVideoEnded(true);
    };
    const retryAudioAfterGesture = () => {
      if (hasEnded || !hasStarted || !video.muted) return;
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
      });
    };

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    video.addEventListener("canplaythrough", startPlayback);
    window.addEventListener("pointerdown", retryAudioAfterGesture);
    window.addEventListener("keydown", retryAudioAfterGesture);

    if (video.readyState >= 3) {
      startPlayback();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("canplaythrough", startPlayback);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      window.removeEventListener("pointerdown", retryAudioAfterGesture);
      window.removeEventListener("keydown", retryAudioAfterGesture);
    };
  }, []);

  return (
    <section
      ref={heroSectionRef}
      className={`relative w-full min-h-screen overflow-hidden ${isHeroInView ? 'section-active' : 'section-idle'}`}
      data-visible={isHeroInView}
      id="scroll-animation"
    >
      {/* Deep ocean gradient behind video */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #020617 0%, #032b43 25%, #011627 60%, #000814 85%, #000000 100%)",
        }}
      />

      {/* Video background - fixed during playback, then static last frame */}
      <div className={`${videoEnded ? "absolute" : "fixed"} inset-0 z-10`}>
        <video
          ref={videoRef}
          src="/videos/hero-bg.mp4"
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark dim overlay - fades in when video ends */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[15]"
        initial={{ opacity: 0 }}
        animate={{ opacity: videoEnded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.7) 0%, rgba(3,43,67,0.6) 25%, rgba(1,22,39,0.65) 50%, rgba(1,22,39,0.85) 75%, #011627 100%)",
        }}
      />

      {/* Bubbles overlay - only active and animated when Hero is on screen */}
      {isHeroInView && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes heroBubbleRise {
            0% { transform: translate3d(0, 0, 0); opacity: 0; }
            15% { opacity: 0.7; }
            85% { opacity: 0.7; }
            100% { transform: translate3d(0, -110vh, 0); opacity: 0; }
          }
        `}</style>
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 8)].map((_, i) => {
          const size = 4 + (i % 3) * 3.5;
          const left = 15 + i * 50;
          const dur = 6.5 + (i % 4) * 1.4;
          const delay = i * 1.1;
          return (
            <div
              key={i}
              className="absolute rounded-full border border-cyan-400/25"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                bottom: '-5%',
                background: 'radial-gradient(circle at 35% 35%, rgba(34,211,238,0.3), transparent)',
                animation: `heroBubbleRise ${dur}s linear ${delay}s infinite`,
                willChange: 'transform',
              }}
            />
          );
        })}
      </div>
      )}

      {/* Hero content - appears after video ends */}
      <motion.div
        className="relative z-30 min-h-screen"
        initial={{ opacity: 0, y: 30 }}
        animate={videoEnded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ pointerEvents: videoEnded ? "auto" : "none" }}
      >
        {children}
      </motion.div>

    </section>
  );
};

export default ScrollFrameAnimation;
