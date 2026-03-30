'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AnnotationFormProps {
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export function AnnotationForm({ onSubmit, onCancel }: AnnotationFormProps) {
  const [comment, setComment] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) onSubmit(comment.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-bg-secondary p-3 shadow-2xl z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Adicione seu comentário..."
          rows={2}
          className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
            if (e.key === 'Escape') onCancel();
          }}
        />
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!comment.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            <Send className="h-3 w-3" />
            Enviar
          </button>
        </div>
      </form>
    </motion.div>
  );
}
