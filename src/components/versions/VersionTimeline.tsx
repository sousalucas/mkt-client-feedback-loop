'use client';

import { motion } from 'motion/react';
import { Upload, Clock } from 'lucide-react';
import { Version } from '@/lib/types';
import { relativeTime } from '@/lib/utils';

interface VersionTimelineProps {
  versions: Version[];
  currentVersionId: string;
  onVersionSelect: (versionId: string) => void;
}

export function VersionTimeline({ versions, currentVersionId, onVersionSelect }: VersionTimelineProps) {
  const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-1">
      {sorted.map((version, i) => {
        const isCurrent = version.id === currentVersionId;
        return (
          <motion.button
            key={version.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onVersionSelect(version.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
              isCurrent
                ? 'bg-accent/10 border border-accent/30'
                : 'hover:bg-bg-hover border border-transparent'
            }`}
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center pt-1">
              <div
                className={`h-3 w-3 rounded-full ${
                  isCurrent ? 'bg-accent shadow-lg shadow-accent/30' : 'bg-bg-hover border border-border'
                }`}
              />
              {i < sorted.length - 1 && <div className="w-0.5 h-8 bg-border-subtle mt-1" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isCurrent ? 'text-accent' : 'text-text-primary'}`}>
                  v{version.versionNumber}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-medium bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                    Atual
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Upload className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs text-text-tertiary truncate">{version.uploadedBy}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-text-tertiary" />
                <span className="text-xs text-text-tertiary">{relativeTime(version.uploadedAt)}</span>
              </div>
              {version.changeNote && (
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">{version.changeNote}</p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
