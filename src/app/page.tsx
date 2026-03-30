'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, Layers, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProjectWithStats } from '@/lib/types';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const totalAssets = projects.reduce((sum, p) => sum + p.totalAssets, 0);
  const totalApproved = projects.reduce((sum, p) => sum + p.approvedCount, 0);
  const totalChanges = projects.reduce((sum, p) => sum + p.changesRequestedCount, 0);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Painel de Projetos
        </h1>
        <p className="text-text-secondary">
          Gerencie aprovações de ativos criativos em um só lugar.
        </p>
      </motion.div>

      {/* Stats */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Projetos', value: projects.length, icon: Layers, color: 'text-accent' },
            { label: 'Ativos', value: totalAssets, icon: TrendingUp, color: 'text-blue-400' },
            { label: 'Aprovados', value: totalApproved, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Alterações', value: totalChanges, icon: AlertTriangle, color: 'text-amber-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-glass-border bg-glass backdrop-blur-sm p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-text-tertiary font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Nenhum projeto ainda"
          description="Crie seu primeiro projeto para começar a gerenciar aprovações de ativos criativos."
          action={
            <Link
              href="/novo-projeto"
              className="flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Criar Primeiro Projeto
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
