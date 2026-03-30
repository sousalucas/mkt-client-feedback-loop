'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';
import { ProjectWithStats, Asset, Version, Annotation } from '@/lib/types';
import { AssetCard } from '@/components/assets/AssetCard';
import { AssetUploader } from '@/components/assets/AssetUploader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/Toast';

interface AssetData {
  asset: Asset;
  currentVersion?: Version;
  annotations: Annotation[];
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<ProjectWithStats | null>(null);
  const [assetsData, setAssetsData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [projRes, assetsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/assets`),
      ]);
      const proj = await projRes.json();
      const assetsList: Asset[] = await assetsRes.json();

      setProject(proj);

      const details = await Promise.all(
        assetsList.map(async (asset) => {
          const res = await fetch(`/api/projects/${projectId}/assets/${asset.id}`);
          return res.json();
        })
      );
      setAssetsData(details);
    } catch {
      toast('Erro ao carregar projeto', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Tem certeza que deseja excluir este ativo?')) return;
    await fetch(`/api/projects/${projectId}/assets/${assetId}`, { method: 'DELETE' });
    toast('Ativo excluído');
    fetchData();
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!project) return <EmptyState title="Projeto não encontrado" description="O projeto solicitado não existe." />;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos projetos
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{project.name}</h1>
            <p className="text-sm text-text-secondary mb-1">{project.client}</p>
            {project.description && (
              <p className="text-sm text-text-tertiary max-w-xl">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <ImageIcon className="h-4 w-4 text-text-tertiary" />
              <span className="text-text-secondary">{project.totalAssets} ativos</span>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        {project.totalAssets > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.approvedCount > 0 && <StatusBadge status="aprovado" size="md" />}
            {project.changesRequestedCount > 0 && <StatusBadge status="alteracoes_solicitadas" size="md" />}
            {project.pendingCount > 0 && <StatusBadge status="pendente" size="md" />}
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-8">
          <AssetUploader projectId={projectId} onUploaded={fetchData} />
        </div>

        {/* Assets Grid */}
        {assetsData.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="Nenhum ativo ainda"
            description="Envie seu primeiro ativo arrastando um arquivo para a área acima."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetsData.map((data, i) => (
              <div key={data.asset.id} className="relative group">
                <AssetCard
                  asset={data.asset}
                  version={data.currentVersion}
                  projectId={projectId}
                  annotationCount={data.annotations.length}
                  index={i}
                />
                <button
                  onClick={(e) => { e.preventDefault(); handleDeleteAsset(data.asset.id); }}
                  className="absolute top-3 left-3 p-2 rounded-xl bg-red-500/80 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
