'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Eraser, 
  Paintbrush, 
  Undo, 
  RotateCcw, 
  Check, 
  X 
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
  const [tool, setTool] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState(25);
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-medium">Size:</span>
            <input
              type="range"
              min="5"
              max="80"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="w-8 font-mono text-teal-300 font-bold">{brushSize}px</span>
          </div>

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
          <div className="relative bg-transparency-grid rounded-xl shadow-2xl overflow-hidden cursor-crosshair border border-white/10">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              className="max-h-[500px] w-auto object-contain block"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Click & paint to {tool === 'erase' ? 'erase pixels' : 'restore original pixels'}.
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
