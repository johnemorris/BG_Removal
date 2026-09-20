export interface CollageLayer {
  id: string;
  name: string;
  originalUrl: string;
  cutoutUrl?: string;
  useCutout: boolean;
  isRemovingBg?: boolean;
  x: number; // in pixels relative to base canvas width
  y: number; // in pixels relative to base canvas height
  width: number;
  height: number;
  rotation: number; // degrees 0-360
  flipH: boolean;
  flipV?: boolean;
  opacity: number; // 0 to 1
  aspectRatio: number;
  naturalWidth: number;
  naturalHeight: number;
  groupId?: string; // Optional group identifier for linked layers
}

export interface CanvasDimensions {
  width: number;
  height: number;
  label: string;
}

export const CANVAS_PRESETS: { id: string; name: string; width: number; height: number; iconText: string }[] = [
  { id: 'square', name: 'Square (1:1)', width: 1080, height: 1080, iconText: '1:1' },
  { id: 'portrait', name: 'Portrait (4:5)', width: 1080, height: 1350, iconText: '4:5' },
  { id: 'landscape', name: 'Landscape (16:9)', width: 1920, height: 1080, iconText: '16:9' },
  { id: 'story', name: 'Story / Reel (9:16)', width: 1080, height: 1920, iconText: '9:16' },
  { id: 'standard', name: 'Standard (4:3)', width: 1200, height: 900, iconText: '4:3' },
];
