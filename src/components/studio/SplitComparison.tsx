'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MoveHorizontal, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Square,
  Eye
} from 'lucide-react';
import { 
  CutoutBoundingBox, 
  SmartPaddingOptions, 
  calculateCutoutBoundingBox, 
  calculateSmartPaddingTransform 
} from '@/lib/engine/smartPadding';

export interface SplitComparisonProps {
  originalUrl: string;
  processedUrl: string;
  width?: number;
  height?: number;
  activeBackgroundStyle?: React.CSSProperties;
  activeBackgroundClass?: string;
  shadowStyle?: React.CSSProperties;
  smartPadding?: SmartPaddingOptions;
  badgeLabel?: string;
}

export const SplitComparison: React.FC<SplitComparisonProps> = ({
  originalUrl,
  processedUrl,
  activeBackgroundStyle = {},
  activeBackgroundClass = 'bg-transparency-grid',
  shadowStyle = {},
  smartPadding,
  badgeLabel,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'cutout' | 'original'>('split');
  const [zoom, setZoom] = useState(1);
  const [showGuide, setShowGuide] = useState(true);
  const [bbox, setBbox] = useState<CutoutBoundingBox | null>(null);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (smartPadding?.enabled && processedUrl) {
      calculateCutoutBoundingBox(processedUrl)
        .then(setBbox)
        .catch(err => console.error('Failed to calculate bounding box:', err));
    }
  }, [smartPadding?.enabled, processedUrl]);

  const paddingTransform = (bbox && smartPadding?.enabled)
    ? calculateSmartPaddingTransform(bbox, smartPadding)
    : null;

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setViewportSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const targetAspect = (smartPadding?.enabled && smartPadding.canvasWidth && smartPadding.canvasHeight)
    ? smartPadding.canvasWidth / smartPadding.canvasHeight
    : 1;

  let frameWidth = 0;
  let frameHeight = 0;
  if (viewportSize.width > 0 && viewportSize.height > 0) {
    const availW = Math.max(100, viewportSize.width - 48);
    const availH = Math.max(100, viewportSize.height - 48);
    if (availW / availH > targetAspect) {
      frameHeight = Math.min(availH, 650);
      frameWidth = Math.round(frameHeight * targetAspect);
    } else {
      frameWidth = Math.min(availW, 650);
      frameHeight = Math.round(frameWidth / targetAspect);
    }
  }

  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handlePointerMove(e.clientX);
    }
  }, [isDragging, handlePointerMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handlePointerMove(e.touches[0].clientX);
    }
  }, [isDragging, handlePointerMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos(prev => Math.max(0, prev - 5));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setSliderPos(prev => Math.min(100, prev + 5));
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Sleek Dark Floating Toolbar */}
      <div className="flex items-center justify-between w-full max-w-4xl px-3 py-2 glass-panel rounded-2xl shadow-dark-card text-xs">
        {/* View mode toggle */}
        <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-0.5">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('cutout')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'cutout'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cutout
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'original'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-glow-teal font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Original
          </button>
        </div>

        {/* Marketplace & Safe Zone Controls */}
        {smartPadding?.enabled && (
          <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
            {badgeLabel && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono hidden sm:inline-block">
                {badgeLabel}
              </span>
            )}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1.5 transition-all ${
                showGuide 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal' 
                  : 'text-slate-400 hover:text-white bg-white/5 border border-white/10'
              }`}
              title="Toggle safe zone guide frame"
            >
              <Square className="w-3 h-3" />
              <span>Safe Zone ({smartPadding.fillPercentage}%)</span>
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-bold text-teal-300 px-1 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoom !== 1 && (
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-slate-400 hover:text-teal-300 rounded-lg hover:bg-white/10"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 min-h-[500px] h-[calc(100vh-230px)] rounded-3xl overflow-hidden border border-white/15 shadow-dark-elevated select-none cursor-ew-resize bg-studio-950 flex items-center justify-center p-4"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Layer 1: Cutout with Custom Background & Shadow */}
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden p-4 ${activeBackgroundClass}`}
          style={activeBackgroundStyle}
        >
          {paddingTransform && smartPadding?.enabled && frameWidth > 0 ? (
            <div
              className="relative transition-transform duration-100 ease-out flex items-center justify-center pointer-events-none shadow-2xl border border-white/20 rounded-2xl overflow-hidden bg-white/5"
              style={{
                width: `${frameWidth}px`,
                height: `${frameHeight}px`,
                transform: `scale(${zoom})`,
              }}
            >
              <img
                src={processedUrl}
                alt="Cutout Foreground"
                className="absolute pointer-events-none select-none max-w-none"
                style={{
                  left: `${(paddingTransform.drawX / smartPadding.canvasWidth) * 100}%`,
                  top: `${(paddingTransform.drawY / smartPadding.canvasHeight) * 100}%`,
                  width: `${(paddingTransform.drawWidth / smartPadding.canvasWidth) * 100}%`,
                  height: `${(paddingTransform.drawHeight / smartPadding.canvasHeight) * 100}%`,
                  ...shadowStyle,
                }}
                draggable={false}
              />

              {showGuide && (
                <div
                  className="absolute border-2 border-dashed border-teal-400/50 rounded pointer-events-none flex items-start justify-start p-1.5"
                  style={{
                    width: `${smartPadding.fillPercentage}%`,
                    height: `${smartPadding.fillPercentage}%`,
                  }}
                >
                  <span className="px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-teal-300 border border-teal-500/30">
                    {smartPadding.fillPercentage}% Subject Box
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative transition-transform duration-100 ease-out w-full h-full flex items-center justify-center pointer-events-none"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src={processedUrl}
                alt="Cutout Foreground"
                className="max-h-full max-w-full w-auto h-auto object-contain pointer-events-none select-none"
                style={shadowStyle}
                draggable={false}
              />
            </div>
          )}

          <span className="absolute bottom-3 right-3 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 backdrop-blur-md border border-teal-500/40 pointer-events-none z-10 shadow-glow-teal">
            AI Cutout {smartPadding?.enabled && `• ${smartPadding.fillPercentage}% Compliant`}
          </span>
        </div>

        {/* Layer 2: Original Image (Clipped by slider in split mode) */}
        {viewMode !== 'cutout' && (
          <div
            className="absolute inset-y-0 left-0 h-full overflow-hidden pointer-events-none bg-studio-950"
            style={{
              width: viewMode === 'original' ? '100%' : `${sliderPos}%`,
              transition: isDragging ? 'none' : 'width 100ms ease-out',
            }}
          >
            <div
              className="absolute inset-y-0 left-0 h-full flex items-center justify-center p-4"
              style={{
                width: viewportSize.width ? `${viewportSize.width}px` : '100%',
              }}
            >
              {paddingTransform && smartPadding?.enabled && frameWidth > 0 ? (
                <div
                  className="relative transition-transform duration-100 ease-out flex items-center justify-center pointer-events-none shadow-2xl border border-white/20 rounded-2xl overflow-hidden bg-studio-950"
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    transform: `scale(${zoom})`,
                  }}
                >
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="absolute pointer-events-none select-none max-w-none"
                    style={{
                      left: `${(paddingTransform.drawX / smartPadding.canvasWidth) * 100}%`,
                      top: `${(paddingTransform.drawY / smartPadding.canvasHeight) * 100}%`,
                      width: `${(paddingTransform.drawWidth / smartPadding.canvasWidth) * 100}%`,
                      height: `${(paddingTransform.drawHeight / smartPadding.canvasHeight) * 100}%`,
                    }}
                    draggable={false}
                  />
                </div>
              ) : (
                <div
                  className="relative transition-transform duration-100 ease-out w-full h-full flex items-center justify-center pointer-events-none"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                    draggable={false}
                  />
                </div>
              )}

              <span className="absolute bottom-3 left-3 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 backdrop-blur-md border border-white/10 pointer-events-none z-10">
                Original
              </span>
            </div>
          </div>
        )}

        {/* Draggable Neon Divider Handle */}
        {viewMode === 'split' && (
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{
              left: `${sliderPos}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Glowing Neon Line */}
            <div className="w-[2px] h-full bg-gradient-to-b from-teal-400 via-cyan-300 to-teal-400 shadow-[0_0_12px_#00f5d4] mx-auto" />

            {/* Glowing Circular Handle */}
            <button
              type="button"
              tabIndex={0}
              role="slider"
              aria-valuenow={Math.round(sliderPos)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Drag before/after comparison slider"
              onKeyDown={handleKeyDown}
              className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-studio-950 border-2 border-cyan-400 shadow-glow-cyan flex items-center justify-center text-cyan-300 hover:scale-110 active:scale-95 transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-primary cursor-ew-resize"
            >
              <MoveHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
