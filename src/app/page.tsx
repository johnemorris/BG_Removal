'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Paintbrush, 
  Download, 
  RotateCcw, 
  Layers, 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Camera,
  Image as ImageIcon,
  Scissors,
  Palette,
  Sliders,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutGrid
} from 'lucide-react';
import { ImageUploader } from '@/components/studio/ImageUploader';
import { SplitComparison } from '@/components/studio/SplitComparison';
import { BackgroundSelector } from '@/components/studio/BackgroundSelector';
import { ShadowControls } from '@/components/studio/ShadowControls';
import { BrushEditorModal } from '@/components/studio/BrushEditorModal';
import { ExportModal } from '@/components/studio/ExportModal';
import { HairRefineControls, HairRefineSettings } from '@/components/studio/HairRefineControls';
import { removeBackground, ProcessProgress } from '@/lib/engine/bgRemoval';
import { BackgroundPreset, COLOR_PRESETS } from '@/lib/constants/presets';
import { ShadowSettings } from '@/lib/engine/shadowRenderer';
import { addHistoryItem } from '@/lib/store/userStore';
import { openUpgradeModal } from '@/lib/store/modalStore';

type StudioTool = 'backdrop' | 'hair' | 'shadow';

export default function HomePage() {
  const [imageState, setImageState] = useState<{
    name: string;
    originalUrl: string;
    cutoutUrl: string;
    width: number;
    height: number;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessProgress>({ stage: '', percent: 0 });

  // Studio Customization States
  const [selectedBg, setSelectedBg] = useState<BackgroundPreset>(COLOR_PRESETS[0]);
  const [blurOriginalBg, setBlurOriginalBg] = useState<number>(0);
  const [shadow, setShadow] = useState<ShadowSettings>({
    enabled: false,
    opacity: 0.35,
    blur: 16,
    angle: 90,
    distance: 14,
    color: '#000000',
  });

  // Hair & Fringe Refinement
  const [hairSettings, setHairSettings] = useState<HairRefineSettings>({
    defringe: 2,
    shift: -1,
    feather: 0.5,
    alphaMatting: false,
  });
  const [isReprocessing, setIsReprocessing] = useState(false);

  // Modals
  const [brushModalOpen, setBrushModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Left Nav Studio Dock Tool Selection
  const [activeTool, setActiveTool] = useState<StudioTool | null>('backdrop');

  const handleImageSelected = async (source: string | File, name: string) => {
    setIsProcessing(true);
    setProgress({ stage: 'Reading image data...', percent: 15 });

    try {
      const result = await removeBackground(source, (p) => {
        setProgress(p);
      }, hairSettings);

      setImageState({
        name,
        originalUrl: result.originalDataUrl,
        cutoutUrl: result.cutoutDataUrl,
        width: result.width,
        height: result.height,
      });

      addHistoryItem({
        name,
        originalUrl: result.originalDataUrl,
        processedUrl: result.cutoutDataUrl,
        width: result.width,
        height: result.height,
      });
    } catch (e: any) {
      console.error('Processing failure:', e);
      alert('Failed to process image: ' + (e.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetStudio = () => {
    setImageState(null);
    setSelectedBg(COLOR_PRESETS[0]);
    setBlurOriginalBg(0);
    setShadow({
      enabled: false,
      opacity: 0.35,
      blur: 16,
      angle: 90,
      distance: 14,
      color: '#000000',
    });
  };

  const handleApplyHairRefinement = async () => {
    if (!imageState) return;
    setIsReprocessing(true);
    try {
      const result = await removeBackground(imageState.originalUrl, undefined, hairSettings);
      setImageState((prev) => (prev ? { ...prev, cutoutUrl: result.cutoutDataUrl } : null));
    } catch (e: any) {
      console.error('Hair refinement error:', e);
      alert('Failed to refine hair: ' + (e.message || 'Unknown error'));
    } finally {
      setIsReprocessing(false);
    }
  };

  let bgStyle: React.CSSProperties = {};
  let bgClass = '';

  if (selectedBg.type === 'color') {
    bgStyle = { backgroundColor: selectedBg.value };
  } else if (selectedBg.type === 'gradient') {
    bgStyle = { background: selectedBg.value };
  } else if (selectedBg.type === 'image') {
    bgStyle = {
      backgroundImage: `url(${selectedBg.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  } else {
    bgClass = 'bg-transparency-grid';
  }

  let shadowStyle: React.CSSProperties = {};
  if (shadow.enabled) {
    const rad = (shadow.angle * Math.PI) / 180;
    const offX = Math.round(Math.cos(rad) * shadow.distance);
    const offY = Math.round(Math.sin(rad) * shadow.distance);
    shadowStyle = {
      filter: `drop-shadow(${offX}px ${offY}px ${shadow.blur}px rgba(0, 0, 0, ${shadow.opacity}))`,
    };
  }

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel-glow rounded-3xl p-8 shadow-dark-elevated text-center space-y-5 text-white">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-300 animate-pulse shadow-glow-teal">
                <Sparkles className="w-8 h-8 fill-current" />
              </div>
              <div className="absolute inset-0 border-2 border-teal-400 border-t-transparent rounded-2xl animate-spin" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base tracking-tight">
                {progress.stage || 'Deep Neural Matting...'}
              </h4>
              <p className="text-xs text-slate-400">
                Segmenting subject with sub-pixel precision
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-200 rounded-full shadow-glow-cyan"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                <span>Inference Progress</span>
                <span className="text-teal-300">{progress.percent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio View or Landing View */}
      {imageState ? (
        /* Studio Workspace - Pixlr Style Docked Layout */
        <section className="w-full max-w-[1600px] px-3 sm:px-6 py-4 flex flex-col space-y-4 text-white">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel px-5 py-3 rounded-2xl shadow-dark-card border border-white/15">
            <div className="flex items-center space-x-3.5">
              <button
                onClick={handleResetStudio}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Choose another image"
                aria-label="Back to Upload"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {imageState.name}
                </h2>
                <span className="text-[11px] text-teal-400 font-mono">
                  {imageState.width} × {imageState.height} px • Deep Neural Alpha Cutout
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <Link
                href="/collage"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-white/15 hover:border-teal-400 hover:bg-white/10 text-white text-xs font-bold transition-all"
                title="Create a multi-image composition or collage"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-teal-400" />
                <span>Collage Maker</span>
              </Link>

              <button
                onClick={() => setBrushModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-white/15 hover:border-teal-400 hover:bg-white/10 text-white text-xs font-bold transition-all"
              >
                <Paintbrush className="w-3.5 h-3.5 text-teal-400" />
                <span>Touch-Up Brush</span>
              </button>

              <button
                onClick={() => setExportModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow-teal hover:brightness-110 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export / Download</span>
              </button>
            </div>
          </div>

          {/* Studio Workspace: Left Nav Dock + Attached Floating Tool Drawer + Static Image Canvas */}
          <div className="relative flex items-stretch w-full min-h-[calc(100vh-170px)]">
            {/* 1. Left Nav Dock */}
            <div className="flex flex-col items-center justify-start gap-2 bg-[#0b0f19]/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-dark-card z-30 shrink-0 h-fit">
              <button
                onClick={() => setActiveTool(activeTool === 'backdrop' ? null : 'backdrop')}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl text-[11px] font-semibold transition-all group ${
                  activeTool === 'backdrop'
                    ? 'bg-gradient-to-b from-teal-400/20 to-cyan-500/10 text-teal-300 border border-teal-400/40 shadow-glow-teal'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title="Backdrop & Blur"
              >
                <Palette className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${activeTool === 'backdrop' ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>Backdrop</span>
              </button>

              <button
                onClick={() => setActiveTool(activeTool === 'hair' ? null : 'hair')}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl text-[11px] font-semibold transition-all group ${
                  activeTool === 'hair'
                    ? 'bg-gradient-to-b from-teal-400/20 to-cyan-500/10 text-teal-300 border border-teal-400/40 shadow-glow-teal'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title="Hair & Defringe"
              >
                <Scissors className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${activeTool === 'hair' ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>Defringe</span>
              </button>

              <button
                onClick={() => setActiveTool(activeTool === 'shadow' ? null : 'shadow')}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl text-[11px] font-semibold transition-all group ${
                  activeTool === 'shadow'
                    ? 'bg-gradient-to-b from-teal-400/20 to-cyan-500/10 text-teal-300 border border-teal-400/40 shadow-glow-teal'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title="Drop Shadow"
              >
                <Sliders className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${activeTool === 'shadow' ? 'text-teal-300' : 'text-slate-400'}`} />
                <span>Shadow</span>
              </button>

              <div className="w-8 h-[1px] bg-white/10 my-1" />

              <button
                onClick={() => setBrushModalOpen(true)}
                className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-teal-300 hover:bg-white/5 transition-all group"
                title="Touch-Up Brush"
              >
                <Paintbrush className="w-5 h-5 mb-1 text-slate-400 group-hover:text-teal-300 transition-transform group-hover:scale-110" />
                <span>Erase</span>
              </button>
            </div>

            {/* 2. Attached Floating Tool Drawer (Floats over canvas without shifting image position) */}
            {activeTool && (
              <div className="absolute left-[76px] top-0 bottom-4 w-84 sm:w-96 flex flex-col bg-[#0b0f19]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-5 overflow-y-auto z-20 animate-in fade-in slide-in-from-left-4 duration-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    {activeTool === 'backdrop' && <Palette className="w-4 h-4 text-teal-400" />}
                    {activeTool === 'hair' && <Scissors className="w-4 h-4 text-teal-400" />}
                    {activeTool === 'shadow' && <Sliders className="w-4 h-4 text-teal-400" />}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {activeTool === 'backdrop' && 'Backdrop Settings'}
                      {activeTool === 'hair' && 'Hair & Edge Refinement'}
                      {activeTool === 'shadow' && 'Studio Drop Shadow'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTool(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Close Tool Palette"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tool Palette Content */}
                <div className="space-y-4">
                  {activeTool === 'backdrop' && (
                    <BackgroundSelector
                      selectedBackground={selectedBg}
                      onSelectBackground={setSelectedBg}
                      blurOriginalBg={blurOriginalBg}
                      onChangeBlurBg={setBlurOriginalBg}
                      hasOriginalImage={!!imageState.originalUrl}
                    />
                  )}

                  {activeTool === 'hair' && (
                    <HairRefineControls
                      settings={hairSettings}
                      onChangeSettings={setHairSettings}
                      onApplyRefinements={handleApplyHairRefinement}
                      isReprocessing={isReprocessing}
                    />
                  )}

                  {activeTool === 'shadow' && (
                    <ShadowControls
                      shadow={shadow}
                      onChangeShadow={setShadow}
                    />
                  )}
                </div>
              </div>
            )}

            {/* 3. Image Canvas (Anchored in place, never shifts when opening/closing palettes) */}
            <div className="flex-1 flex flex-col items-center justify-center pl-4 min-w-0 h-full">
              <SplitComparison
                originalUrl={imageState.originalUrl}
                processedUrl={imageState.cutoutUrl}
                width={imageState.width}
                height={imageState.height}
                activeBackgroundStyle={bgStyle}
                activeBackgroundClass={bgClass}
                shadowStyle={shadowStyle}
              />
            </div>
          </div>

          <BrushEditorModal
            isOpen={brushModalOpen}
            onClose={() => setBrushModalOpen(false)}
            originalUrl={imageState.originalUrl}
            cutoutUrl={imageState.cutoutUrl}
            onApplyChanges={(updated) => {
              setImageState((prev) => (prev ? { ...prev, cutoutUrl: updated } : null));
            }}
          />

          <ExportModal
            isOpen={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
            cutoutUrl={imageState.cutoutUrl}
            originalUrl={imageState.originalUrl}
            background={selectedBg}
            shadow={shadow}
            blurOriginalBg={blurOriginalBg}
            width={imageState.width}
            height={imageState.height}
            filename={imageState.name}
            onOpenUpgradeModal={() => openUpgradeModal('pro')}
          />
        </section>
      ) : (
        /* Landing Page Hero & Features */
        <div className="w-full flex flex-col items-center">
          {/* Hero Section */}
          <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-8 relative">
            {/* Background Aura */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-purple-500/10 blur-3xl pointer-events-none rounded-full" />

            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold shadow-glow-teal">
              <Sparkles className="w-4 h-4 text-teal-400 fill-current" />
              <span>Deep Learning AI Segmentation • 100% Automated</span>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto relative z-10">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Remove Backgrounds in Seconds. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 drop-shadow-sm">
                  Flawless. Crisp. 4K Ultra.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Supercharge your workflow like Pixlr & Pixelcut. Replace backgrounds with pure Amazon white, cast realistic 3D shadows, and export in 4K resolution.
              </p>
            </div>

            {/* Main Interactive Uploader */}
            <div className="pt-4 relative z-10">
              <ImageUploader
                onImageSelected={handleImageSelected}
                isLoading={isProcessing}
              />
            </div>
          </section>

          {/* Feature Showcase Grid */}
          <section className="w-full border-t border-white/10 bg-studio-900/60 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                  Sleek Creative Studio
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Pro-Grade Editing Built for E-Commerce & Creators
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Everything you need for market-ready product shots without manual pen-tool lassoing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-teal-400/50 hover:shadow-glow-teal transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center shadow-glow-teal">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">
                    Amazon & Shopify Ready
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instantly replace cluttered backdrops with 100% pure RGB (255,255,255) white backgrounds that pass marketplace compliance checks automatically.
                  </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-cyan-400/50 hover:shadow-glow-cyan transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shadow-glow-cyan">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">
                    Realistic AI Drop Shadows
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cutouts without shadows look flat and amateur. Add customizable depth, contact shadows, and ambient studio light angles to ground your products.
                  </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 hover:shadow-glow-purple transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shadow-glow-purple">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">
                    Multi-Image Batch Queue
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Queue 20 product catalog shots at once, apply uniform studio lighting, and download the entire collection in a single ZIP archive.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics */}
          <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 glass-panel rounded-3xl border border-white/10">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">50M+</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Images Processed</div>
              </div>
              <div className="p-6 glass-panel rounded-3xl border border-white/10">
                <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono shadow-glow-teal">&lt; 1.2s</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Inference Latency</div>
              </div>
              <div className="p-6 glass-panel rounded-3xl border border-white/10">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">4K Ultra</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Full Export Resolution</div>
              </div>
              <div className="p-6 glass-panel rounded-3xl border border-white/10">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-mono">100%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Private & GDPR Safe</div>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
            <div className="relative rounded-3xl bg-gradient-to-r from-teal-900/40 via-studio-900 to-purple-900/30 p-8 sm:p-14 text-center text-white overflow-hidden shadow-dark-elevated border border-white/15">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Ready to transform your visual catalog?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Get started with 3 free HD credits today. No credit card required.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-extrabold text-xs shadow-glow-teal transition-all"
                  >
                    View Pricing Plans
                  </Link>
                  <Link
                    href="/batch"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs transition-all"
                  >
                    Launch Batch Mode
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
