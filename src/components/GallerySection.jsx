import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useInView } from "framer-motion";
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Film,
  Award,
  ExternalLink,
} from "lucide-react";
import FloatingParticles from "./FloatingParticles";

// Gallery images with exact width, height and aspect ratio metadata
const galleryImages = [
  {
    id: 1,
    title: "Grand Poster Launch Banner",
    category: "Poster & Banner Drop",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_poster_launch_banner.jpg",
    width: 720,
    height: 1400,
    orientation: "portrait",
    size: "tall", // 720x1400 vertical poster fits tall slot
  },
  {
    id: 2,
    title: "Flashmob Opening Flare",
    category: "Flashmob Celebration",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_flashmob_intro.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "large", // 1200x798 landscape
  },
  {
    id: 3,
    title: "Flashmob Rhythm & Dance",
    category: "Student Flashmob",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_flashmob_dance_1.jpg",
    width: 1200,
    height: 800,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 4,
    title: "Groove & Coordination",
    category: "Dance Performance",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_flashmob_groove.jpg",
    width: 1200,
    height: 800,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 5,
    title: "Flashmob High Energy",
    category: "Campus Vibes",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_flashmob_energy.jpg",
    width: 1200,
    height: 800,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 6,
    title: "Cultural Fusion Flashmob",
    category: "Fusion Performance",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_flashmob_fusion.jpg",
    width: 1200,
    height: 800,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 7,
    title: "Campus Celebration & Crowd",
    category: "Crowd Cheers",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_flashmob_celebration.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "large",
  },
  {
    id: 8,
    title: "Avishkaar Organizing Committee",
    category: "Team Portrait",
    group: "Pre-Avishkaar Events",
    src: "/gallery/pre_avishkaar_organizing_team.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "large",
  },
  {
    id: 9,
    title: "Hackathon Inauguration",
    category: "Opening Ceremony",
    group: "Hackathon Highlights",
    src: "/gallery/hackthon_kickoff.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "large",
  },
  {
    id: 10,
    title: "Intense Coding Sprint",
    category: "Sprint Hours",
    group: "Hackathon Highlights",
    src: "/gallery/coding_session.jpg",
    width: 1200,
    height: 801,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 11,
    title: "Team Collaboration",
    category: "Innovation & Build",
    group: "Hackathon Highlights",
    src: "/gallery/team_collaboration.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 12,
    title: "Hands-on Workshop",
    category: "Skill Building",
    group: "Hackathon Highlights",
    src: "/gallery/workshop_session.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 13,
    title: "Networking & Community",
    category: "Connections",
    group: "Hackathon Highlights",
    src: "/gallery/networking_event.jpg",
    width: 1200,
    height: 798,
    orientation: "landscape",
    size: "normal",
  },
  {
    id: 14,
    title: "Prize Ceremony & Winners",
    category: "Grand Finale",
    group: "Hackathon Highlights",
    src: "/gallery/prize_ceremony.jpg",
    width: 1200,
    height: 751,
    orientation: "landscape",
    size: "large",
  },
];

const categories = ["All", "Pre-Avishkaar Events", "Hackathon Highlights"];
const INITIAL_DISPLAY_COUNT = 6;

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return galleryImages;
    return galleryImages.filter((image) => image.group === selectedCategory);
  }, [selectedCategory]);

  // Determine images currently visible in the bento grid
  const visibleImages = useMemo(() => {
    if (showAll) return filteredImages;
    return filteredImages.slice(0, INITIAL_DISPLAY_COUNT);
  }, [filteredImages, showAll]);

  const hasHiddenImages = filteredImages.length > INITIAL_DISPLAY_COUNT;

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setShowAll(false);
    setActiveImageIndex(null);
  };

  const openLightboxByImage = (image) => {
    const fullIndex = filteredImages.findIndex((img) => img.id === image.id);
    setActiveImageIndex(fullIndex >= 0 ? fullIndex : 0);
  };

  const openLightboxByIndex = (index) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const showNext = useCallback(() => {
    setActiveImageIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredImages.length));
  }, [filteredImages.length]);

  const showPrev = useCallback(() => {
    setActiveImageIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filteredImages.length) % filteredImages.length
    );
  }, [filteredImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeImageIndex, showNext, showPrev]);

  const activeImage =
    activeImageIndex !== null && activeImageIndex < filteredImages.length
      ? filteredImages[activeImageIndex]
      : null;

  return (
    <section ref={ref} className="relative py-24 overflow-hidden min-h-[50vh]" id="gallery">
      <FloatingParticles count={40} />

      {/* Static Deep Ocean Ambient Light Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            Moments & Highlights
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            GALLERY
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            From the Pre-Avishkaar poster launch and electrifying flashmob to high-energy hackathon sprints and victory celebrations.
          </p>
          <div className="w-24 h-1 mx-auto rounded-full mt-6 bg-gradient-water opacity-80" />
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? galleryImages.length
                : galleryImages.filter((img) => img.group === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-display tracking-wider transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105"
                    : "bg-card/60 border-cyan-500/20 text-muted-foreground hover:text-cyan-200 hover:border-cyan-400/40"
                }`}
              >
                {cat === "Pre-Avishkaar Events" && <Film className="w-3.5 h-3.5" />}
                {cat === "Hackathon Highlights" && <Award className="w-3.5 h-3.5" />}
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-cyan-400/25 text-cyan-200" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bento Grid — Responsive Layout displaying complete uncropped images */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px] grid-flow-dense"
        >
          <AnimatePresence>
            {visibleImages.map((image) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={image.id}
                onClick={() => openLightboxByImage(image)}
                style={{ contain: "paint" }}
                className={`relative overflow-hidden group cursor-pointer rounded-2xl border border-cyan-500/25 bg-slate-950/80 shadow-md hover:border-cyan-400/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all duration-300 flex items-center justify-center ${
                  image.size === "large"
                    ? "col-span-2 row-span-2"
                    : image.size === "tall"
                    ? "row-span-2"
                    : ""
                }`}
              >
                {/* Ambient Blurred Background to fill any letterbox space seamlessly */}
                <img
                  src={image.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-30 pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                />

                {/* Complete Foreground Image — 100% visible, never cropped! */}
                <img
                  src={image.src}
                  alt={image.title}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle Holographic Hover Tint */}
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                {/* Resolution Badge on Hover */}
                <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-cyan-400/30 text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-sm">
                  {image.width} × {image.height}
                </div>

                {/* Permanent Bottom Badge & Title with Soft Gradient */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 z-20 bg-gradient-to-t from-background/95 via-background/60 to-transparent flex items-end justify-between pointer-events-none">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-0.5 drop-shadow-sm">
                      {image.category}
                    </span>
                    <h3 className="font-display font-bold text-foreground text-xs md:text-sm truncate group-hover:text-cyan-200 transition-colors drop-shadow-md">
                      {image.title}
                    </h3>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/50 flex items-center justify-center text-cyan-300 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_12px_rgba(34,211,238,0.5)] flex-shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Lightweight CSS Tech Corners */}
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-l-2 border-t-2 border-cyan-400/50 group-hover:border-cyan-300 transition-colors duration-300 pointer-events-none z-20" />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50 group-hover:border-cyan-300 transition-colors duration-300 pointer-events-none z-20" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Action Controls: View More / Show Less & Fullscreen */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          {hasHiddenImages && (
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="btn-ocean neon-border font-display font-bold text-sm md:text-base px-7 py-3.5 inline-flex items-center gap-2.5 cursor-pointer"
              aria-label={showAll ? "Show Less Photos" : "View More Photos"}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="relative z-10">
                {showAll
                  ? "SHOW LESS"
                  : `VIEW MORE PHOTOS (+${filteredImages.length - INITIAL_DISPLAY_COUNT})`}
              </span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              )}
            </motion.button>
          )}

          <motion.button
            onClick={() => openLightboxByIndex(0)}
            className="px-6 py-3.5 rounded-xl font-display font-bold text-sm md:text-base bg-card/80 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:text-white hover:border-cyan-400 transition-all duration-300 inline-flex items-center gap-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
            aria-label="View All in Fullscreen"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>FULLSCREEN SLIDESHOW ({filteredImages.length})</span>
            <Maximize2 className="w-4 h-4 text-cyan-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-2xl"
            onClick={closeLightbox}
          >
            {/* Modal Dialog Content */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[95vh] bg-card/95 border border-cyan-500/40 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-background/60 backdrop-blur-md">
                <div className="flex items-center gap-2.5 flex-wrap min-w-0 mr-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex-shrink-0">
                    {activeImage.category}
                  </span>
                  <h3 className="font-display font-bold text-foreground text-sm md:text-base truncate">
                    {activeImage.title}
                  </h3>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                    {activeImage.width} × {activeImage.height}
                  </span>
                </div>

                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <span className="text-xs font-mono text-muted-foreground mr-1">
                    {activeImageIndex + 1} / {filteredImages.length}
                  </span>
                  <a
                    href={activeImage.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open original full resolution image in new tab"
                    aria-label="Open original image"
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={closeLightbox}
                    aria-label="Close Lightbox"
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Container — Displays the COMPLETE uncropped image */}
              <div className="relative flex items-center justify-center bg-black/80 p-2 md:p-4 min-h-[300px] max-h-[75vh] overflow-hidden flex-1">
                {/* Subtle ambient backdrop */}
                <img
                  src={activeImage.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-20 pointer-events-none"
                />

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage.id}
                    src={activeImage.src}
                    alt={activeImage.title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-cyan-500/30"
                  />
                </AnimatePresence>

                {/* Prev / Next Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous Image"
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-background/70 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/40 text-cyan-300 flex items-center justify-center transition-all shadow-lg hover:scale-110 z-20 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next Image"
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-background/70 hover:bg-cyan-500/30 backdrop-blur-md border border-cyan-400/40 text-cyan-300 flex items-center justify-center transition-all shadow-lg hover:scale-110 z-20 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Bottom Thumbnail Strip */}
              <div className="p-2.5 md:p-3 bg-background/70 backdrop-blur-md border-t border-border/60 overflow-x-auto flex gap-2 items-center justify-center">
                {filteredImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Jump to ${img.title}`}
                    className={`relative w-12 h-9 md:w-16 md:h-11 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 border bg-black/40 ${
                      idx === activeImageIndex
                        ? "border-cyan-400 ring-2 ring-cyan-400/70 scale-105 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                        : "border-border/60 opacity-50 hover:opacity-100 hover:border-cyan-500/50"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-contain object-center"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
