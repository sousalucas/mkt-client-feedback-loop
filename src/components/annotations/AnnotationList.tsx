'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Circle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Annotation } from '@/lib/types';
import { relativeTime, avatarColor, getInitials } from '@/lib/utils';

interface AnnotationListProps {
  annotations: Annotation[];
  selectedPinId: string | null;
  onPinSelect: (id: string) => void;
  onResolve: (id: string) => void;
  onReply: (annotationId: string, comment: string) => void;
}

export function AnnotationList({
  annotations,
  selectedPinId,
  onPinSelect,
  onResolve,
  onReply,
}: AnnotationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const sorted = [...annotations].sort((a, b) => a.pinNumber - b.pinNumber);

  return (
    <div className="space-y-2">
      {sorted.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-6">
          Nenhuma anotação nesta versão. Clique na imagem para adicionar.
        </p>
      )}
      <AnimatePresence>
        {sorted.map((ann) => {
          const isExpanded = expandedId === ann.id;
          const color = avatarColor(ann.author);

          return (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`rounded-xl border transition-all cursor-pointer ${
                selectedPinId === ann.id
                  ? 'border-accent bg-accent/5'
                  : 'border-border-subtle bg-bg-tertiary/50 hover:border-border'
              }`}
              onClick={() => onPinSelect(ann.id)}
            >
              <div className="p-3">
                <div className="flex items-start gap-3">
                  {/* Pin number */}
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      ann.resolved ? 'bg-pin-resolved' : 'bg-pin'
                    }`}
                  >
                    {ann.pinNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {getInitials(ann.author)}
                      </div>
                      <span className="text-xs font-medium text-text-primary truncate">{ann.author}</span>
                      <span className="text-xs text-text-tertiary">{relativeTime(ann.createdAt)}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{ann.comment}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onResolve(ann.id); }}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                          ann.resolved
                            ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                            : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-hover'
                        }`}
                      >
                        {ann.resolved ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                        {ann.resolved ? 'Resolvido' : 'Resolver'}
                      </button>

                      {ann.replies.length > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : ann.id); }}
                          className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-secondary px-2 py-1 rounded-lg hover:bg-bg-hover transition-colors"
                        >
                          {ann.replies.length} {ann.replies.length === 1 ? 'resposta' : 'respostas'}
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : ann.id); }}
                        className="text-xs text-text-tertiary hover:text-accent px-2 py-1 rounded-lg hover:bg-bg-hover transition-colors"
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {isExpanded && (
                <div className="border-t border-border-subtle px-3 pb-3">
                  {ann.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2 mt-3 ml-9">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                        style={{ backgroundColor: avatarColor(reply.author) }}
                      >
                        {getInitials(reply.author)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-text-primary">{reply.author}</span>
                          <span className="text-xs text-text-tertiary">{relativeTime(reply.createdAt)}</span>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">{reply.comment}</p>
                      </div>
                    </div>
                  ))}

                  {/* Reply Input */}
                  <div className="flex items-center gap-2 mt-3 ml-9">
                    <input
                      type="text"
                      value={replyTexts[ann.id] || ''}
                      onChange={(e) => setReplyTexts((prev) => ({ ...prev, [ann.id]: e.target.value }))}
                      placeholder="Responder..."
                      className="flex-1 rounded-lg border border-border-subtle bg-bg-secondary px-3 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && replyTexts[ann.id]?.trim()) {
                          onReply(ann.id, replyTexts[ann.id].trim());
                          setReplyTexts((prev) => ({ ...prev, [ann.id]: '' }));
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (replyTexts[ann.id]?.trim()) {
                          onReply(ann.id, replyTexts[ann.id].trim());
                          setReplyTexts((prev) => ({ ...prev, [ann.id]: '' }));
                        }
                      }}
                      className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
