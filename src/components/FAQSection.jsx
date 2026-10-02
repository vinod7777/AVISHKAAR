import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import FloatingParticles from './FloatingParticles';

const faqData = {
  virtual: [
    {
      question: 'Who can participate in AVISHKAAR SEASON 4?',
      answer: 'Students from all academic backgrounds and levels can participate in AVISHKAAR SEASON 4. This includes undergraduate, graduate, and postgraduate students from various disciplines.',
    },
    {
      question: 'Can I participate in both Virtual and Physical Hackathon tracks?',
      answer: 'No, participants can only choose one track - either Virtual or Physical Hackathon. You cannot participate in both tracks simultaneously.',
    },
    {
      question: 'How will the pitching be conducted for the Virtual Hackathon?',
      answer: 'Virtual pitching will be conducted through online video conferencing platforms. Teams will present their projects to judges via screen sharing and live demonstrations.',
    },
    {
      question: 'What tools can I use during the Virtual Hackathon?',
      answer: 'You can use any programming languages, frameworks, or tools of your choice. There are no restrictions on the technology stack you use for your project.',
    },
  ],
  physical: [
    {
      question: 'What can be the team size in AVISHKAAR SEASON 4?',
      answer: 'Teams can consist of 1-4 members for AVISHKAAR SEASON 4. Individual participation is allowed, and teams cannot exceed 4 members.',
    },
    {
      question: 'Is there any security provided for our projects?',
      answer: 'Yes, adequate security measures will be in place to protect your projects and equipment during the Physical Hackathon. Secure storage facilities will be provided.',
    },
    {
      question: 'Food & Accommodation provision?',
      answer: 'Food and accommodation can be provided upon request with prior notice to the organizing committee. Please note that these facilities are not free and will be charged.',
    },
    {
      question: 'Is the food and accommodation free?',
      answer: 'No, food and accommodation are not free. They will be charged separately for participants who require them.',
    },
    {
      question: 'Can a team consist of students from different domains?',
      answer: 'Yes, interdisciplinary teams are encouraged. Students from different academic domains can form teams together to bring diverse perspectives to their projects.',
    },
    {
      question: 'Is there any registration fee?',
      answer: 'No, there is no registration fee for participating in AVISHKAAR SEASON 4. The event is free for all eligible participants.',
    },
    {
      question: 'What are the criteria for evaluation?',
      answer: 'Projects will be evaluated based on innovation, technical implementation, feasibility, presentation quality, and potential impact. Detailed rubrics will be shared with participants.',
    },
    {
      question: 'Will hardware support be available during the Physical Hackathon?',
      answer: 'Yes, basic hardware components and development boards will be available. However, teams are encouraged to bring their own specialized hardware if needed.',
    },
    {
      question: 'Do participants have to arrange their own travel?',
      answer: 'Yes, participants are responsible for arranging their own travel to the hackathon venue. Travel reimbursement may be available for selected teams based on specific criteria.',
    },
  ],
};
const FAQItem = ({ question, answer, isOpen, onClick, index }) => (<motion.div className="mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
  <motion.button className={`w-full p-5 text-left cursor-pointer flex justify-between items-center transition-all duration-300 rounded-xl glass-card ${isOpen ? 'ring-2 ring-primary/50' : ''}`} onClick={onClick} aria-expanded={isOpen} aria-label={`Toggle answer for: ${question}`} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
    <span className={`pr-4 font-display font-medium transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
      {question}
    </span>
    <motion.span className="text-2xl font-light shrink-0 text-primary" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
      +
    </motion.span>
  </motion.button>
  <AnimatePresence>
    {isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
      <div className="p-5 mt-2 rounded-xl border border-primary/20" style={{
        background: 'linear-gradient(135deg, hsl(195, 100%, 50% / 0.05), hsl(175, 100%, 45% / 0.02))',
      }}>
        <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
      </div>
    </motion.div>)}
  </AnimatePresence>
</motion.div>);
const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const handleToggle = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (<section ref={ref} className="relative py-24 overflow-hidden min-h-[50vh]" id="faq">
    <FloatingParticles count={40} />
    

    <motion.div className="absolute top-1/4 left-0 w-[400px] h-[400px] pointer-events-none" style={{
      background: 'radial-gradient(circle, hsl(195, 100%, 50% / 0.1), transparent 70%)',
    }} animate={{
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.1, 1],
    }} transition={{ duration: 5, repeat: Infinity }} />
    <motion.div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] pointer-events-none" style={{
      background: 'radial-gradient(circle, hsl(175, 100%, 45% / 0.1), transparent 70%)',
    }} animate={{
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.1, 1],
    }} transition={{ duration: 5, repeat: Infinity, delay: 2.5 }} />

    <div className="container mx-auto px-4 relative z-10">

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
        <motion.h2 className="text-4xl md:text-5xl font-display font-black mb-4 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          Frequently Asked Questions
        </motion.h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Got questions? We've got answers for both Virtual and Physical hackathon tracks.
        </p>
        <motion.div className="w-24 h-1 mx-auto rounded-full mt-6 bg-gradient-water" animate={{
          opacity: [0.7, 1, 0.7],
          scaleX: [0.9, 1, 0.9],
        }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>


      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

        <div>
          <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-display font-bold mb-8 flex items-center gap-3 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            Virtual Hackathon
          </motion.h3>
          <div>
            {faqData.virtual.map((faq, index) => (<FAQItem key={`virtual-${index}`} question={faq.question} answer={faq.answer} isOpen={openFAQ === `virtual-${index}`} onClick={() => handleToggle(`virtual-${index}`)} index={index} />))}
          </div>
        </div>


        <div>
          <motion.h3 initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-display font-bold mb-8 flex items-center gap-3 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            Physical Hackathon
          </motion.h3>
          <div>
            {faqData.physical.map((faq, index) => (<FAQItem key={`physical-${index}`} question={faq.question} answer={faq.answer} isOpen={openFAQ === `physical-${index}`} onClick={() => handleToggle(`physical-${index}`)} index={index} />))}
          </div>
        </div>
      </div>


      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-center mt-16">
        <p className="text-muted-foreground mb-4">
          Still have questions? We're here to help!
        </p>
        <motion.button className="btn-ocean neon-border font-display font-bold text-lg px-8 py-4" aria-label="Contact Us" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <span className="relative z-10 flex items-center gap-2">
            CONTACT US
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              →
            </motion.span>
          </span>
        </motion.button>
      </motion.div>
    </div>
  </section>);
};
export default FAQSection;
