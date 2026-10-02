import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleAvishkaar from "./ParticleAvishkaar";
import ReadableParticleLoader from "./ReadableParticleLoader";
const avishkaarLanguages = [
    { text: "AVISHKAAR", language: "English" },
    { text: "आविष्कार", language: "Hindi" },
    { text: "ஆவிஷ்கார்", language: "Tamil" },
    { text: "ఆవిష్కార్", language: "Telugu" },
    { text: "আবিষ্কার", language: "Bengali" },
    { text: "ಆವಿಷ್ಕಾರ್", language: "Kannada" },
    { text: "ആവിഷ്കാർ", language: "Malayalam" },
    { text: "આવિષ્કાર", language: "Gujarati" },
    { text: "ਆਵਿਸ਼ਕਾਰ", language: "Punjabi" },
    { text: "ଆଭିଷ୍କାର", language: "Odia" },
    { text: "आविष्कार", language: "Marathi" },
];
const TypingEffect = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const currentWord = avishkaarLanguages[currentIndex].text;
    useEffect(() => {
        const handleTyping = () => {
            if (!isDeleting) {
                if (displayText.length < currentWord.length) {
                    setDisplayText(currentWord.slice(0, displayText.length + 1));
                }
                else {
                    // CHANGE HERE: Time the text stays on the display
                    setTimeout(() => setIsDeleting(true), 4000);
                    return;
                }
            }
            else {
                if (displayText.length > 0) {
                    setDisplayText(currentWord.slice(0, displayText.length - 1));
                }
                else {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % avishkaarLanguages.length);
                }
            }
        };
        // CHANGE HERE: Time between text transforms (Speed of typing/deleting, lower = faster)
        const baseSpeed = isDeleting ? 10 : 10;
        const jitter = Math.random() * 20 - 10;
        const timer = setTimeout(handleTyping, baseSpeed + jitter);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentWord]);
    return (
        <div className="relative w-full h-[200px] md:h-[300px] flex items-center justify-center">

            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="waterTextFilterTyping">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="3" seed="3" result="noise">
                            <animate attributeName="baseFrequency" values="0.015 0.04;0.02 0.06;0.015 0.04" dur="4s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            <div className="absolute inset-0 hidden md:flex items-center justify-center z-10 pointer-events-none">
                <div className="absolute inset-0 flex justify-center mt-[-10px] sm:mt-0">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={`drip-${i}`}
                            className="absolute rounded-full"
                            style={{
                                width: 3 + Math.random() * 3,
                                height: 8 + Math.random() * 10,
                                left: `${25 + i * 12}%`,
                                top: '40%',
                                background: 'linear-gradient(to bottom, hsl(195, 100%, 70% / 0.8), hsl(195, 100%, 50% / 0.3))',
                                borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                            }}
                            animate={{
                                y: [0, 30, 50],
                                opacity: [0.8, 0.5, 0],
                                scaleY: [1, 1.5, 0.5],
                            }}
                            transition={{
                                duration: 1.5 + Math.random(),
                                repeat: Infinity,
                                delay: i * 0.6 + Math.random() * 0.5,
                                ease: "easeIn",
                                repeatDelay: 1 + Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                <ParticleAvishkaar text={displayText} />
            </div>
        </div>
    );
};
export default TypingEffect;
