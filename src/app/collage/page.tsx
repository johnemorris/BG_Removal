'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CollageCanvas } from '@/components/collage/CollageCanvas';
import { CollageSidebar } from '@/components/collage/CollageSidebar';
import { CollageToolbar } from '@/components/collage/CollageToolbar';
import { CollageLayer, CANVAS_PRESETS } from '@/lib/types/collage';
import { BackgroundPreset, COLOR_PRESETS } from '@/lib/constants/presets';
import { renderCollageToCanvas } from '@/lib/engine/collageRenderer';
import { removeBackground } from '@/lib/engine/bgRemoval';

export default function CollagePage() {
  const [layers, setLayers] = useState<CollageLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [canvasPresetId, setCanvasPresetId] = useState('square');
  const [background, setBackground] = useState<BackgroundPreset>(COLOR_PRESETS[0]);
  const [zoom, setZoom] = useState(0.55);
  const [isExporting, setIsExporting] = useState(false);

  // Active Canvas Preset Dimensions
  const activePreset = CANVAS_PRESETS.find((p) => p.id === canvasPresetId) || CANVAS_PRESETS[0];

  // Auto-fit zoom based on viewport
  useEffect(() => {
    const handleResize = () => {
      const availWidth = window.innerWidth - 360; // minus sidebar
      const availHeight = window.innerHeight - 180;
      const fitZoomW = availWidth / activePreset.width;
      const fitZoomH = availHeight / activePreset.height;
      const calculatedZoom = Math.min(fitZoomW, fitZoomH, 0.75);
      setZoom(Math.max(0.2, Math.round(calculatedZoom * 100) / 100));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activePreset]);

  // Handle Adding Images to Collage
  const handleAddImages = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const aspect = img.width / img.height;
        // Default width roughly 35% of canvas width
        const baseWidth = Math.round(activePreset.width * 0.38);
        const baseHeight = Math.round(baseWidth / aspect);

        // Stagger placement randomly near center
        const offset = (layers.length % 5) * 25;
        const startX = Math.round((activePreset.width - baseWidth) / 2) + offset;
        const startY = Math.round((activePreset.height - baseHeight) / 2) + offset;

        const newLayer: CollageLayer = {
          id: 'layer-' + Math.random().toString(36).substr(2, 9),
          name: file.name,
          originalUrl: url,
          useCutout: false,
          x: startX,
          y: startY,
          width: baseWidth,
          height: baseHeight,
          rotation: 0,
          flipH: false,
          opacity: 1,
          aspectRatio: aspect,
          naturalWidth: img.width,
          naturalHeight: img.height,
        };

        setLayers((prev) => [...prev, newLayer]);
        setSelectedLayerId(newLayer.id);
      };
    });
  };

  // Update specific layer
  const handleUpdateLayer = (id: string, updates: Partial<CollageLayer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  // Delete layer
  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  // Duplicate layer
  const handleDuplicateLayer = (id: string) => {
    const layerToDup = layers.find((l) => l.id === id);
    if (!layerToDup) return;

    const duplicated: CollageLayer = {
      ...layerToDup,
      id: 'layer-' + Math.random().toString(36).substr(2, 9),
      name: `${layerToDup.name} (Copy)`,
      x: layerToDup.x + 30,
      y: layerToDup.y + 30,
    };

    setLayers((prev) => [...prev, duplicated]);
    setSelectedLayerId(duplicated.id);
  };

  // Reorder layer
  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1) return;

    const newIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (newIdx < 0 || newIdx >= layers.length) return;

    const newLayers = [...layers];
    const [moved] = newLayers.splice(idx, 1);
    newLayers.splice(newIdx, 0, moved);
    setLayers(newLayers);
  };

  // Update multiple layers simultaneously (e.g. dragging a group)
  const handleUpdateMultipleLayers = (
    updates: { id: string; updates: Partial<CollageLayer> }[]
  ) => {
    setLayers((prev) => {
      const updateMap = new Map(updates.map((u) => [u.id, u.updates]));
      return prev.map((layer) => {
        const up = updateMap.get(layer.id);
        return up ? { ...layer, ...up } : layer;
      });
    });
  };

  // Group multiple layers together
  const handleGroupLayers = (layerIds: string[]) => {
    if (layerIds.length < 2) return;
    const newGroupId = 'group-' + Math.random().toString(36).substr(2, 9);
    setLayers((prev) =>
      prev.map((layer) =>
        layerIds.includes(layer.id) ? { ...layer, groupId: newGroupId } : layer
      )
    );
  };

  // Ungroup a specific layer or whole group
  const handleUngroupLayer = (layerId: string) => {
    const target = layers.find((l) => l.id === layerId);
    if (!target || !target.groupId) return;
    const targetGroupId = target.groupId;
    setLayers((prev) =>
      prev.map((layer) =>
        layer.groupId === targetGroupId ? { ...layer, groupId: undefined } : layer
      )
    );
  };

  // Toggle Background Removal for a layer
  const handleToggleBgRemoval = async (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    // If already has cutout, simply toggle between cutout and original
    if (layer.cutoutUrl) {
      handleUpdateLayer(id, { useCutout: !layer.useCutout });
      return;
    }

    // Otherwise, execute deep neural background removal
    handleUpdateLayer(id, { isRemovingBg: true });

    try {
      const result = await removeBackground(layer.originalUrl);
      handleUpdateLayer(id, {
        cutoutUrl: result.cutoutDataUrl,
        useCutout: true,
        isRemovingBg: false,
      });
    } catch (e) {
      console.error('Failed to remove background for layer:', e);
      alert('Failed to remove background for this image');
      handleUpdateLayer(id, { isRemovingBg: false });
    }
  };

  // Export composite collage
  const handleExport = async () => {
    if (layers.length === 0) return;
    setIsExporting(true);

    try {
      const canvas = await renderCollageToCanvas(
        layers,
        activePreset.width,
        activePreset.height,
        background
      );

      const mimeType = background.type === 'transparent' ? 'image/png' : 'image/jpeg';
      const ext = background.type === 'transparent' ? 'png' : 'jpg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `clearcut-collage-${activePreset.id}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Failed to export collage:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden bg-[#080c14] text-white">
      {/* Top Toolbar */}
      <CollageToolbar
        canvasPreset={canvasPresetId}
        onChangeCanvasPreset={setCanvasPresetId}
        zoom={zoom}
        onChangeZoom={setZoom}
        onExport={handleExport}
        isExporting={isExporting}
        layersCount={layers.length}
      />

      {/* Main Studio Body: Sidebar + Interactive Canvas */}
      <div className="flex-1 flex items-stretch overflow-hidden relative">
        {/* Left Sidebar */}
        <CollageSidebar
          layers={layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onAddImages={handleAddImages}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onReorderLayer={handleReorderLayer}
          onToggleBgRemoval={handleToggleBgRemoval}
          onGroupLayers={handleGroupLayers}
          onUngroupLayer={handleUngroupLayer}
          selectedBackground={background}
          onSelectBackground={setBackground}
        />

        {/* Center Interactive Canvas */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-dot-pattern">
          <CollageCanvas
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onUpdateMultipleLayers={handleUpdateMultipleLayers}
            onDeleteLayer={handleDeleteLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onReorderLayer={handleReorderLayer}
            onToggleBgRemoval={handleToggleBgRemoval}
            onGroupLayers={handleGroupLayers}
            onUngroupLayer={handleUngroupLayer}
            canvasWidth={activePreset.width}
            canvasHeight={activePreset.height}
            background={background}
            zoom={zoom}
          />
        </div>
      </div>
    </div>
  );
}
