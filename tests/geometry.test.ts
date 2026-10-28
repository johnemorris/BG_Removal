import { describe, expect, it } from 'vitest';
import { calculateCutoutBoundingBox, calculateSmartPaddingTransform, type CutoutBoundingBox } from '@/lib/engine/smartPadding';
import { MARKETPLACE_PRESETS } from '@/lib/constants/marketplaces';
import { installCanvasDouble, installImageDouble } from './helpers/browser';
import { rgba } from './fixtures/images';

const pending = process.env.RUN_PENDING_REGRESSIONS === '1' ? it : it.skip;

describe('alpha geometry', () => {
  it('locates the foreground origin using alpha > 12, ignoring opaque RGB in transparent pixels', async () => {
    installImageDouble();
    installCanvasDouble(rgba(8, 6, (x, y) => x >= 2 && x < 6 && y >= 1 && y < 5 ? 13 : 12));
    const bounds = await calculateCutoutBoundingBox('fixture:alpha-threshold');
    expect(bounds.minX).toBe(2);
    expect(bounds.minY).toBe(1);
    expect(bounds.imageWidth).toBe(8);
    expect(bounds.imageHeight).toBe(6);
  });

  pending('R17 / Phase 4: opaque 100×100 has exclusive 100×100 bounds', async () => {
    installImageDouble(100, 100);
    installCanvasDouble(rgba(100, 100, () => 255));
    expect(await calculateCutoutBoundingBox('fixture:opaque')).toMatchObject({ maxX: 100, maxY: 100, width: 100, height: 100 });
  });

  pending('R17 / Phase 4: empty alpha is an explicit empty result, not a full-image subject', async () => {
    installImageDouble();
    installCanvasDouble(rgba(8, 6, () => 0));
    // Proposed empty-result contract; finalize the return type in Phase 4.
    expect(await calculateCutoutBoundingBox('fixture:empty')).toBeNull();
  });

  pending('R17 / Phase 4: a single pixel uses exclusive upper bounds', async () => {
    installImageDouble();
    installCanvasDouble(rgba(8, 6, (x, y) => x === 3 && y === 2 ? 255 : 0));
    expect(await calculateCutoutBoundingBox('fixture:single')).toMatchObject({ minX: 3, minY: 2, maxX: 4, maxY: 3, width: 1, height: 1, cx: 3.5, cy: 2.5 });
  });

  pending('R17 / Phase 4: downsampled full alpha rescales to the complete original dimensions', async () => {
    installImageDouble(1001, 501);
    installCanvasDouble(rgba(1000, 500, () => 255));
    expect(await calculateCutoutBoundingBox('fixture:downsampled')).toMatchObject({ width: 1001, height: 501 });
  });
});

const box: CutoutBoundingBox = {
  minX: 100, minY: 50, maxX: 500, maxY: 250,
  width: 400, height: 200, cx: 300, cy: 150, imageWidth: 800, imageHeight: 600,
};

describe('smart-padding transforms with explicit correct input bounds', () => {
  it('centers the subject at 85% fill without changing source aspect ratio', () => {
    const result = calculateSmartPaddingTransform(box, { enabled: true, fillPercentage: 85, autoCenter: true, canvasWidth: 2000, canvasHeight: 2000 });
    expect(result.scale).toBe(4.25);
    expect(box.width * result.scale).toBe(1700);
    expect(result.drawX + box.cx * result.scale).toBe(1000);
    expect(result.drawY + box.cy * result.scale).toBe(1000);
    expect(result.drawWidth / result.drawHeight).toBeCloseTo(800 / 600);
  });

  it('fits a landscape target and centers the whole image when auto-center is off', () => {
    const result = calculateSmartPaddingTransform(box, { enabled: true, fillPercentage: 80, autoCenter: false, canvasWidth: 2000, canvasHeight: 1500 });
    expect(result.scale).toBe(4);
    expect(result.drawX + result.drawWidth / 2).toBe(1000);
    expect(result.drawY + result.drawHeight / 2).toBe(750);
  });

  it.each([[-50, 0.1], [150, 1]])('clamps fill %s to ratio %s', (fillPercentage, ratio) => {
    const result = calculateSmartPaddingTransform(box, { enabled: true, fillPercentage, autoCenter: true, canvasWidth: 2000, canvasHeight: 2000 });
    expect(box.width * result.scale).toBe(2000 * ratio);
  });

  it('preserves the six existing preset dimensions and Amazon no-shadow settings', () => {
    expect(MARKETPLACE_PRESETS.map(p => [p.id, p.width, p.height])).toEqual([
      ['amazon-compliance', 2000, 2000], ['shopify-hero', 2048, 2048], ['ebay-standard', 2000, 2000],
      ['etsy-gallery', 2000, 1500], ['instagram-square', 1080, 1080], ['instagram-story', 1080, 1920],
    ]);
    expect(MARKETPLACE_PRESETS[0]).toMatchObject({ fillPercentage: 85, backgroundColor: '#ffffff', shadow: { enabled: false } });
  });
});
