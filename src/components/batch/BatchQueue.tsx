'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  Layers, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Archive 
} from 'lucide-react';
import { BackgroundPreset, COLOR_PRESETS } from '@/lib/constants/presets';
import { removeBackground } from '@/lib/engine/bgRemoval';
import { renderCompositedCanvas } from '@/lib/engine/shadowRenderer';
import { exportBatchAsZip, ExportBatchFile } from '@/lib/engine/zipExporter';
import { getStoredUserState, deductCredit } from '@/lib/store/userStore';

interface BatchItem {
  id: string;
  file: File;
  name: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  originalUrl?: string;
  cutoutUrl?: string;
  finalUrl?: string;
  width?: number;
  height?: number;
}

interface BatchQueueProps {
  onOpenUpgradeModal: () => void;
}

export const BatchQueue: React.FC<BatchQueueProps> = ({ onOpenUpgradeModal }) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<BackgroundPreset>(COLOR_PRESETS[1]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newItems: BatchItem[] = files.map((file) => ({
      id: 'batch-' + Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      status: 'idle',
      progress: 0,
      originalUrl: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const processSingleItem = async (item: BatchItem, preset: BackgroundPreset): Promise<BatchItem> => {
    try {
      const result = await removeBackground(item.file);
      const canvas = await renderCompositedCanvas({
        cutoutUrl: result.cutoutDataUrl,
        originalUrl: result.originalDataUrl,
        background: preset,
        shadow: {
          enabled: true,
          opacity: 0.35,
          blur: 14,
          angle: 90,
          distance: 14,
          color: '#000000',
        },
        blurOriginalBg: 0,
        width: result.width,
        height: result.height,
      });

      const finalUrl = canvas.toDataURL('image/png');
      return {
        ...item,
        status: 'done',
        progress: 100,
        cutoutUrl: result.cutoutDataUrl,
        finalUrl,
        width: result.width,
        height: result.height,
      };
    } catch (e) {
      console.error('Error processing item:', e);
      return {
        ...item,
        status: 'error',
        progress: 0,
      };
    }
  };

  const startBatchProcess = async () => {
    setIsProcessingAll(true);
    const userState = getStoredUserState();
    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done') continue;

      updated[i] = { ...updated[i], status: 'processing', progress: 30 };
      setItems([...updated]);

      const finished = await processSingleItem(updated[i], selectedPreset);
      updated[i] = finished;
      setItems([...updated]);

      if (userState.credits > 0) {
        deductCredit();
      }
    }

    setIsProcessingAll(false);
  };

  const downloadAllZip = async () => {
    const doneItems = items.filter((item) => item.status === 'done' && item.finalUrl);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    const exportFiles: ExportBatchFile[] = doneItems.map((item) => ({
      name: item.name,
      dataUrl: item.finalUrl!,
    }));

    await exportBatchAsZip(exportFiles, `clearcut-batch-${Date.now()}.zip`);
    setIsZipping(false);
  };

  const completedCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-white">
      {/* Upload & Controls Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-dark-elevated space-y-6 border border-white/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-teal-400" />
              Batch Background Processing
            </h2>
            <p className="text-xs text-slate-400">
              Process up to 20 catalog images simultaneously with deep neural segmentation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-white/15 hover:border-teal-400 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Add Images</span>
            </button>

            {items.length > 0 && (
              <>
                <button
                  onClick={startBatchProcess}
                  disabled={isProcessingAll}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow-teal transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>{isProcessingAll ? 'Processing...' : 'Process All'}</span>
                </button>

                <button
                  onClick={downloadAllZip}
                  disabled={completedCount === 0 || isZipping}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold shadow-sm transition-all disabled:opacity-30"
                >
                  <Archive className="w-4 h-4 text-teal-400" />
                  <span>{isZipping ? 'Creating ZIP...' : `Download ZIP (${completedCount})`}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Global Preset Selector for Batch */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Apply Uniform Backdrop to Entire Batch:
            </span>
            <span className="text-teal-400 font-bold">{selectedPreset.name}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {COLOR_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all flex items-center space-x-2 ${
                  selectedPreset.id === preset.id
                    ? 'border-teal-400 bg-teal-500/20 text-teal-300 shadow-glow-teal'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border border-white/20 ${
                    preset.type === 'transparent' ? 'bg-transparency-grid' : ''
                  }`}
                  style={{
                    backgroundColor: preset.type === 'color' ? preset.value : undefined,
                  }}
                />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/15 rounded-3xl p-12 text-center glass-panel hover:border-teal-400/60 hover:bg-white/5 transition-all cursor-pointer space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center justify-center mx-auto shadow-glow-teal">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-white text-lg">
            Batch Queue is Empty
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Drag and drop multiple product photos to extract backgrounds in parallel and download a unified catalog ZIP.
          </p>
          <span className="inline-block mt-2 px-5 py-2.5 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-glow-teal">
            Select Photos
          </span>
        </div>
      ) : (
        /* Queue Table / Grid */
        <div className="glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-dark-elevated">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between text-xs text-slate-400 bg-white/5">
            <span>
              Queue Items: <strong className="text-white">{items.length}</strong> (Completed: <strong className="text-teal-300">{completedCount}</strong>)
            </span>
            <button
              onClick={clearAll}
              className="text-rose-400 hover:text-rose-300 font-bold"
            >
              Clear Queue
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl border border-white/15 bg-slate-900 overflow-hidden shrink-0 relative">
                    <img
                      src={item.finalUrl || item.originalUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate max-w-xs">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {item.status === 'idle' && (
                    <span className="inline-flex items-center space-x-1 text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  )}

                  {item.status === 'processing' && (
                    <span className="inline-flex items-center space-x-1 text-xs text-teal-300 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full animate-pulse shadow-glow-teal">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Processing...</span>
                    </span>
                  )}

                  {item.status === 'done' && (
                    <span className="inline-flex items-center space-x-1 text-xs text-teal-300 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  )}

                  {item.status === 'error' && (
                    <span className="inline-flex items-center space-x-1 text-xs text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}

                  {item.status === 'done' && item.finalUrl && (
                    <a
                      href={item.finalUrl}
                      download={`clearcut-${item.name}`}
                      className="p-2 text-slate-400 hover:text-teal-300 hover:bg-white/10 rounded-xl transition-colors"
                      title="Download image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
