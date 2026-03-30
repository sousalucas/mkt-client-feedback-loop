'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, ArrowUp, Minus } from 'lucide-react';
import { FeedbackSummary as FeedbackSummaryType } from '@/lib/types';

interface FeedbackSummaryProps {
  summary: FeedbackSummaryType;
}

const sentimentConfig = {
  positivo: { label: 'Positivo', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  neutro: { label: 'Neutro', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  negativo: { label: 'Negativo', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  misto: { label: 'Misto', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

const priorityConfig = {
  alta: { label: 'Alta', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  media: { label: 'Média', icon: ArrowUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  baixa: { label: 'Baixa', icon: Minus, color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export function FeedbackSummaryPanel({ summary }: FeedbackSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const sentiment = sentimentConfig[summary.overallSentiment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/5 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold">Resumo Inteligente</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${sentiment.bg}`}>
            <span className={sentiment.color}>{sentiment.label}</span>
          </span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-text-tertiary" /> : <ChevronDown className="h-4 w-4 text-text-tertiary" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Summary text */}
              <p className="text-sm text-text-secondary leading-relaxed">{summary.summaryText}</p>

              {/* Action Items */}
              {summary.actionItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    Itens de Ação ({summary.actionItems.length})
                  </h4>
                  <div className="space-y-2">
                    {summary.actionItems.map((item) => {
                      const priority = priorityConfig[item.priority];
                      const PriorityIcon = priority.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-bg-secondary/50 border border-border-subtle"
                        >
                          <div className={`p-1 rounded-md ${priority.bg}`}>
                            <PriorityIcon className={`h-3 w-3 ${priority.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-text-primary">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${priority.color}`}>{priority.label}</span>
                              <span className="text-xs text-text-tertiary">•</span>
                              <span className="text-xs text-text-tertiary capitalize">{item.category}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-text-tertiary">
                Gerado por IA a partir de {summary.rawAnnotationCount} anotações
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
