'use client';

export interface CutoutBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  imageWidth: number;
  imageHeight: number;
}

export interface SmartPaddingOptions {
  enabled: boolean;
  fillPercentage: number; // 50 to 100
  autoCenter: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

export interface SmartPaddingTransform {
  scale: number;
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
  boundingBox: CutoutBoundingBox;
}

// Bounding box memory cache to prevent redundant pixel scans
const bboxCache = new Map<string, CutoutBoundingBox>();

/**
 * Loads an HTMLImageElement safely
 */
export function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image: ' + url));
    img.src = url;
  });
}

/**
 * Scans cutout image alpha channel to find the exact bounding box of the subject.
 */
export async function calculateCutoutBoundingBox(
  source: string | HTMLImageElement
): Promise<CutoutBoundingBox> {
  const cacheKey = typeof source === 'string' ? source : source.src;
  if (bboxCache.has(cacheKey)) {
    return bboxCache.get(cacheKey)!;
  }

  const img = typeof source === 'string' ? await loadImg(source) : source;
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  // Use a downsampled canvas for ultra-fast alpha scanning (<3ms)
  const maxScanDim = 1000;
  const scanScale = Math.min(1, maxScanDim / Math.max(naturalW, naturalH));
  const scanW = Math.max(1, Math.round(naturalW * scanScale));
  const scanH = Math.max(1, Math.round(naturalH * scanScale));

  const canvas = document.createElement('canvas');
  canvas.width = scanW;
  canvas.height = scanH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    const fallback: CutoutBoundingBox = {
      minX: 0,
      minY: 0,
      maxX: naturalW,
      maxY: naturalH,
      width: naturalW,
      height: naturalH,
      cx: naturalW / 2,
      cy: naturalH / 2,
      imageWidth: naturalW,
      imageHeight: naturalH,
    };
    return fallback;
  }

  ctx.drawImage(img, 0, 0, scanW, scanH);
  const imgData = ctx.getImageData(0, 0, scanW, scanH);
  const data = imgData.data;

  let minX = scanW;
  let minY = scanH;
  let maxX = -1;
  let maxY = -1;

  // Alpha threshold: pixels with alpha > 12 are counted as foreground
  const alphaThreshold = 12;

  for (let y = 0; y < scanH; y++) {
    for (let x = 0; x < scanW; x++) {
      const idx = (y * scanW + x) * 4;
      const alpha = data[idx + 3];
      if (alpha > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // If entirely transparent or empty, fallback to full image
  if (maxX === -1 || maxY === -1) {
    minX = 0;
    minY = 0;
    maxX = scanW;
    maxY = scanH;
  }

  // Rescale bounding box to natural image dimensions
  const origMinX = Math.max(0, Math.round(minX / scanScale));
  const origMinY = Math.max(0, Math.round(minY / scanScale));
  const origMaxX = Math.min(naturalW, Math.round(maxX / scanScale));
  const origMaxY = Math.min(naturalH, Math.round(maxY / scanScale));
  const boxW = Math.max(1, origMaxX - origMinX);
  const boxH = Math.max(1, origMaxY - origMinY);

  const result: CutoutBoundingBox = {
    minX: origMinX,
    minY: origMinY,
    maxX: origMaxX,
    maxY: origMaxY,
    width: boxW,
    height: boxH,
    cx: origMinX + boxW / 2,
    cy: origMinY + boxH / 2,
    imageWidth: naturalW,
    imageHeight: naturalH,
  };

  bboxCache.set(cacheKey, result);
  return result;
}

/**
 * Calculates scale and coordinates to position and size the subject within the target canvas.
 */
export function calculateSmartPaddingTransform(
  boundingBox: CutoutBoundingBox,
  options: SmartPaddingOptions
): SmartPaddingTransform {
  const { fillPercentage, autoCenter, canvasWidth, canvasHeight } = options;
  const fillRatio = Math.max(0.1, Math.min(1, fillPercentage / 100));

  const maxAllowedBoxW = canvasWidth * fillRatio;
  const maxAllowedBoxH = canvasHeight * fillRatio;

  // Scale the bounding box so it fits within the allowed fill box
  const scale = Math.min(
    maxAllowedBoxW / boundingBox.width,
    maxAllowedBoxH / boundingBox.height
  );

  const drawWidth = boundingBox.imageWidth * scale;
  const drawHeight = boundingBox.imageHeight * scale;

  let drawX: number;
  let drawY: number;

  if (autoCenter) {
    // Subject's optical center lands exactly at canvas center
    drawX = canvasWidth / 2 - boundingBox.cx * scale;
    drawY = canvasHeight / 2 - boundingBox.cy * scale;
  } else {
    // Standard center of entire image bounds
    drawX = (canvasWidth - drawWidth) / 2;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  return {
    scale,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
    boundingBox,
  };
}
