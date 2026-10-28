import { vi } from 'vitest';

// Deliberately small boundary doubles, not a substitute for browser pixel tests.
export function installImageDouble(width = 8, height = 6, fails = false) {
  class TestImage {
    naturalWidth = width;
    naturalHeight = height;
    width = width;
    height = height;
    crossOrigin = '';
    onload: (() => void) | null = null;
    onerror: ((event: string) => void) | null = null;
    private source = '';
    set src(value: string) {
      this.source = value;
      queueMicrotask(() => fails ? this.onerror?.('decode error') : this.onload?.());
    }
    get src() { return this.source; }
  }
  vi.stubGlobal('Image', TestImage);
}

export function installCanvasDouble(data: Uint8ClampedArray, dataUrl = 'data:image/png;base64,b3JpZ2luYWw=') {
  const context = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data })),
  };
  const createElement = vi.fn(() => ({
    width: 0, height: 0,
    getContext: vi.fn(() => context),
    toDataURL: vi.fn(() => dataUrl),
  }));
  vi.stubGlobal('document', { createElement });
  return { context, createElement };
}
