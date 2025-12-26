import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppPhase } from '../types';
import { TEXT, COLORS } from '../constants';

interface UIOverlayProps {
  phase: AppPhase;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ phase }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 p-4">
      
      <AnimatePresence>
        {/* Phase 1: Instructions for Gift */}
        {phase === AppPhase.OFFERING && (
          <motion.div
            key="instruction-gift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-20 text-center"
          >
            <p 
              className="font-serif-luxury text-sm tracking-[0.3em] uppercase opacity-60"
              style={{ color: COLORS.warmWhite }}
            >
              Tap to Open
            </p>
          </motion.div>
        )}

        {/* Phase 2: Instructions for Tree */}
        {phase === AppPhase.TREE && (
          <motion.div
            key="instruction-tree"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 2 }} // Wait for tree to form
            className="absolute bottom-20 text-center"
          >
             <p 
              className="font-serif-luxury text-sm tracking-[0.3em] uppercase opacity-60"
              style={{ color: COLORS.warmWhite }}
            >
              Ignite the Light
            </p>
          </motion.div>
        )}

        {/* Phase 4: Final Message */}
        {phase === AppPhase.MESSAGE && (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-center flex flex-col items-center gap-4"
          >
            {/* Khmer Text */}
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="font-khmer text-3xl md:text-5xl"
              style={{ 
                color: COLORS.gold,
                textShadow: `0 0 20px ${COLORS.darkGold}` 
              }}
            >
              {TEXT.khmer}
            </motion.h2>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 2 }}
              className="font-serif-luxury text-5xl md:text-8xl italic font-light tracking-wide my-4"
              style={{ color: COLORS.champagne }}
            >
              {TEXT.main}
            </motion.h1>

            {/* Divider */}
            <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: "100px", opacity: 0.5 }}
               transition={{ delay: 1.5, duration: 1.5 }}
               className="h-[1px] bg-white my-2"
            />

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 2, duration: 1.5 }}
              className="font-serif-luxury text-xl md:text-2xl tracking-widest uppercase"
              style={{ color: COLORS.warmWhite }}
            >
              {TEXT.sub}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};