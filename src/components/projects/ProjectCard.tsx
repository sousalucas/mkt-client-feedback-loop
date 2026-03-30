'use client';

import Link from 'next/link';
import { Briefcase, Image, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { ProjectWithStats } from '@/lib/types';
import { relativeTime } from '@/lib/utils';

export function ProjectCard({ project, index }: { project: ProjectWithStats; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/projetos/${project.id}`}
        className="group block rounded-2xl border border-glass-border bg-glass backdrop-blur-sm p-4 sm:p-6 transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:scale-[1.01]"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-sky-400/15 border border-accent/15">
            <Briefcase className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xs text-text-tertiary">{relativeTime(project.updatedAt)}</span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors line-clamp-2">
          {project.name}
        </h3>
        <p className="text-sm text-text-secondary mb-1">{project.client}</p>
        <p className="text-sm text-text-tertiary line-clamp-2 mb-4">{project.description}</p>

        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <Image className="h-3.5 w-3.5" />
            {project.totalAssets} {project.totalAssets === 1 ? 'ativo' : 'ativos'}
          </span>
          {project.approvedCount > 0 && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" />
              {project.approvedCount}
            </span>
          )}
          {project.changesRequestedCount > 0 && (
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {project.changesRequestedCount}
            </span>
          )}
          {project.pendingCount > 0 && (
            <span className="flex items-center gap-1.5 text-accent">
              <Clock className="h-3.5 w-3.5" />
              {project.pendingCount}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
