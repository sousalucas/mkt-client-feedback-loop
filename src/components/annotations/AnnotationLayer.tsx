'use client';

import { useState, useRef, useCallback } from 'react';
import { AnnotationPin } from './AnnotationPin';
import { AnnotationForm } from './AnnotationForm';
import { Annotation } from '@/lib/types';

interface AnnotationLayerProps {
  annotations: Annotation[];
  versionId: string;
  isAnnotating: boolean;
  selectedPinId: string | null;
  onPinClick: (id: string) => void;
  onAnnotationCreated: () => void;
  projectId: string;
  assetId: string;
  userName: string;
}

export function AnnotationLayer({
  annotations,
  versionId,
  isAnnotating,
  selectedPinId,
  onPinClick,
  onAnnotationCreated,
  projectId,
  assetId,
  userName,
}: AnnotationLayerProps) {
  const [newPin, setNewPin] = useState<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isAnnotating || !overlayRef.current) return;

      const rect = overlayRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setNewPin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    },
    [isAnnotating]
  );

  const handleFormSubmit = async (comment: string) => {
    if (!newPin) return;

    await fetch(`/api/projects/${projectId}/assets/${assetId}/annotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        versionId,
        x: newPin.x,
        y: newPin.y,
        comment,
        author: userName,
      }),
    });

    setNewPin(null);
    onAnnotationCreated();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClick}
      className={`absolute inset-0 z-10 ${isAnnotating ? 'cursor-crosshair' : ''}`}
    >
      {annotations.map((ann) => (
        <AnnotationPin
          key={ann.id}
          annotation={ann}
          isSelected={selectedPinId === ann.id}
          onClick={() => onPinClick(ann.id)}
        />
      ))}

      {newPin && (
        <div
          className="absolute z-20"
          style={{ left: `${newPin.x}%`, top: `${newPin.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pin text-white text-xs font-bold shadow-lg scale-check">
              {annotations.length + 1}
            </div>
            <AnnotationForm
              onSubmit={handleFormSubmit}
              onCancel={() => setNewPin(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
