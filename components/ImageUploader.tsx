'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
  preview?: string | null;
}

export function ImageUploader({ onFileSelect, onClear, disabled, preview }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(preview ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = () => {
    setLocalPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  if (localPreview) {
    return (
      <div className="relative group rounded-[2rem] overflow-hidden border-2 border-orange-100 shadow-xl shadow-orange-500/5">
        <img src={localPreview} alt="Preview" className="w-full max-h-72 object-contain bg-white" />
        <div className="absolute inset-0 bg-orange-950/0 group-hover:bg-orange-950/20 transition-all flex items-center justify-center">
          <button
            onClick={handleClear}
            disabled={disabled}
            className="opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all p-3 rounded-2xl bg-white shadow-xl text-rose-500 hover:text-rose-600 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer group ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-200'
          : isDragging
          ? 'border-orange-400 bg-orange-50 scale-[1.02] shadow-xl shadow-orange-500/10'
          : 'border-orange-100 bg-white hover:border-orange-300 hover:bg-orange-50/30'
      }`}
    >
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${
        isDragging ? 'bg-orange-500 text-white rotate-6' : 'bg-orange-100 text-orange-500 group-hover:rotate-3 group-hover:bg-orange-200'
      }`}>
        <ImageIcon size={32} />
      </div>
      <div className="text-center">
        <p className="text-base font-black text-gray-700 tracking-tight">
          {isDragging ? 'Thả ảnh vào đây nào!' : 'Kéo thả hoặc nhấn để tải ảnh'}
        </p>
        <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-60">JPG, PNG, WebP — Tối đa 5MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
