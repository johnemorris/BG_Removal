'use client';

import React, { useRef } from 'react';
import { 
  Plus, 
  Layers, 
  Palette, 
  Trash2, 
  Sparkles, 
  FlipHorizontal, 
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  FolderPlus,
  FolderMinus
} from 'lucide-react';
import { CollageLayer } from '@/lib/types/collage';
import { BackgroundPreset, COLOR_PRESETS, GRADIENT_PRESETS, BACKDROP_SCENES } from '@/lib/constants/presets';

interface CollageSidebarProps {
  layers: CollageLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onAddImages: (files: FileList | File[]) => void;
  onUpdateLayer: (id: string, updates: Partial<CollageLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleBgRemoval: (id: string) => void;
  onGroupLayers?: (layerIds: string[]) => void;
  onUngroupLayer?: (layerId: string) => void;
  selectedBackground: BackgroundPreset;
  onSelectBackground: (bg: BackgroundPreset) => void;
}

export const CollageSidebar: React.FC<CollageSidebarProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddImages,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayer,
  onToggleBgRemoval,
  onGroupLayers,
  onUngroupLayer,
  selectedBackground,
  onSelectBackground,
}) => {
  const [activeTab, setActiveTab] = React.useState<'layers' | 'backdrop'>('layers');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <aside className="w-80 shrink-0 flex flex-col bg-[#0b0f19]/95 backdrop-blur-2xl border-r border-white/10 h-full overflow-hidden select-none">
      {/* Tab Switcher */}
      <div className="flex items-center p-3 border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'layers'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Layers ({layers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backdrop')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'backdrop'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Backdrop</span>
        </button>
      </div>

      {/* Tab 1: Layers Content */}
      {activeTab === 'layers' && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
          {/* Add Image Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl border-2 border-dashed border-white/20 hover:border-teal-400 hover:bg-white/5 text-slate-200 text-xs font-bold transition-all group"
          >
            <Plus className="w-4 h-4 text-teal-400 group-hover:scale-125 transition-transform" />
            <span>Add Photos to Collage</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Layer Items List (reversed so top of stack is on top visually) */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {layers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center p-4 text-slate-400 space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                <p className="text-xs">No images added yet.</p>
                <p className="text-[11px] text-slate-500">
                  Click above to upload images with or without background removal.
                </p>
              </div>
            ) : (
              [...layers].reverse().map((layer, reverseIndex) => {
                const isSelected = layer.id === selectedLayerId;
                const displayThumb = layer.useCutout && layer.cutoutUrl ? layer.cutoutUrl : layer.originalUrl;

                return (
                  <div
                    key={layer.id}
                    onClick={() => onSelectLayer(layer.id)}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400/50 shadow-glow-teal/20 text-white'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-11 h-11 rounded-xl bg-studio-950 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-transparency-grid">
                      <img
                        src={displayThumb}
                        alt={layer.name}
                        className={`w-full h-full object-contain ${layer.flipH ? '-scale-x-100' : ''}`}
                      />
                    </div>

                    {/* Layer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{layer.name}</div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBgRemoval(layer.id);
                          }}
                          disabled={layer.isRemovingBg}
                          className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            layer.useCutout
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'bg-white/10 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{layer.isRemovingBg ? 'Working...' : layer.useCutout ? 'Cutout' : 'Original BG'}</span>
                        </button>
                        {layer.groupId && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Grouped
                          </span>
                        )}
                        {layer.flipH && (
                          <span className="text-[9px] px-1 rounded bg-white/10 text-slate-400">
                            Flipped
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Layer Actions */}
                    <div className="flex items-center space-x-0.5">
                      {/* Group / Ungroup Button */}
                      {layer.groupId ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUngroupLayer && onUngroupLayer(layer.id);
                          }}
                          className="p-1 rounded text-amber-400 hover:bg-amber-500/20"
                          title="Ungroup this layer"
                        >
                          <FolderMinus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        layers.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const other = layers.find((l) => l.id !== layer.id);
                              if (other && onGroupLayers) {
                                onGroupLayers([layer.id, other.id]);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-teal-300 hover:bg-white/10"
                            title="Group with other image"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderLayer(layer.id, 'up');
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Bring Forward"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderLayer(layer.id, 'down');
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Send Backward"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-400"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Backdrop Presets */}
      {activeTab === 'backdrop' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Transparency Option */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Transparency
            </span>
            <button
              onClick={() => onSelectBackground(COLOR_PRESETS[0])}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-2xl border transition-all ${
                selectedBackground.type === 'transparent'
                  ? 'border-teal-400 bg-teal-500/10 shadow-glow-teal text-white'
                  : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl border border-white/20 bg-transparency-grid shrink-0" />
              <div className="text-left text-xs font-bold">
                Transparent PNG
                <span className="block text-[10px] text-slate-400 font-normal">
                  Ideal for eCommerce & graphics
                </span>
              </div>
            </button>
          </div>

          {/* Solid Colors */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Solid Colors
            </span>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onSelectBackground(color)}
                  className={`relative w-full aspect-square rounded-xl border transition-transform hover:scale-105 ${
                    selectedBackground.id === color.id
                      ? 'border-teal-400 ring-2 ring-teal-400/40'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Gradients */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Studio Gradients
            </span>
            <div className="grid grid-cols-2 gap-2">
              {GRADIENT_PRESETS.map((grad) => (
                <button
                  key={grad.id}
                  onClick={() => onSelectBackground(grad)}
                  className={`w-full h-12 rounded-xl border overflow-hidden transition-all text-[11px] font-bold text-white flex items-center justify-center p-2 shadow-xs hover:scale-102 ${
                    selectedBackground.id === grad.id
                      ? 'border-teal-400 ring-2 ring-teal-400/40'
                      : 'border-white/15'
                  }`}
                  style={{ background: grad.value }}
                >
                  <span className="truncate drop-shadow-md">{grad.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Scenes */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Realistic Scenes
            </span>
            <div className="grid grid-cols-2 gap-2">
              {BACKDROP_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => onSelectBackground(scene)}
                  className={`relative w-full h-16 rounded-xl border overflow-hidden group hover:scale-102 transition-transform ${
                    selectedBackground.id === scene.id
                      ? 'border-teal-400 ring-2 ring-teal-400/40'
                      : 'border-white/15'
                  }`}
                >
                  <img
                    src={scene.value}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 py-0.5 px-1.5 bg-black/70 text-[9px] font-bold text-slate-200 truncate">
                    {scene.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
