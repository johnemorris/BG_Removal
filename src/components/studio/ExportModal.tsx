'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Sparkles, 
  X, 
  Layers,
  ShoppingBag,
  Check,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { deductCredit, getStoredUserState } from '@/lib/store/userStore';
import { BackgroundPreset } from '@/lib/constants/presets';
import { ShadowSettings, renderCompositedCanvas } from '@/lib/engine/shadowRenderer';
import { 
  MarketplacePreset, 
  MARKETPLACE_PRESETS 
} from '@/lib/constants/marketplaces';
import { SmartPaddingOptions } from '@/lib/engine/smartPadding';
import { StudioMarketplaceState } from './MarketplaceControls';

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
  marketplaceState?: StudioMarketplaceState;
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
  marketplaceState,
}) => {
  const [exportTab, setExportTab] = useState<'studio' | 'marketplace'>(
    marketplaceState?.enabled ? 'marketplace' : 'studio'
  );
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMarketplacePreset, setSelectedMarketplacePreset] = useState<MarketplacePreset>(
    MARKETPLACE_PRESETS.find(p => p.id === marketplaceState?.activePresetId) || MARKETPLACE_PRESETS[0]
  );

  const userState = getStoredUserState();
  const credits = userState.credits;

  if (!isOpen) return null;

  const triggerDownload = async (isHighRes: boolean, customPreset?: MarketplacePreset) => {
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
      const presetToUse = customPreset || (exportTab === 'marketplace' ? selectedMarketplacePreset : null);

      let targetW = Math.round(width * scale);
      let targetH = Math.round(height * scale);
      let activeBg = background;
      let activeShadow = shadow;
      let smartPaddingOptions: SmartPaddingOptions | undefined = marketplaceState?.enabled ? { ...marketplaceState } : undefined;

      if (presetToUse) {
        targetW = Math.round(presetToUse.width * scale);
        targetH = Math.round(presetToUse.height * scale);
        activeBg = {
          id: `export-${presetToUse.id}`,
          name: presetToUse.name,
          type: 'color',
          value: presetToUse.backgroundColor,
          previewBg: presetToUse.backgroundColor,
        };
        activeShadow = presetToUse.shadow;
        smartPaddingOptions = {
          enabled: true,
          fillPercentage: presetToUse.fillPercentage,
          autoCenter: true,
          canvasWidth: targetW,
          canvasHeight: targetH,
        };
      } else if (smartPaddingOptions) {
        targetW = Math.round((marketplaceState?.canvasWidth || width) * scale);
        targetH = Math.round((marketplaceState?.canvasHeight || height) * scale);
        smartPaddingOptions = {
          ...smartPaddingOptions,
          canvasWidth: targetW,
          canvasHeight: targetH,
        };
      }

      const canvas = await renderCompositedCanvas({
        cutoutUrl,
        originalUrl,
        background: format === 'jpg' && activeBg.type === 'transparent'
          ? { id: 'white', name: 'White', type: 'color', value: '#ffffff', previewBg: '#ffffff' }
          : activeBg,
        shadow: activeShadow,
        blurOriginalBg: presetToUse ? 0 : blurOriginalBg,
        width: targetW,
        height: targetH,
        smartPadding: smartPaddingOptions,
      });

      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const ext = format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const a = document.createElement('a');
      a.href = dataUrl;
      const tag = presetToUse 
        ? `-${presetToUse.platform}-compliant` 
        : (marketplaceState?.enabled ? '-smart-padded' : '');
      a.download = `${filename.replace(/\.[^/.]+$/, '')}${tag}-${isHighRes ? 'hd' : 'preview'}.${ext}`;
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

  const currentExportW = exportTab === 'marketplace'
    ? selectedMarketplacePreset.width
    : (marketplaceState?.enabled ? marketplaceState.canvasWidth : width);
  const currentExportH = exportTab === 'marketplace'
    ? selectedMarketplacePreset.height
    : (marketplaceState?.enabled ? marketplaceState.canvasHeight : height);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-studio-950 text-white rounded-3xl shadow-dark-elevated border border-white/15 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-glow-teal">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight">
                Export Photo Studio Asset
              </h3>
              <p className="text-xs text-slate-400">
                Marketplace auto-compliance or custom high-res export
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

        {/* Export Mode Tabs */}
        <div className="px-6 pt-4 pb-1">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setExportTab('marketplace')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                exportTab === 'marketplace'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-glow-teal'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>1-Click Marketplace</span>
            </button>
            <button
              onClick={() => setExportTab('studio')}
              className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                exportTab === 'studio'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-glow-teal'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Current Studio Shot</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Marketplace Presets Selector */}
          {exportTab === 'marketplace' && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Marketplace Preset Standards
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MARKETPLACE_PRESETS.map((preset) => {
                  const isSelected = selectedMarketplacePreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedMarketplacePreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col space-y-1 ${
                        isSelected
                          ? 'border-teal-400 bg-teal-500/15 shadow-glow-teal'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-white truncate">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {preset.width}×{preset.height} px • {preset.fillPercentage}% Fill
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Compliance Notes Banner */}
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center space-x-1.5 text-teal-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{selectedMarketplacePreset.badge}</span>
                </div>
                <p className="text-slate-300">
                  {selectedMarketplacePreset.description}
                </p>
              </div>
            </div>
          )}

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
                JPG (Pure White)
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
                    Full High-Resolution ({exportTab === 'marketplace' ? selectedMarketplacePreset.name : 'HD / 4K'})
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-400 text-slate-950">
                    1 Credit
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-teal-300">
                  {currentExportW} × {currentExportH} px
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {exportTab === 'marketplace' 
                  ? `Pre-calibrated to ${selectedMarketplacePreset.width}×${selectedMarketplacePreset.height}px with ${selectedMarketplacePreset.fillPercentage}% frame fill & auto-centering.`
                  : 'Full original sensor resolution with crisp edges, perfect for print, e-commerce stores, and billboards.'}
              </p>

              <button
                onClick={() => triggerDownload(true)}
                disabled={isExporting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow-teal flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>
                  {isExporting 
                    ? 'Exporting Canvas...' 
                    : credits > 0
                      ? `Download 1-Click High-Res (Deduct 1 of ${credits} Credits)`
                      : 'Upgrade to Download Full HD'}
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
                  {Math.round(currentExportW / 2)} × {Math.round(currentExportH / 2)} px
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Quick preview resolution with identical smart padding and compliance framing.
              </p>

              <button
                onClick={() => triggerDownload(false)}
                disabled={isExporting}
                className="w-full mt-1 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
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
