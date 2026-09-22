'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Eraser, 
  Paintbrush, 
  Undo, 
  RotateCcw, 
  Check, 
  X,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface BrushEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string;
  cutoutUrl: string;
  onApplyChanges: (newCutoutUrl: string) => void;
}

export const BrushEditorModal: React.FC<BrushEditorModalProps> = ({
  isOpen,
  onClose,
  originalUrl,
  cutoutUrl,
  onApplyChanges,
}) => {
  const [tool, setTool] = useState<'erase' | 'restore'>('restore');
  const [brushSize, setBrushSize] = useState(25);
  const [showGhost, setShowGhost] = useState(true);
  const [ghostOpacity, setGhostOpacity] = useState(0.4);
  const [zoom, setZoom] = useState(1);
  const [isPeekingOriginal, setIsPeekingOriginal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const cutoutImgRef = useRef<HTMLImageElement | null>(null);
  const [historyStack, setHistoryStack] = useState<ImageData[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const orig = new Image();
    orig.crossOrigin = 'anonymous';
    orig.src = originalUrl;
    originalImgRef.current = orig;

    const cut = new Image();
    cut.crossOrigin = 'anonymous';
    cut.src = cutoutUrl;
    cutoutImgRef.current = cut;

    cut.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = cut.naturalWidth || cut.width || 800;
      canvas.height = cut.naturalHeight || cut.height || 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(cut, 0, 0);

      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistoryStack([initialData]);
    };
  }, [isOpen, originalUrl, cutoutUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      // Hold Spacebar to temporarily peek at original photo
      if (e.code === 'Space' && isOpen && !e.repeat) {
        setIsPeekingOriginal(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPeekingOriginal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, onClose]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoryStack((prev) => [...prev.slice(-10), state]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.save();
    if (tool === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const orig = originalImgRef.current;
      if (orig && orig.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(orig, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    }
    ctx.restore();
  };

  const handleUndo = () => {
    if (historyStack.length <= 1) return;
    const newStack = [...historyStack];
    newStack.pop();
    const prevState = newStack[newStack.length - 1];
    setHistoryStack(newStack);

    const canvas = canvasRef.current;
    if (!canvas || !prevState) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(prevState, 0, 0);
    }
  };

  const handleReset = () => {
    if (!cutoutImgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cutoutImgRef.current, 0, 0);
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistoryStack([initialData]);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updatedDataUrl = canvas.toDataURL('image/png');
    onApplyChanges(updatedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-studio-950 rounded-3xl shadow-dark-elevated border border-white/15 overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shadow-glow-teal">
              <Paintbrush className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                Pixlr Precision Touch-Up Brush
              </h3>
              <p className="text-xs text-slate-400">
                Erase background artifacts or restore foreground details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-white/10 bg-studio-900 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Tool selector */}
          <div className="inline-flex rounded-xl border border-white/10 p-1 bg-white/5">
            <button
              onClick={() => setTool('erase')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                tool === 'erase'
                  ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Erase Mode</span>
            </button>

            <button
              onClick={() => setTool('restore')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                tool === 'restore'
                  ? 'bg-teal-500 text-slate-950 shadow-glow-teal'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Restore Mode</span>
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Size:</span>
            <input
              type="range"
              min="5"
              max="80"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="w-8 font-mono text-teal-300 font-bold">{brushSize}px</span>
          </div>

          {/* Ghost Image (Original Underlay) Toggle & Opacity */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg font-semibold transition-all ${
                showGhost 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle ghost view of original image"
            >
              {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Ghost Original</span>
            </button>
            {showGhost && (
              <div className="flex items-center space-x-1.5 pl-1.5 border-l border-white/10">
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={ghostOpacity}
                  onChange={(e) => setGhostOpacity(parseFloat(e.target.value))}
                  className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  title="Ghost opacity"
                />
                <span className="text-[10px] font-mono text-teal-300 font-semibold w-7">
                  {Math.round(ghostOpacity * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-teal-300 px-1.5">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoom !== 1 && (
              <button
                onClick={() => setZoom(1)}
                className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-teal-300 rounded hover:bg-white/10 font-mono"
                title="Reset Zoom"
              >
                1:1
              </button>
            )}
          </div>

          {/* Quick Peek Original (Hold button, Spacebar, or Right-Click) */}
          <button
            onMouseDown={() => setIsPeekingOriginal(true)}
            onMouseUp={() => setIsPeekingOriginal(false)}
            onMouseLeave={() => setIsPeekingOriginal(false)}
            onTouchStart={() => setIsPeekingOriginal(true)}
            onTouchEnd={() => setIsPeekingOriginal(false)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-semibold select-none transition-all ${
              isPeekingOriginal
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : 'text-slate-300 border-white/10 bg-white/5 hover:text-white hover:bg-white/10'
            }`}
            title="Press and hold to view original photo (or hold Spacebar / right-click canvas)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Hold to Peek Original</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] bg-white/10 rounded font-mono text-slate-400">
              Space
            </kbd>
          </button>

          {/* History */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={historyStack.length <= 1}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 overflow-auto p-6 bg-studio-950 flex items-center justify-center min-h-[380px]">
          <div 
            className="relative bg-transparency-grid rounded-xl shadow-2xl overflow-hidden cursor-crosshair border border-white/10 transition-transform duration-100 ease-out"
            style={{ transform: `scale(${zoom})` }}
            onContextMenu={(e) => {
              e.preventDefault(); // Prevent default browser context menu
            }}
            onMouseDown={(e) => {
              if (e.button === 2) {
                // Right click: peek original photo
                e.preventDefault();
                setIsPeekingOriginal(true);
              }
            }}
            onMouseUp={(e) => {
              if (e.button === 2) {
                setIsPeekingOriginal(false);
              }
            }}
          >
            {/* Ghost layer of original un-cutout photo underneath */}
            {(showGhost || isPeekingOriginal) && originalUrl && (
              <img
                src={originalUrl}
                alt="Original Reference"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-150 ${
                  isPeekingOriginal ? 'z-20 opacity-100' : 'z-0'
                }`}
                style={{ opacity: isPeekingOriginal ? 1 : ghostOpacity }}
                draggable={false}
              />
            )}

            <canvas
              ref={canvasRef}
              onMouseDown={(e) => {
                if (e.button === 0) startDrawing(e);
              }}
              onMouseUp={(e) => {
                if (e.button === 0) stopDrawing();
                if (e.button === 2) setIsPeekingOriginal(false);
              }}
              onMouseMove={draw}
              onMouseLeave={() => {
                stopDrawing();
                setIsPeekingOriginal(false);
              }}
              className="relative z-10 max-h-[500px] w-auto object-contain block"
            />

            {/* Quick peek indicator overlay */}
            {isPeekingOriginal && (
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-lg bg-amber-400/90 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg pointer-events-none">
                Original Photo Preview
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Click & drag to paint. <span className="text-slate-300 font-medium">Right-click</span> or hold <span className="text-slate-300 font-medium">Spacebar</span> to peek original photo.
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-glow-teal transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
