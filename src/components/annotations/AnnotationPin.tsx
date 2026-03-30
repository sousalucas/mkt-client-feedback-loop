'use client';

import { motion } from 'motion/react';
import { Annotation } from '@/lib/types';

interface AnnotationPinProps {
  annotation: Annotation;
  isSelected: boolean;
  onClick: () => void;
}

export function AnnotationPin({ annotation, isSelected, onClick }: AnnotationPinProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
        annotation.resolved
          ? 'bg-pin-resolved hover:scale-110'
          : isSelected
          ? 'bg-pin scale-125 ring-2 ring-white/50'
          : 'bg-pin hover:scale-110 pin-pulse'
      }`}
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
      }}
      title={annotation.comment}
    >
      {annotation.pinNumber}
    </motion.button>
  );
}
