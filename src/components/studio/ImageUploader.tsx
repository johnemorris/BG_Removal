'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, ArrowRight, Link as LinkIcon, Image as ImageIcon, Zap } from 'lucide-react';
import { SAMPLE_IMAGES } from '@/lib/constants/presets';

interface ImageUploaderProps {
  onImageSelected: (source: string | File, name: string) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            onImageSelected(file, file.name || 'Pasted Image');
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected, isLoading]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file, file.name);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageSelected(file, file.name);
      e.target.value = '';
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlValue.trim()) {
      onImageSelected(urlValue.trim(), 'Web Image');
      setUrlValue('');
      setUrlInputOpen(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Sleek Floating Glass Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
          isDragging
            ? 'border-teal-400 bg-teal-500/10 shadow-glow-cyan scale-[1.01]'
            : 'border-white/15 hover:border-teal-500/60 glass-panel shadow-dark-elevated hover:shadow-glow-teal'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
          {/* Glowing Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400/20 to-cyan-500/10 border border-teal-500/30 text-teal-300 flex items-center justify-center group-hover:scale-110 group-hover:border-teal-400 transition-all duration-300 shadow-glow-teal">
            <Upload className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Upload an Image or Drop Here
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Drag & drop photos, paste from clipboard (<kbd className="px-1.5 py-0.5 text-[11px] font-mono font-semibold bg-white/10 text-teal-300 rounded border border-white/15">Ctrl+V</kbd>), or select from your device.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <span className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 group-hover:brightness-110 text-slate-950 font-extrabold text-xs sm:text-sm shadow-glow-teal transition-all active:scale-95">
              <span>Choose Image</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Supported Format & URL Trigger */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              PNG, JPG, WebP up to 30 MB
            </span>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUrlInputOpen(!urlInputOpen);
              }}
              className="text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center space-x-1 hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Enter URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* URL Input Bar */}
      {urlInputOpen && (
        <form
          onSubmit={handleUrlSubmit}
          className="flex items-center gap-2 p-2 glass-panel-glow rounded-2xl"
        >
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="Paste public image URL (https://...)..."
            className="flex-1 px-4 py-2 text-xs text-white placeholder-slate-500 outline-none bg-transparent"
            required
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Import
          </button>
        </form>
      )}

      {/* Sleek Dark Samples Gallery */}
      <div className="glass-panel rounded-3xl p-5 shadow-dark-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            No photo ready? Try an instant demo:
          </span>
          <span className="text-[11px] text-teal-400 font-medium">Click to test instant cutout</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onImageSelected(sample.originalUrl, sample.name)}
              disabled={isLoading}
              className="group relative flex flex-col items-center text-left rounded-2xl border border-white/10 bg-white/5 hover:border-teal-400/80 hover:bg-white/10 overflow-hidden transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary p-2"
            >
              <div className="w-full h-20 rounded-xl overflow-hidden relative bg-slate-800 mb-2">
                <img
                  src={sample.thumbUrl}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-1 right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-950/80 text-white backdrop-blur-xs border border-white/10">
                  {sample.category}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate w-full text-center">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
