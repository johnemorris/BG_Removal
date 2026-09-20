'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  FlipHorizontal, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Image as ImageIcon,
  RotateCcw,
  FolderPlus,
  FolderMinus,
  Layers as LayersIcon
} from 'lucide-react';
import { CollageLayer } from '@/lib/types/collage';
import { BackgroundPreset } from '@/lib/constants/presets';

interface CollageCanvasProps {
  layers: CollageLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CollageLayer>) => void;
  onUpdateMultipleLayers?: (updates: { id: string; updates: Partial<CollageLayer> }[]) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleBgRemoval: (id: string) => void;
  onGroupLayers?: (layerIds: string[]) => void;
  onUngroupLayer?: (layerId: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  background: BackgroundPreset;
  zoom: number;
}

type DragMode = 'move' | 'nw' | 'ne' | 'se' | 'sw';

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onUpdateMultipleLayers,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayer,
  onToggleBgRemoval,
  onGroupLayers,
  onUngroupLayer,
  canvasWidth,
  canvasHeight,
  background,
  zoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Interaction State with Group member tracking
  const [dragState, setDragState] = useState<{
    mode: DragMode;
    startX: number;
    startY: number;
    initialLayerX: number;
    initialLayerY: number;
    initialWidth: number;
    initialHeight: number;
    aspectRatio: number;
    groupMembers?: { id: string; initialX: number; initialY: number; initialW: number; initialH: number }[];
  } | null>(null);

  // Background style computation
  let bgStyle: React.CSSProperties = {};
  let bgClass = '';
  if (background.type === 'color') {
    bgStyle = { backgroundColor: background.value };
  } else if (background.type === 'gradient') {
    bgStyle = { background: background.value };
  } else if (background.type === 'image') {
    bgStyle = {
      backgroundImage: `url(${background.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  } else {
    bgClass = 'bg-transparency-grid';
  }

  // Pointer move handler (Dragging or Resizing)
  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragState || !selectedLayerId) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = (clientX - dragState.startX) / zoom;
      const deltaY = (clientY - dragState.startY) / zoom;

      if (dragState.mode === 'move') {
        if (dragState.groupMembers && dragState.groupMembers.length > 0 && onUpdateMultipleLayers) {
          // Move all members in the group simultaneously
          const updates = dragState.groupMembers.map((m) => ({
            id: m.id,
            updates: {
              x: Math.round(m.initialX + deltaX),
              y: Math.round(m.initialY + deltaY),
            },
          }));
          onUpdateMultipleLayers(updates);
        } else {
          onUpdateLayer(selectedLayerId, {
            x: Math.round(dragState.initialLayerX + deltaX),
            y: Math.round(dragState.initialLayerY + deltaY),
          });
        }
      } else {
        // Resizing
        let newWidth = dragState.initialWidth;
        let newHeight = dragState.initialHeight;
        let newX = dragState.initialLayerX;
        let newY = dragState.initialLayerY;

        if (dragState.mode === 'se') {
          newWidth = Math.max(40, dragState.initialWidth + deltaX);
          newHeight = newWidth / dragState.aspectRatio;
        } else if (dragState.mode === 'sw') {
          newWidth = Math.max(40, dragState.initialWidth - deltaX);
          newHeight = newWidth / dragState.aspectRatio;
          newX = dragState.initialLayerX + (dragState.initialWidth - newWidth);
        } else if (dragState.mode === 'ne') {
          newWidth = Math.max(40, dragState.initialWidth + deltaX);
          newHeight = newWidth / dragState.aspectRatio;
          newY = dragState.initialLayerY + (dragState.initialHeight - newHeight);
        } else if (dragState.mode === 'nw') {
          newWidth = Math.max(40, dragState.initialWidth - deltaX);
          newHeight = newWidth / dragState.aspectRatio;
          newX = dragState.initialLayerX + (dragState.initialWidth - newWidth);
          newY = dragState.initialLayerY + (dragState.initialHeight - newHeight);
        }

        onUpdateLayer(selectedLayerId, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      }
    },
    [dragState, selectedLayerId, onUpdateLayer, onUpdateMultipleLayers, zoom]
  );

  const handlePointerUp = useCallback(() => {
    setDragState(null);
  }, []);

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [dragState, handlePointerMove, handlePointerUp]);

  // Keyboard controls (Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLayerId) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Prevent deleting if user is in an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        onDeleteLayer(selectedLayerId);
      } else if (e.key === 'Escape') {
        onSelectLayer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, onDeleteLayer, onSelectLayer]);

  const startDrag = (
    e: React.MouseEvent | React.TouchEvent,
    mode: DragMode,
    layer: CollageLayer
  ) => {
    e.stopPropagation();
    onSelectLayer(layer.id);

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const groupMembers = layer.groupId
      ? layers
          .filter((l) => l.groupId === layer.groupId)
          .map((l) => ({
            id: l.id,
            initialX: l.x,
            initialY: l.y,
            initialW: l.width,
            initialH: l.height,
          }))
      : undefined;

    setDragState({
      mode,
      startX: clientX,
      startY: clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialWidth: layer.width,
      initialHeight: layer.height,
      aspectRatio: layer.aspectRatio || layer.width / layer.height,
      groupMembers,
    });
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-auto p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectLayer(null);
        }
      }}
    >
      {/* Scaled Canvas Container */}
      <div
        ref={containerRef}
        className={`relative shadow-2xl rounded-2xl overflow-hidden border border-white/15 select-none transition-transform duration-75 ease-out ${bgClass}`}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          ...bgStyle,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectLayer(null);
          }
        }}
      >
        {/* Render Layers */}
        {layers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const displayUrl = layer.useCutout && layer.cutoutUrl ? layer.cutoutUrl : layer.originalUrl;

          return (
            <div
              key={layer.id}
              className={`absolute select-none cursor-move ${
                isSelected ? 'ring-2 ring-cyan-400 shadow-2xl z-30' : 'hover:ring-1 hover:ring-white/40'
              }`}
              style={{
                left: `${layer.x}px`,
                top: `${layer.y}px`,
                width: `${layer.width}px`,
                height: `${layer.height}px`,
                opacity: layer.opacity ?? 1,
                transform: `rotate(${layer.rotation || 0}deg)`,
              }}
              onMouseDown={(e) => startDrag(e, 'move', layer)}
              onTouchStart={(e) => startDrag(e, 'move', layer)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectLayer(layer.id);
              }}
            >
              {/* Image Element */}
              <img
                src={displayUrl}
                alt={layer.name}
                draggable={false}
                className="w-full h-full object-contain pointer-events-none"
                style={{
                  transform: `${layer.flipH ? 'scaleX(-1)' : 'scaleX(1)'} ${
                    layer.flipV ? 'scaleY(-1)' : 'scaleY(1)'
                  }`,
                }}
              />

              {/* Group Indicator Badge */}
              {layer.groupId && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-500/80 backdrop-blur-xs text-slate-950 text-[9px] font-extrabold flex items-center space-x-1 shadow-xs pointer-events-none z-20">
                  <FolderPlus className="w-2.5 h-2.5" />
                  <span>Grouped</span>
                </div>
              )}

              {/* Removing BG Indicator */}
              {layer.isRemovingBg && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-teal-300 space-y-1">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="text-[10px] font-bold">Removing BG...</span>
                </div>
              )}

              {/* 8-Point Bounding Box & Handles when Selected */}
              {isSelected && (
                <>
                  {/* NW Handle */}
                  <div
                    onMouseDown={(e) => startDrag(e, 'nw', layer)}
                    onTouchStart={(e) => startDrag(e, 'nw', layer)}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 border border-slate-950 rounded-full cursor-nwse-resize shadow-glow-cyan z-40"
                  />
                  {/* NE Handle */}
                  <div
                    onMouseDown={(e) => startDrag(e, 'ne', layer)}
                    onTouchStart={(e) => startDrag(e, 'ne', layer)}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border border-slate-950 rounded-full cursor-nesw-resize shadow-glow-cyan z-40"
                  />
                  {/* SE Handle */}
                  <div
                    onMouseDown={(e) => startDrag(e, 'se', layer)}
                    onTouchStart={(e) => startDrag(e, 'se', layer)}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-cyan-400 border border-slate-950 rounded-full cursor-nwse-resize shadow-glow-cyan z-40"
                  />
                  {/* SW Handle */}
                  <div
                    onMouseDown={(e) => startDrag(e, 'sw', layer)}
                    onTouchStart={(e) => startDrag(e, 'sw', layer)}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-cyan-400 border border-slate-950 rounded-full cursor-nesw-resize shadow-glow-cyan z-40"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Palette for Selected Layer */}
      {selectedLayer && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-1.5 glass-panel-glow px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20 text-white animate-in fade-in slide-in-from-bottom-3 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Flip Horizontal */}
          <button
            onClick={() => onUpdateLayer(selectedLayer.id, { flipH: !selectedLayer.flipH })}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLayer.flipH
                ? 'bg-teal-400 text-slate-950 shadow-glow-teal'
                : 'hover:bg-white/10 text-slate-200'
            }`}
            title="Flip Horizontally (Mirror)"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>Flip H</span>
          </button>

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Toggle Background Removal */}
          <button
            onClick={() => onToggleBgRemoval(selectedLayer.id)}
            disabled={selectedLayer.isRemovingBg}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedLayer.useCutout
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-cyan'
                : 'hover:bg-white/10 text-slate-200'
            }`}
            title={selectedLayer.useCutout ? 'Restore Original BG' : 'Remove Background with AI'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedLayer.useCutout ? 'Cutout Active' : 'Remove BG'}</span>
          </button>

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Layer Order: Bring Forward */}
          <button
            onClick={() => onReorderLayer(selectedLayer.id, 'up')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            title="Bring Forward"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Layer Order: Send Backward */}
          <button
            onClick={() => onReorderLayer(selectedLayer.id, 'down')}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            title="Send Backward"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Group / Ungroup Actions */}
          {selectedLayer.groupId ? (
            <button
              onClick={() => onUngroupLayer && onUngroupLayer(selectedLayer.id)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all border border-amber-500/30"
              title="Ungroup this layer from linked layers"
            >
              <FolderMinus className="w-3.5 h-3.5" />
              <span>Ungroup</span>
            </button>
          ) : (
            // Check if there are overlapping or candidate layers to group with
            layers.length > 1 && onGroupLayers && (
              <button
                onClick={() => {
                  // Find any overlapping layer, or just the next layer in stack
                  const otherLayer = layers.find((l) => l.id !== selectedLayer.id);
                  if (otherLayer) {
                    onGroupLayers([selectedLayer.id, otherLayer.id]);
                  }
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-teal-300 hover:bg-white/10 transition-all"
                title="Group overlaid layers so they move together"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Group</span>
              </button>
            )
          )}

          <div className="w-[1px] h-5 bg-white/15 mx-1" />

          {/* Duplicate Layer */}
          <button
            onClick={() => onDuplicateLayer(selectedLayer.id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            title="Duplicate Layer"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete Layer */}
          <button
            onClick={() => onDeleteLayer(selectedLayer.id)}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20"
            title="Delete Layer (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
