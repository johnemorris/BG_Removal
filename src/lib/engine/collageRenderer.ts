import { CollageLayer } from '@/lib/types/collage';
import { BackgroundPreset } from '@/lib/constants/presets';

export async function renderCollageToCanvas(
  layers: CollageLayer[],
  canvasWidth: number,
  canvasHeight: number,
  background: BackgroundPreset
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Draw Background
  if (background.type === 'color') {
    ctx.fillStyle = background.value;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else if (background.type === 'gradient') {
    // Basic linear gradient or solid fallback
    const grad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else if (background.type === 'image') {
    try {
      const bgImg = await loadImage(background.value);
      drawImageCover(ctx, bgImg, canvasWidth, canvasHeight);
    } catch (e) {
      console.warn('Failed to load background image for collage export', e);
    }
  }

  // 2. Draw Layers in order
  for (const layer of layers) {
    const src = layer.useCutout && layer.cutoutUrl ? layer.cutoutUrl : layer.originalUrl;
    if (!src) continue;

    try {
      const img = await loadImage(src);
      ctx.save();
      ctx.globalAlpha = layer.opacity ?? 1;

      // Translate to layer center for flipping/rotation
      const centerX = layer.x + layer.width / 2;
      const centerY = layer.y + layer.height / 2;
      ctx.translate(centerX, centerY);

      // Rotate if applicable
      if (layer.rotation) {
        ctx.rotate((layer.rotation * Math.PI) / 180);
      }

      // Flip Horizontally or Vertically
      const scaleX = layer.flipH ? -1 : 1;
      const scaleY = layer.flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);

      // Draw image centered at origin
      ctx.drawImage(
        img,
        -layer.width / 2,
        -layer.height / 2,
        layer.width,
        layer.height
      );

      ctx.restore();
    } catch (err) {
      console.error(`Failed to draw layer "${layer.name}":`, err);
    }
  }

  return canvas;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = w / h;
  let renderW = w;
  let renderH = h;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imgRatio) {
    renderH = w / imgRatio;
    offsetY = (h - renderH) / 2;
  } else {
    renderW = h * imgRatio;
    offsetX = (w - renderW) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}
