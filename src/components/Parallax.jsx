import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * ParallaxSection — wraps a section with bold scroll-driven motion.
 * Variants:
 *  - "zoom": scale up as section enters, scale down as it leaves (pinned feel)
 *  - "rise": translateY parallax + fade reveal
 *  - "tilt": subtle 3D tilt + parallax
 *  - "mask": clip-path reveal as you scroll in
 */
export const ParallaxSection = ({
  children,
  variant = "rise",
  intensity = 1,
  className = "",
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Optimized subtle parallax values to avoid heavy GPU layer repaints
  const yRise = useTransform(scrollYProgress, [0, 0.5, 1], [40 * intensity, 0, -25 * intensity]);
  const opacityRise = useTransform(scrollYProgress, [0, 0.1, 1], [0.3, 1, 1]);

  const scaleZoom = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 1.01]);
  const opacityZoom = useTransform(scrollYProgress, [0, 0.1, 1], [0.3, 1, 1]);

  const rotateXTilt = useTransform(scrollYProgress, [0, 0.5, 1], [10 * intensity, 0, -8 * intensity]);
  const yTilt = useTransform(scrollYProgress, [0, 1], [60 * intensity, -60 * intensity]);

  const clipMask = useTransform(
    scrollYProgress,
    [0, 0.45],
    ["inset(0% 50% 0% 50% round 32px)", "inset(0% 0% 0% 0% round 0px)"]
  );

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  if (reduce || isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  if (variant === "zoom") {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={{
          scale: scaleZoom,
          opacity: opacityZoom,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === "tilt") {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={{
          y: yTilt,
          rotateX: rotateXTilt,
          transformPerspective: 1200,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === "mask") {
    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ clipPath: clipMask, WebkitClipPath: clipMask, willChange: "clip-path" }}
      >
        {children}
      </motion.div>
    );
  }

  // rise (default)
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: yRise, opacity: opacityRise, willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

// Helper: wrap a MotionValue<string> as a CSS filter string `blur(x)`
const useTransformToFilter = (mv) => useTransform(mv, (v) => `blur(${v})`);

/**
 * ParallaxLayer — for stacked depth elements (backgrounds inside a section).
 */
export const ParallaxLayer = ({ children, speed = 0.4, className = "", style = {} }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [200 * speed, -200 * speed]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y: reduce ? 0 : y, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
