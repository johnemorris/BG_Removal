'use client';

import React from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Maximize2, 
  Sliders, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  MarketplacePreset, 
  MARKETPLACE_PRESETS, 
  FILL_PRESET_OPTIONS 
} from '@/lib/constants/marketplaces';
import { BackgroundPreset } from '@/lib/constants/presets';
import { ShadowSettings } from '@/lib/engine/shadowRenderer';
import { SmartPaddingOptions } from '@/lib/engine/smartPadding';

export interface StudioMarketplaceState extends SmartPaddingOptions {
  activePresetId: string | null;
  aspectRatio: string;
}

interface MarketplaceControlsProps {
  marketplaceState: StudioMarketplaceState;
  onChangeMarketplaceState: (state: StudioMarketplaceState) => void;
  onApplyPreset: (preset: MarketplacePreset) => void;
  currentBg: BackgroundPreset;
  currentShadow: ShadowSettings;
}

export const MarketplaceControls: React.FC<MarketplaceControlsProps> = ({
  marketplaceState,
  onChangeMarketplaceState,
  onApplyPreset,
  currentBg,
  currentShadow,
}) => {
  const activePreset = MARKETPLACE_PRESETS.find(p => p.id === marketplaceState.activePresetId);

  // Compliance checks
  const isPureWhiteBg = currentBg.type === 'color' && currentBg.value.toLowerCase() === '#ffffff';
  const isAmazonStandardFill = marketplaceState.fillPercentage === 85;
  const isSquareAspect = marketplaceState.aspectRatio === '1:1';
  const isAutoCentered = marketplaceState.autoCenter;
  const isAmazonCompliant = isPureWhiteBg && isAmazonStandardFill && isSquareAspect && isAutoCentered && !currentShadow.enabled;

  const handleSelectPreset = (preset: MarketplacePreset) => {
    onApplyPreset(preset);
    onChangeMarketplaceState({
      enabled: true,
      activePresetId: preset.id,
      fillPercentage: preset.fillPercentage,
      autoCenter: true,
      canvasWidth: preset.width,
      canvasHeight: preset.height,
      aspectRatio: preset.aspectRatio,
    });
  };

  const handleFillChange = (newVal: number) => {
    onChangeMarketplaceState({
      ...marketplaceState,
      fillPercentage: newVal,
    });
  };

  const handleAutoCenterToggle = () => {
    onChangeMarketplaceState({
      ...marketplaceState,
      autoCenter: !marketplaceState.autoCenter,
    });
  };

  const handleEnabledToggle = () => {
    onChangeMarketplaceState({
      ...marketplaceState,
      enabled: !marketplaceState.enabled,
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-dark-card space-y-5 text-white">
      {/* Master Enable Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">
              Marketplace Auto-Framing
            </span>
            <span className="text-[11px] text-slate-400">
              Auto-center & smart margin padding
            </span>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={marketplaceState.enabled}
          onClick={handleEnabledToggle}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
            marketplaceState.enabled ? 'bg-teal-500 shadow-glow-teal' : 'bg-slate-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              marketplaceState.enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Preset Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">E-Commerce Standards</span>
          <span className="text-[10px] font-mono text-teal-400">1-Click Standards</span>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
          {MARKETPLACE_PRESETS.map((preset) => {
            const isSelected = marketplaceState.activePresetId === preset.id && marketplaceState.enabled;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col space-y-1.5 ${
                  isSelected
                    ? 'border-teal-400 bg-teal-500/15 shadow-glow-teal'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-white">
                      {preset.name}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-teal-300 font-mono">
                      {preset.aspectRatio}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">
                  {preset.description}
                </p>

                <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400 font-mono">
                  <span>{preset.width}×{preset.height}px</span>
                  <span>•</span>
                  <span>{preset.fillPercentage}% Subject Fill</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Fill / Subject Margin Slider */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200">
            Subject Frame Fill (Margin)
          </span>
          <span className="text-teal-400 font-bold font-mono text-sm">
            {marketplaceState.fillPercentage}%
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="100"
          step="1"
          value={marketplaceState.fillPercentage}
          disabled={!marketplaceState.enabled}
          onChange={(e) => handleFillChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400 disabled:opacity-40"
        />

        {/* Quick Fill Pills */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {FILL_PRESET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled={!marketplaceState.enabled}
              onClick={() => handleFillChange(opt.value)}
              className={`py-1.5 px-1 rounded-xl text-[10px] font-bold text-center transition-all disabled:opacity-30 ${
                marketplaceState.fillPercentage === opt.value
                  ? 'bg-teal-500/30 text-teal-200 border border-teal-400 shadow-glow-teal'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {opt.value}%
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Centering Toggle */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-white block">
            Auto-Center Subject
          </span>
          <span className="text-[11px] text-slate-400 block">
            Aligns cutout bounding box to optical canvas center
          </span>
        </div>
        <button
          type="button"
          role="switch"
          disabled={!marketplaceState.enabled}
          aria-checked={marketplaceState.autoCenter}
          onClick={handleAutoCenterToggle}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 disabled:opacity-30 ${
            marketplaceState.autoCenter && marketplaceState.enabled
              ? 'bg-teal-500 shadow-glow-teal'
              : 'bg-slate-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              marketplaceState.autoCenter && marketplaceState.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Amazon Compliance Status Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b1329] border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className={`w-4 h-4 ${isAmazonCompliant ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-xs font-extrabold text-white">
              Amazon Compliance Monitor
            </span>
          </div>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            isAmazonCompliant
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {isAmazonCompliant ? '100% Compliant' : 'Non-Compliant'}
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span>Pure White (#FFFFFF)</span>
            {isPureWhiteBg ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Pass
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> #{currentBg.value}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Subject Fill &gt;= 85%</span>
            {isAmazonStandardFill ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> 85% Standard
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> {marketplaceState.fillPercentage}%
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Subject Auto-Centered</span>
            {isAutoCentered && marketplaceState.enabled ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Centered
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> Off
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>1:1 Square Frame</span>
            {isSquareAspect ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> 1:1 Square
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> {marketplaceState.aspectRatio}
              </span>
            )}
          </div>
        </div>

        {!isAmazonCompliant && (
          <button
            onClick={() => {
              const amazonPreset = MARKETPLACE_PRESETS.find(p => p.id === 'amazon-compliance');
              if (amazonPreset) handleSelectPreset(amazonPreset);
            }}
            className="w-full mt-1 py-2 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-glow-teal"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fix All to Amazon Compliance</span>
          </button>
        )}
      </div>
    </div>
  );
};
