import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Check initial scroll position
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-5 sm:bottom-20 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 border border-blue-400/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 active:translate-y-0 cursor-pointer group"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
