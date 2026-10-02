import { useMemo } from "react";
import { useDeviceCapability } from "@/hooks/use-device-capability";
import { useSectionVisibility } from "./LazySection";

// CSS-driven floating particles - only active when current section is visible
const FloatingParticles = ({ count = 20 }) => {
  const { isLowEnd, isMobile, ready } = useDeviceCapability();
  const isSectionVisible = useSectionVisibility();

  const particles = useMemo(() => {
    if (!ready || !isSectionVisible) return [];
    const isMobileDevice = isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);
    // Subtle ambient touch on mobile (max 2), balanced on low-end (6), full on desktop (14)
    const actual = isMobileDevice ? Math.min(2, count) : isLowEnd ? Math.min(6, count) : Math.min(14, count);
    return Array.from({ length: actual }).map((_, i) => ({
      id: i,
      left: 6 + (i * (88 / actual)) + (Math.random() * 6 - 3),
      top: 10 + Math.random() * 80,
      duration: 4.5 + Math.random() * 3,
      delay: -(i * 1.2),
      hue: 195 + Math.random() * 20,
    }));
  }, [count, isLowEnd, isMobile, ready, isSectionVisible]);

  // Completely unmount particles when section is scrolled out of view
  if (!ready || !isSectionVisible) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes particleRise {
          0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
          25% { opacity: 0.75; }
          75% { opacity: 0.75; transform: translate3d(0, -60px, 0) scale(0.9); }
          100% { transform: translate3d(0, -100px, 0) scale(0.4); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: `hsl(${p.hue}, 100%, 65%)`,
            boxShadow: `0 0 3px hsl(${p.hue}, 100%, 55%)`,
            animation: `particleRise ${p.duration}s ease-out ${p.delay}s infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;

