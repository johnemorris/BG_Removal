import { readFileSync } from 'node:fs';
import JSZip from 'jszip';
import { beforeEach, expect, it, vi } from 'vitest';
import { exportBatchAsZip } from '@/lib/engine/zipExporter';

const pending = process.env.RUN_PENDING_REGRESSIONS === '1' ? it : it.skip;
const png = readFileSync(new URL('./fixtures/cutout.png', import.meta.url));
const dataUrl = `data:image/png;base64,${png.toString('base64')}`;
let download: Blob;
const click = vi.fn();
const revoke = vi.fn();

beforeEach(() => {
  vi.spyOn(URL, 'createObjectURL').mockImplementation(blob => { download = blob as Blob; return 'blob:test-zip'; });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revoke);
  vi.stubGlobal('document', {
    createElement: () => ({ href: '', download: '', click }),
    body: { appendChild: vi.fn(), removeChild: vi.fn() },
  });
});

it('exports distinct PNG entries with byte integrity and releases the download URL', async () => {
  await exportBatchAsZip([{ name: 'shirt.jpg', dataUrl }, { name: 'shoe.webp', dataUrl }]);
  const zip = await JSZip.loadAsync(await download.arrayBuffer(), { checkCRC32: true });
  expect(Object.keys(zip.files)).toEqual(['shirt-cutout.png', 'shoe-cutout.png']);
  for (const name of Object.keys(zip.files)) expect(await zip.files[name].async('nodebuffer')).toEqual(png);
  expect(click).toHaveBeenCalledOnce();
  expect(revoke).toHaveBeenCalledWith('blob:test-zip');
});

it('rejects corrupt base64 instead of downloading an invalid archive', async () => {
  await expect(exportBatchAsZip([{ name: 'bad.png', dataUrl: 'data:image/png;base64,a' }])).rejects.toThrow();
  expect(click).not.toHaveBeenCalled();
});

pending('R13 / Phase 5: same-stem inputs both survive the archive', async () => {
  await exportBatchAsZip([{ name: 'photo.jpg', dataUrl }, { name: 'photo.png', dataUrl }]);
  const zip = await JSZip.loadAsync(await download.arrayBuffer());
  expect(Object.values(zip.files).filter(file => !file.dir)).toHaveLength(2);
});
