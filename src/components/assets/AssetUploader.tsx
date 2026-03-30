'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/ui/Toast';

interface AssetUploaderProps {
  projectId: string;
  onUploaded: () => void;
}

export function AssetUploader({ projectId, onUploaded }: AssetUploaderProps) {
  const { userName } = useUser();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [pendingFile, setPendingFile] = useState<{ data: string; name: string; mime: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast('Arquivo deve ter no máximo 5MB', 'error');
      return;
    }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast('Apenas imagens e vídeos são aceitos', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile({ data: reader.result as string, name: file.name, mime: file.type });
      setAssetName(file.name.replace(/\.[^.]+$/, ''));
      setShowNameInput(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleUpload = async () => {
    if (!pendingFile || !assetName.trim()) return;
    setIsUploading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: assetName.trim(),
          type: pendingFile.mime.startsWith('video/') ? 'video' : 'image',
          fileName: pendingFile.name,
          mimeType: pendingFile.mime,
          fileData: pendingFile.data,
          uploadedBy: userName || 'Anônimo',
        }),
      });
      if (res.ok) {
        toast('Ativo enviado com sucesso!');
        onUploaded();
        setShowNameInput(false);
        setPendingFile(null);
        setAssetName('');
      } else {
        toast('Erro ao enviar ativo', 'error');
      }
    } catch {
      toast('Erro ao enviar ativo', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-5 sm:p-8 text-center transition-all ${
          isDragging
            ? 'border-accent bg-accent/5 scale-[1.01]'
            : 'border-border hover:border-accent/50 hover:bg-bg-secondary'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          className="hidden"
        />
        <Upload className="mx-auto h-8 w-8 text-text-tertiary mb-3" />
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-accent">Clique para enviar</span> ou arraste um arquivo aqui
        </p>
        <p className="text-xs text-text-tertiary mt-1">PNG, JPG, SVG, GIF, MP4 (máx. 5MB)</p>
      </div>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowNameInput(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileImage className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Novo Ativo</h3>
                </div>
                <button onClick={() => setShowNameInput(false)}>
                  <X className="h-5 w-5 text-text-tertiary hover:text-text-primary" />
                </button>
              </div>

              {pendingFile && (
                <div className="mb-4 rounded-xl overflow-hidden bg-bg-tertiary">
                  <img src={pendingFile.data} alt="Preview" className="w-full h-32 sm:h-40 object-contain" />
                </div>
              )}

              <label className="block text-sm font-medium text-text-primary mb-2">
                Nome do ativo
              </label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="Ex: Banner Homepage"
                className="w-full rounded-xl border border-border bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent mb-4"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleUpload()}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !assetName.trim()}
                  className="flex-1 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  {isUploading ? 'Enviando...' : 'Enviar Ativo'}
                </button>
                <button
                  onClick={() => setShowNameInput(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
