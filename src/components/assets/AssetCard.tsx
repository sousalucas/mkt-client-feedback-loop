'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { MessageSquare, GitBranch } from 'lucide-react';
import { Asset, Version } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';

export function AssetCard({
  asset,
  version,
  projectId,
  annotationCount,
  index,
}: {
  asset: Asset;
  version?: Version;
  projectId: string;
  annotationCount: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/projetos/${projectId}/assets/${asset.id}`}
        className="group block rounded-2xl border border-glass-border bg-glass backdrop-blur-sm overflow-hidden transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] bg-bg-tertiary overflow-hidden">
          {version?.fileData && (
            <img
              src={version.fileData}
              alt={asset.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute top-3 right-3">
            <StatusBadge status={asset.status} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors truncate">
            {asset.name}
          </h3>
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5" />
              v{version?.versionNumber || 1}
            </span>
            {annotationCount > 0 && (
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                {annotationCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
