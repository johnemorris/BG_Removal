'use client';

import React from 'react';
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { CANVAS_PRESETS } from '@/lib/types/collage';

interface CollageToolbarProps {
  canvasPreset: string;
  onChangeCanvasPreset: (presetId: string) => void;
  zoom: number;
  onChangeZoom: (z: number) => void;
  onExport: () => void;
  isExporting: boolean;
  layersCount: number;
}

export const CollageToolbar: React.FC<CollageToolbarProps> = ({
  canvasPreset,
  onChangeCanvasPreset,
  zoom,
  onChangeZoom,
  onExport,
  isExporting,
  layersCount,
}) => {
  return (
    <header className="h-14 border-b border-white/10 bg-[#080c14]/90 backdrop-blur-xl px-4 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Canvas Dimensions & Aspect Ratio Dropdown */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          Canvas:
        </span>
        <div className="flex items-center space-x-1 bg-white/5 border border-white/10 p-1 rounded-xl">
          {CANVAS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onChangeCanvasPreset(preset.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                canvasPreset === preset.id
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={`${preset.name} (${preset.width}x${preset.height})`}
            >
              <span>{preset.iconText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center Zoom Controls */}
      <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl p-1">
        <button
          onClick={() => onChangeZoom(Math.max(0.25, zoom - 0.1))}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono font-bold text-teal-300 px-1 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onChangeZoom(Math.min(2, zoom + 0.1))}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        {zoom !== 0.5 && (
          <button
            onClick={() => onChangeZoom(0.5)}
            className="p-1 text-slate-400 hover:text-teal-300 rounded-lg hover:bg-white/10"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Right Export Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onExport}
          disabled={layersCount === 0 || isExporting}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            layersCount > 0
              ? 'bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal hover:brightness-110 active:scale-95 cursor-pointer'
              : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
          }`}
        >
          {isExporting ? (
            <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Download className="w-4 h-4 text-slate-950" />
          )}
          <span>{isExporting ? 'Compositing...' : 'Export Collage'}</span>
        </button>
      </div>
    </header>
  );
};
