'use client';

import { useEffect, useState, useCallback, use, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MousePointerClick, Eye, Check, RotateCcw,
  Sparkles, Upload, MessageSquare, GitBranch, Loader2,
} from 'lucide-react';
import { Asset, Version, Annotation, FeedbackSummary } from '@/lib/types';
import { AnnotationLayer } from '@/components/annotations/AnnotationLayer';
import { AnnotationList } from '@/components/annotations/AnnotationList';
import { VersionTimeline } from '@/components/versions/VersionTimeline';
import { FeedbackSummaryPanel } from '@/components/ai/FeedbackSummary';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/ui/Toast';

export default function AssetReviewPage({
  params,
}: {
  params: Promise<{ projectId: string; assetId: string }>;
}) {
  const { projectId, assetId } = use(params);
  const { userName } = useUser();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeVersion, setActiveVersion] = useState<Version | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [showApprovalComment, setShowApprovalComment] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'annotations' | 'versions'>('annotations');
  const [uploadingVersion, setUploadingVersion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/assets/${assetId}`);
      const data = await res.json();
      setAsset(data.asset);
      setVersions(data.versions);
      setActiveVersion(data.currentVersion);
      setAnnotations(data.annotations);
    } catch {
      toast('Erro ao carregar asset', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectId, assetId]);

  const fetchAnnotations = useCallback(async (versionId: string) => {
    const res = await fetch(`/api/projects/${projectId}/assets/${assetId}/annotations?versionId=${versionId}`);
    const data = await res.json();
    setAnnotations(data);
  }, [projectId, assetId]);

  const fetchSummary = useCallback(async () => {
    const res = await fetch(`/api/projects/${projectId}/assets/${assetId}/ai/summarize`);
    const data = await res.json();
    if (data) setSummary(data);
  }, [projectId, assetId]);

  useEffect(() => {
    fetchData();
    fetchSummary();
  }, [fetchData, fetchSummary]);

  const handleVersionSelect = async (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setActiveVersion(version);
      await fetchAnnotations(versionId);
      setSummary(null);
    }
  };

  const handleResolve = async (annotationId: string) => {
    await fetch(`/api/projects/${projectId}/assets/${assetId}/annotations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolve', annotationId }),
    });
    if (activeVersion) await fetchAnnotations(activeVersion.id);
  };

  const handleReply = async (annotationId: string, comment: string) => {
    await fetch(`/api/projects/${projectId}/assets/${assetId}/annotations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reply', annotationId, comment, author: userName || 'Anônimo' }),
    });
    if (activeVersion) await fetchAnnotations(activeVersion.id);
  };

  const handleApprove = async () => {
    await fetch(`/api/projects/${projectId}/assets/${assetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'aprovado', reviewer: userName || 'Anônimo' }),
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
    toast('Ativo aprovado!');
    fetchData();
  };

  const handleRequestChanges = async () => {
    if (!approvalComment.trim()) return;
    await fetch(`/api/projects/${projectId}/assets/${assetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'alteracoes_solicitadas',
        reviewer: userName || 'Anônimo',
        comment: approvalComment.trim(),
      }),
    });
    toast('Alterações solicitadas');
    setShowApprovalComment(false);
    setApprovalComment('');
    fetchData();
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/assets/${assetId}/ai/summarize`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSummary(data);
        toast('Resumo gerado com sucesso!');
      } else {
        toast(data.error || 'Erro ao gerar resumo', 'error');
      }
    } catch {
      toast('Erro ao gerar resumo', 'error');
    } finally {
      setSummarizing(false);
    }
  };

  const handleUploadVersion = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast('Arquivo deve ter no máximo 5MB', 'error');
      return;
    }
    setUploadingVersion(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/assets/${assetId}/versions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type,
            fileData: reader.result,
            uploadedBy: userName || 'Anônimo',
            changeNote: 'Nova versão enviada',
          }),
        });
        if (res.ok) {
          toast('Nova versão enviada!');
          fetchData();
        }
      } catch {
        toast('Erro ao enviar versão', 'error');
      } finally {
        setUploadingVersion(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!asset || !activeVersion) return null;

  const confettiColors = ['#5b8def', '#38bdf8', '#34d399', '#7ba4f7', '#a78bfa', '#fbbf24'];

  const panelContent = (
    <>
      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        <button
          onClick={() => setActiveTab('annotations')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'annotations'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{annotations.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'versions'
              ? 'text-accent border-b-2 border-accent'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>{versions.length}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {activeTab === 'annotations' ? (
          <>
            {summary && <FeedbackSummaryPanel summary={summary} />}
            <button
              onClick={handleSummarize}
              disabled={summarizing || annotations.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {summarizing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {summarizing ? 'Gerando resumo...' : 'Gerar Resumo IA'}
            </button>
            <AnnotationList
              annotations={annotations}
              selectedPinId={selectedPinId}
              onPinSelect={(id) => setSelectedPinId(id === selectedPinId ? null : id)}
              onResolve={handleResolve}
              onReply={handleReply}
            />
          </>
        ) : (
          <>
            <VersionTimeline
              versions={versions}
              currentVersionId={activeVersion.id}
              onVersionSelect={handleVersionSelect}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUploadVersion(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingVersion}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              {uploadingVersion ? 'Enviando...' : 'Enviar Nova Versão'}
            </button>
          </>
        )}
      </div>

      {/* Approval Actions */}
      <div className="border-t border-border p-3 sm:p-4 space-y-3 bg-bg-secondary shrink-0">
        <AnimatePresence>
          {showApprovalComment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Descreva as alterações necessárias..."
                rows={3}
                className="w-full rounded-xl border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 resize-none mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRequestChanges}
                  disabled={!approvalComment.trim()}
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => { setShowApprovalComment(false); setApprovalComment(''); }}
                  className="rounded-xl border border-border px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showApprovalComment && (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Check className="h-4 w-4" />
              Aprovar
            </button>
            <button
              onClick={() => setShowApprovalComment(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-amber-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              Alterações
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="confetti-piece rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: confettiColors[i % confettiColors.length],
                  animationDelay: `${Math.random() * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border px-3 sm:px-6 py-3 bg-bg-primary shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href={`/projetos/${projectId}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div className="h-5 w-px bg-border shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-text-primary truncate max-w-[150px] sm:max-w-xs">{asset.name}</h1>
            <div className="flex items-center gap-2">
              <StatusBadge status={asset.status} />
              <span className="text-xs text-text-tertiary">v{activeVersion.versionNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAnnotating(!isAnnotating)}
            className={`flex items-center gap-2 rounded-xl px-2.5 sm:px-3 py-2 text-sm font-medium transition-all ${
              isAnnotating
                ? 'bg-pin/20 text-pin border border-pin/30'
                : 'border border-border text-text-secondary hover:text-text-primary hover:border-accent/50'
            }`}
          >
            {isAnnotating ? <MousePointerClick className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden sm:inline">{isAnnotating ? 'Anotando' : 'Anotar'}</span>
          </button>
        </div>
      </div>

      {/* Main Content — stacks vertically on mobile, side-by-side on lg+ */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Image Viewer */}
        <div className="flex-[3] min-h-0 relative bg-bg-primary overflow-auto flex items-center justify-center p-3 lg:p-4">
          <div className="relative inline-block max-w-full max-h-full">
            <img
              src={activeVersion.fileData}
              alt={asset.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              draggable={false}
            />
            <AnnotationLayer
              annotations={annotations}
              versionId={activeVersion.id}
              isAnnotating={isAnnotating}
              selectedPinId={selectedPinId}
              onPinClick={(id) => setSelectedPinId(id === selectedPinId ? null : id)}
              onAnnotationCreated={() => fetchAnnotations(activeVersion.id)}
              projectId={projectId}
              assetId={assetId}
              userName={userName || 'Anônimo'}
            />
          </div>
        </div>

        {/* Sidebar — right panel on desktop, bottom panel on mobile */}
        <div className="flex-[2] min-h-0 lg:flex-none lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-bg-secondary flex flex-col overflow-hidden">
          {panelContent}
        </div>
      </div>
    </div>
  );
}
