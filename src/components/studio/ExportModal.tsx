'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Sparkles, 
  X, 
  Layers 
} from 'lucide-react';
import { deductCredit, getStoredUserState } from '@/lib/store/userStore';
import { BackgroundPreset } from '@/lib/constants/presets';
import { ShadowSettings, renderCompositedCanvas } from '@/lib/engine/shadowRenderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cutoutUrl: string;
  originalUrl?: string;
  background: BackgroundPreset;
  shadow: ShadowSettings;
  blurOriginalBg: number;
  width: number;
  height: number;
  filename?: string;
  onOpenUpgradeModal: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cutoutUrl,
  originalUrl,
  background,
  shadow,
  blurOriginalBg,
  width,
  height,
  filename = 'clearcut-image',
  onOpenUpgradeModal,
}) => {
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const userState = getStoredUserState();
  const credits = userState.credits;

  if (!isOpen) return null;

  const triggerDownload = async (isHighRes: boolean) => {
    setIsExporting(true);

    try {
      if (isHighRes) {
        if (credits <= 0) {
          onClose();
          onOpenUpgradeModal();
          return;
        }
        deductCredit();
      }

      const scale = isHighRes ? 1 : 0.5;
      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);

      const canvas = await renderCompositedCanvas({
        cutoutUrl,
        originalUrl,
        background: format === 'jpg' && background.type === 'transparent'
          ? { id: 'white', name: 'White', type: 'color', value: '#ffffff', previewBg: '#ffffff' }
          : background,
        shadow,
        blurOriginalBg,
        width: targetW,
        height: targetH,
      });

      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const ext = format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${filename.replace(/\.[^/.]+$/, '')}-${isHighRes ? '4k-hd' : 'preview'}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });

      onClose();
    } catch (e) {
      console.error('Export error:', e);
      alert('Failed to generate export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-studio-950 text-white rounded-3xl shadow-dark-elevated border border-white/15 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-glow-teal">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight">
                Export Photo Studio Asset
              </h3>
              <p className="text-xs text-slate-400">
                Choose format and export resolution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormat('png')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  format === 'png'
                    ? 'border-teal-400 bg-teal-500/15 text-teal-300 shadow-glow-teal'
                    : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                PNG (Alpha)
              </button>
              <button
                onClick={() => setFormat('jpg')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  format === 'jpg'
                    ? 'border-teal-400 bg-teal-500/15 text-teal-300 shadow-glow-teal'
                    : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                JPG (Backdrop)
              </button>
              <button
                onClick={() => setFormat('webp')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  format === 'webp'
                    ? 'border-teal-400 bg-teal-500/15 text-teal-300 shadow-glow-teal'
                    : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                WebP (Ultra)
              </button>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">
              Resolution
            </label>

            {/* High-Res Option */}
            <div className="p-4 rounded-2xl border-2 border-teal-400 bg-teal-500/10 relative space-y-2 shadow-glow-teal">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-white">
                    Full High-Resolution (HD / 4K)
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-400 text-slate-950">
                    1 Credit
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-300">
                  {width} × {height} px
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Full original sensor resolution with crisp edges, perfect for print, e-commerce stores, and billboards.
              </p>

              <button
                onClick={() => triggerDownload(true)}
                disabled={isExporting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow-teal flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>
                  {credits > 0
                    ? `Download 4K HD (Deduct 1 of ${credits} Credits)`
                    : 'Upgrade to Download 4K HD'}
                </span>
              </button>
            </div>

            {/* Preview Option */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Standard Web Preview
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    Free
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {Math.round(width / 2)} × {Math.round(height / 2)} px
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Quick preview resolution for mockups, social posts, and thumbnails.
              </p>

              <button
                onClick={() => triggerDownload(false)}
                disabled={isExporting}
                className="w-full mt-1 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all"
              >
                Download Free Web Preview
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Balance: <strong className="text-white">{credits} credits</strong></span>
          <button
            onClick={() => {
              onClose();
              onOpenUpgradeModal();
            }}
            className="text-teal-400 hover:text-teal-300 font-semibold hover:underline"
          >
            Refill wallet →
          </button>
        </div>
      </div>
    </div>
  );
};
