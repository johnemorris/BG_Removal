import { beforeEach, expect, it, vi } from 'vitest';
import { removeBackground } from '@/lib/engine/bgRemoval';
import { installCanvasDouble, installImageDouble } from './helpers/browser';

const pending = process.env.RUN_PENDING_REGRESSIONS === '1' ? it : it.skip;
beforeEach(() => vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-image'));

it('rejects image decoding errors before sending an API request', async () => {
  installImageDouble(8, 6, true);
  await expect(removeBackground('fixture:broken')).rejects.toThrow('Failed to load image');
  expect(fetch).not.toHaveBeenCalled();
});

it('rejects a missing canvas context before sending an API request', async () => {
  installImageDouble();
  vi.stubGlobal('document', { createElement: () => ({ getContext: () => null }) });
  await expect(removeBackground(new Blob(['image']))).rejects.toThrow('Canvas context not available');
  expect(fetch).not.toHaveBeenCalled();
});

it('preserves original dimensions and submits refinement settings on a successful response', async () => {
  installImageDouble(4000, 3000);
  installCanvasDouble(new Uint8ClampedArray());
  vi.stubGlobal('FileReader', class {
    result = 'data:image/png;base64,Y3V0b3V0';
    onloadend?: () => void;
    readAsDataURL() { queueMicrotask(() => this.onloadend?.()); }
  });
  const request = vi.fn().mockResolvedValue(new Response(new Blob(['cutout'], { type: 'image/png' })));
  vi.stubGlobal('fetch', request);
  const progress = vi.fn();
  const result = await removeBackground(new File(['input'], 'product.png'), progress, { defringe: 3, shift: -2, feather: 0.75, alphaMatting: true });
  expect(result).toMatchObject({ width: 4000, height: 3000, cutoutDataUrl: 'data:image/png;base64,Y3V0b3V0' });
  expect(result.originalDataUrl).not.toBe(result.cutoutDataUrl);
  const [url, options] = request.mock.calls[0];
  expect(url).toBe('/api/remove-bg');
  expect(options.body.get('defringe')).toBe('3');
  expect(options.body.get('shift')).toBe('-2');
  expect(options.body.get('feather')).toBe('0.75');
  expect(options.body.get('alpha_matting')).toBe('true');
  expect(progress).toHaveBeenLastCalledWith({ stage: 'Complete!', percent: 100 });
});

pending('R04 / Phase 3: a failed processing response rejects without reporting completion', async () => {
  installImageDouble();
  installCanvasDouble(new Uint8ClampedArray());
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'worker unavailable' }, { status: 503 })));
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  const progress = vi.fn();
  await expect(removeBackground(new Blob(['image']), progress)).rejects.toThrow('worker unavailable');
  expect(progress.mock.calls.some(([p]) => p.percent === 100)).toBe(false);
});
