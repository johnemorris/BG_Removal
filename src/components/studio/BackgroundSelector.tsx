'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Upload, 
  Check 
} from 'lucide-react';
import { 
  BackgroundPreset, 
  COLOR_PRESETS, 
  GRADIENT_PRESETS, 
  BACKDROP_SCENES 
} from '@/lib/constants/presets';

interface BackgroundSelectorProps {
  selectedBackground: BackgroundPreset;
  onSelectBackground: (bg: BackgroundPreset) => void;
  blurOriginalBg: number;
  onChangeBlurBg: (val: number) => void;
  hasOriginalImage: boolean;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  selectedBackground,
  onSelectBackground,
  blurOriginalBg,
  onChangeBlurBg,
  hasOriginalImage,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'gradients' | 'scenes' | 'blur'>('presets');
  const [customColor, setCustomColor] = useState('#3b82f6');

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomColor(val);
    onSelectBackground({
      id: 'custom-color',
      name: 'Custom Color',
      type: 'color',
      value: val,
      previewBg: val,
    });
  };

  const handleCustomBackdropUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onSelectBackground({
        id: 'custom-uploaded-bg',
        name: file.name,
        type: 'image',
        value: url,
        previewBg: url,
      });
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-dark-card space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center space-x-1 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'presets'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'colors'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('gradients')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'gradients'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Gradients
        </button>
        <button
          onClick={() => setActiveTab('scenes')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'scenes'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Scenes
        </button>
        {hasOriginalImage && (
          <button
            onClick={() => setActiveTab('blur')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'blur'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Bokeh Blur
          </button>
        )}
      </div>

      {/* Tab: Presets / Colors */}
      {(activeTab === 'presets' || activeTab === 'colors') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Color Palette</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-teal-400 hover:text-teal-300 font-semibold">
              <Palette className="w-3.5 h-3.5" />
              <span>Custom Hex</span>
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-5 h-5 opacity-0 absolute pointer-events-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = selectedBackground.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onChangeBlurBg(0);
                    onSelectBackground(preset);
                  }}
                  title={preset.name}
                  className={`relative w-11 h-11 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? 'border-teal-400 scale-105 shadow-glow-teal'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                  style={{
                    backgroundColor: preset.type === 'color' ? preset.value : undefined,
                  }}
                >
                  {preset.type === 'transparent' && (
                    <div className="w-full h-full bg-transparency-grid" />
                  )}

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedBackground.eCommerceBadge && (
            <div className="text-[11px] text-teal-300 bg-teal-500/10 px-3 py-2 rounded-xl border border-teal-500/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Amazon Pure White:</strong> 100% compliant RGB (255,255,255) standard.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab: Gradients */}
      {(activeTab === 'presets' || activeTab === 'gradients') && (
        <div className="space-y-3 pt-1">
          <span className="text-xs text-slate-400 font-semibold block">
            Studio Gradients
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {GRADIENT_PRESETS.map((preset) => {
              const isSelected = selectedBackground.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onChangeBlurBg(0);
                    onSelectBackground(preset);
                  }}
                  className={`relative h-12 rounded-xl border-2 transition-all overflow-hidden flex items-center justify-center p-1 focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? 'border-teal-400 scale-105 shadow-glow-teal'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                  style={{ background: preset.value }}
                  title={preset.name}
                >
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Studio Scenes */}
      {(activeTab === 'presets' || activeTab === 'scenes') && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Realistic Backdrops</span>
            <label className="flex items-center gap-1 cursor-pointer text-teal-400 hover:text-teal-300 font-semibold">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomBackdropUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {BACKDROP_SCENES.map((scene) => {
              const isSelected = selectedBackground.id === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => {
                    onChangeBlurBg(0);
                    onSelectBackground(scene);
                  }}
                  className={`group relative h-16 rounded-xl border-2 overflow-hidden transition-all text-left focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? 'border-teal-400 shadow-glow-teal'
                      : 'border-white/15 hover:border-teal-400/50'
                  }`}
                >
                  <img
                    src={scene.previewBg}
                    alt={scene.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-semibold text-white truncate w-full">
                      {scene.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Bokeh / Blur Mode */}
      {activeTab === 'blur' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">
              DSLR Bokeh Blur Intensity
            </span>
            <span className="text-teal-400 font-bold font-mono">{blurOriginalBg}px</span>
          </div>

          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={blurOriginalBg}
            onChange={(e) => onChangeBlurBg(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Keeps your subject pin-sharp while applying natural optical lens blur to the background scene.
          </p>
        </div>
      )}
    </div>
  );
};
