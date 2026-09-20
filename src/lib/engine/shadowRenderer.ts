'use client';

import { BackgroundPreset } from '../constants/presets';

export interface ShadowSettings {
  enabled: boolean;
  opacity: number; // 0 to 1
  blur: number;    // 0 to 50
  angle: number;   // 0 to 360 degrees
  distance: number;// 0 to 60
  color: string;   // hex
}

export interface RenderOptions {
  cutoutUrl: string;
  originalUrl?: string;
  background: BackgroundPreset;
  shadow: ShadowSettings;
  blurOriginalBg: number; // 0 to 30
  width: number;
  height: number;
}

export async function renderCompositedCanvas(
  options: RenderOptions
): Promise<HTMLCanvasElement> {
  const { cutoutUrl, originalUrl, background, shadow, blurOriginalBg, width, height } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // 1. Draw Background
  if (blurOriginalBg > 0 && originalUrl) {
    // Bokeh blur mode on original photo
    const origImg = await loadImage(originalUrl);
    ctx.save();
    ctx.filter = `blur(${blurOriginalBg}px)`;
    // Scale slightly to prevent edge blur artifacts
    ctx.drawImage(origImg, -10, -10, width + 20, height + 20);
    ctx.restore();
  } else if (background.type === 'color') {
    ctx.fillStyle = background.value;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === 'gradient') {
    // Generate gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (background.id === 'grad-sunset') {
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(1, '#ec4899');
    } else if (background.id === 'grad-ocean') {
      grad.addColorStop(0, '#0ea5e9');
      grad.addColorStop(0.5, '#3b82f6');
      grad.addColorStop(1, '#1e1b4b');
    } else if (background.id === 'grad-aurora') {
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(0.5, '#06b6d4');
      grad.addColorStop(1, '#6366f1');
    } else if (background.id === 'grad-cyber') {
      grad.addColorStop(0, '#8b5cf6');
      grad.addColorStop(1, '#d946ef');
    } else {
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#94a3b8');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === 'image') {
    try {
      const bgImg = await loadImage(background.value);
      // Draw cover
      drawCoverImage(ctx, bgImg, width, height);
    } catch {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. Render Cutout Subject (with Drop Shadow if enabled)
  const cutoutImg = await loadImage(cutoutUrl);

  if (shadow.enabled) {
    ctx.save();
    const rad = (shadow.angle * Math.PI) / 180;
    const offsetX = Math.cos(rad) * shadow.distance;
    const offsetY = Math.sin(rad) * shadow.distance;

    // Convert hex color to rgba with opacity
    const hex = shadow.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;

    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${shadow.opacity})`;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;

    ctx.drawImage(cutoutImg, 0, 0, width, height);
    ctx.restore();
  } else {
    ctx.drawImage(cutoutImg, 0, 0, width, height);
  }

  return canvas;
}

function drawCoverImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvasWidth: number, canvasHeight: number) {
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;
  let renderWidth = canvasWidth;
  let renderHeight = canvasHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    renderWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - renderWidth) / 2;
  } else {
    renderHeight = canvasWidth / imgRatio;
    offsetY = (canvasHeight - renderHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + url));
    img.src = url;
  });
}
