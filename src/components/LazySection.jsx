import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

// Context to notify child components (like particles/animations) to sleep when offscreen
export const SectionVisibilityContext = createContext(true);
export const useSectionVisibility = () => useContext(SectionVisibilityContext);

const LazySection = ({ children, className = '', animation = 'fade-up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsVisible(inView);
        if (inView) {
          setHasLoaded(true);
        }
      },
      // Activates early on mobile (240px) to prevent pop-in during fast swipe scrolling
      { rootMargin: isMobile ? '240px 0px' : '120px 0px', threshold: 0.02 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const offset = isMobile ? 16 : 40;

  // Lightweight ocean entrance
  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: offset },
      visible: { opacity: 1, y: 0 },
    },
    'fade-left': {
      hidden: { opacity: 0, x: -offset },
      visible: { opacity: 1, x: 0 },
    },
    'fade-right': {
      hidden: { opacity: 0, x: offset },
      visible: { opacity: 1, x: 0 },
    },
    'scale': {
      hidden: { opacity: 0, scale: isMobile ? 0.98 : 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  const selectedVariant = variants[animation] || variants['fade-up'];

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'section-active' : 'section-idle'}`}
      data-visible={isVisible}
    >
      <SectionVisibilityContext.Provider value={isVisible}>
        <motion.div
          initial="hidden"
          animate={isVisible || hasLoaded ? 'visible' : 'hidden'}
          variants={selectedVariant}
          transition={{
            duration: isMobile ? 0.35 : 0.6,
            delay: isVisible ? (isMobile ? Math.min(delay, 0.1) : delay) : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </SectionVisibilityContext.Provider>
    </div>
  );
};

export default LazySection;
