import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  // A missed mock must fail locally, never fetch a model or call a real service.
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Unexpected network access in unit tests'); }));
});

afterEach(() => vi.unstubAllGlobals());
