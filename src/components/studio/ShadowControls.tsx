'use client';

import React from 'react';
import { Sun, Sparkles } from 'lucide-react';
import { ShadowSettings } from '@/lib/engine/shadowRenderer';

interface ShadowControlsProps {
  shadow: ShadowSettings;
  onChangeShadow: (settings: ShadowSettings) => void;
}

export const ShadowControls: React.FC<ShadowControlsProps> = ({
  shadow,
  onChangeShadow,
}) => {
  const handleToggle = () => {
    onChangeShadow({ ...shadow, enabled: !shadow.enabled });
  };

  const handleChange = (key: keyof ShadowSettings, value: any) => {
    onChangeShadow({ ...shadow, [key]: value });
  };

  const applyPreset = (type: 'contact' | 'floating' | 'studio') => {
    if (type === 'contact') {
      onChangeShadow({
        enabled: true,
        opacity: 0.45,
        blur: 14,
        angle: 90,
        distance: 14,
        color: '#000000',
      });
    } else if (type === 'floating') {
      onChangeShadow({
        enabled: true,
        opacity: 0.35,
        blur: 32,
        angle: 90,
        distance: 30,
        color: '#000000',
      });
    } else if (type === 'studio') {
      onChangeShadow({
        enabled: true,
        opacity: 0.4,
        blur: 18,
        angle: 45,
        distance: 20,
        color: '#000000',
      });
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-dark-card space-y-4">
      {/* Header with Enable Switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">
              E-Commerce Drop Shadow
            </h4>
            <span className="text-[11px] text-slate-400">
              Realistic contact & cast shadow depth
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={shadow.enabled}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500 shadow-inner"></div>
        </label>
      </div>

      {shadow.enabled && (
        <div className="pt-3 border-t border-white/10 space-y-4">
          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('contact')}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-teal-500/20 hover:text-teal-300 border border-white/10 text-slate-300 transition-colors"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => applyPreset('floating')}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-teal-500/20 hover:text-teal-300 border border-white/10 text-slate-300 transition-colors"
            >
              Floating 3D
            </button>
            <button
              type="button"
              onClick={() => applyPreset('studio')}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-teal-500/20 hover:text-teal-300 border border-white/10 text-slate-300 transition-colors"
            >
              45° Studio
            </button>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Blur */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Blur Radius</span>
                <span className="font-mono text-teal-300">{shadow.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={shadow.blur}
                onChange={(e) => handleChange('blur', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Opacity</span>
                <span className="font-mono text-teal-300">
                  {Math.round(shadow.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={shadow.opacity}
                onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Distance</span>
                <span className="font-mono text-teal-300">{shadow.distance}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={shadow.distance}
                onChange={(e) => handleChange('distance', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Light Angle */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Light Angle</span>
                <span className="font-mono text-teal-300">{shadow.angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={shadow.angle}
                onChange={(e) => handleChange('angle', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
