'use client';

import React from 'react';
import { 
  Scissors, 
  Sparkles, 
  RefreshCw, 
  SlidersHorizontal, 
  Check 
} from 'lucide-react';

export interface HairRefineSettings {
  defringe: number;    // 0 to 5 (color decontamination radius)
  shift: number;       // -5 to 5 (edge choke/contract)
  feather: number;     // 0 to 5 (edge softness)
  alphaMatting: boolean;
}

interface HairRefineControlsProps {
  settings: HairRefineSettings;
  onChangeSettings: (settings: HairRefineSettings) => void;
  onApplyRefinements: () => void;
  isReprocessing: boolean;
}

export const HairRefineControls: React.FC<HairRefineControlsProps> = ({
  settings,
  onChangeSettings,
  onApplyRefinements,
  isReprocessing,
}) => {
  const handleChange = (key: keyof HairRefineSettings, val: any) => {
    onChangeSettings({ ...settings, [key]: val });
  };

  const applyPreset = (type: 'curly' | 'clean' | 'max-choke') => {
    if (type === 'curly') {
      onChangeSettings({
        defringe: 3,
        shift: -2,
        feather: 0.5,
        alphaMatting: true,
      });
    } else if (type === 'clean') {
      onChangeSettings({
        defringe: 2,
        shift: -1,
        feather: 0.2,
        alphaMatting: false,
      });
    } else if (type === 'max-choke') {
      onChangeSettings({
        defringe: 4,
        shift: -3,
        feather: 0.4,
        alphaMatting: false,
      });
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-dark-card space-y-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-teal-500/10 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shadow-glow-cyan">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white tracking-tight flex items-center gap-1.5">
              Hair & Fringe Defringing
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 uppercase">
                Pro
              </span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Eliminate grey/white halos and background bleed around hair
            </span>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Presets */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-400">Hair Presets:</span>
        <button
          type="button"
          onClick={() => applyPreset('curly')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 text-slate-300 transition-colors"
        >
          Curly / Fine Hair
        </button>
        <button
          type="button"
          onClick={() => applyPreset('clean')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 text-slate-300 transition-colors"
        >
          Clean Profile
        </button>
        <button
          type="button"
          onClick={() => applyPreset('max-choke')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 text-slate-300 transition-colors"
        >
          Deep Halo Removal
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-3.5 pt-2 border-t border-white/10 text-xs">
        {/* Defringe Halo Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <span>Color Defringe (Decontamination)</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold">{settings.defringe}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={settings.defringe}
            onChange={(e) => handleChange('defringe', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[10px] text-slate-400">
            Paints natural hair tone into semi-transparent border pixels to wipe out background bleed.
          </p>
        </div>

        {/* Edge Shift / Choke Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-300 font-medium">
            <span>Shift Edge (Choke Halo)</span>
            <span className="font-mono text-cyan-300 font-bold">{settings.shift}px</span>
          </div>
          <input
            type="range"
            min="-4"
            max="2"
            step="1"
            value={settings.shift}
            onChange={(e) => handleChange('shift', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[10px] text-slate-400">
            Negative values shave off the 1–2px halo outline along the subject perimeter.
          </p>
        </div>

        {/* Edge Feather */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-300 font-medium">
            <span>Edge Feathering</span>
            <span className="font-mono text-cyan-300 font-bold">{settings.feather}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={settings.feather}
            onChange={(e) => handleChange('feather', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Multi-scale Alpha Matting Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200 block">
              Multi-Scale Strand Matting
            </span>
            <span className="text-[10px] text-slate-400 block">
              Uses high-precision spectral alpha solving for intricate flyaway hairs
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.alphaMatting}
              onChange={(e) => handleChange('alphaMatting', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500 shadow-inner"></div>
          </label>
        </div>

        {/* Re-Process Button */}
        <button
          type="button"
          onClick={onApplyRefinements}
          disabled={isReprocessing}
          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-glow-cyan flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isReprocessing ? 'animate-spin' : ''}`} />
          <span>{isReprocessing ? 'Refining Hair & Edges...' : 'Apply Hair & Edge Refinements'}</span>
        </button>
      </div>
    </div>
  );
};
