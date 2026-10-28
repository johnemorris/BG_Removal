import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const io = vi.hoisted(() => ({ exec: vi.fn(), writeFile: vi.fn(), readFile: vi.fn(), unlink: vi.fn() }));
vi.mock('util', () => ({ promisify: () => io.exec }));
vi.mock('fs/promises', () => ({ default: io }));
import { POST } from '@/app/api/remove-bg/route';

const pending = process.env.RUN_PENDING_REGRESSIONS === '1' ? it : it.skip;
function json(body: unknown, headers: Record<string, string> = { 'x-internal-app': 'true' }) {
  return new NextRequest('http://localhost/api/remove-bg', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
beforeEach(() => {
  io.exec.mockResolvedValue({ stdout: '', stderr: '' });
  io.writeFile.mockResolvedValue(undefined);
  io.readFile.mockResolvedValue(Buffer.from('output'));
  io.unlink.mockResolvedValue(undefined);
});

describe('existing API validation and worker failure boundaries (no Python or disk writes)', () => {
  it('rejects absent authentication before inference or writes', async () => {
    const res = await POST(json({}, {}));
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ error: expect.stringContaining('Unauthorized') });
    expect(io.exec).not.toHaveBeenCalled();
    expect(io.writeFile).not.toHaveBeenCalled();
  });

  it('rejects unsupported content type', async () => {
    const res = await POST(new NextRequest('http://localhost/api/remove-bg', { method: 'POST', headers: { 'x-internal-app': 'true', 'content-type': 'text/plain' }, body: 'image' }));
    expect(res.status).toBe(415);
    expect(io.exec).not.toHaveBeenCalled();
  });

  it('rejects JSON without an image', async () => {
    const res = await POST(json({}));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Must provide either image_file, image_base64, or image_url.' });
    expect(io.exec).not.toHaveBeenCalled();
  });

  it('rejects multipart without an image_file', async () => {
    const form = new FormData();
    form.append('format', 'png');
    const res = await POST(new NextRequest('http://localhost/api/remove-bg', { method: 'POST', headers: { 'x-internal-app': 'true' }, body: form }));
    expect(res.status).toBe(400);
    expect(io.exec).not.toHaveBeenCalled();
  });

  it('reports worker errors as HTTP 500 and attempts cleanup of both temporary paths', async () => {
    io.exec.mockRejectedValueOnce(new Error('fixture worker failure'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await POST(json({ image_base64: 'aW1hZ2U=' }));
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: 'Failed to process background removal.' });
    expect(io.unlink).toHaveBeenCalledTimes(2);
    expect(io.readFile).not.toHaveBeenCalled();
  });
});

pending('R01 / Phase 2: invalid API credentials grant no access', async () => {
  expect((await POST(json({}, { 'x-api-key': 'invalid-fixture-key' }))).status).toBe(401);
});
pending('R01 / Phase 2: caller-controlled internal header grants no access', async () => {
  expect((await POST(json({}))).status).toBe(401);
});
pending('R06 / Phase 3: out-of-range refinement is rejected before inference', async () => {
  expect((await POST(json({ image_base64: 'aW1hZ2U=', feather: -100 }))).status).toBe(400);
  expect(io.exec).not.toHaveBeenCalled();
});
pending('R06 / Phase 3: invalid image bytes are rejected before inference', async () => {
  expect((await POST(json({ image_base64: 'bm90LWFuLWltYWdl' }))).status).toBe(400);
  expect(io.exec).not.toHaveBeenCalled();
});
pending('R21 / Phase 3: unsupported output formats are rejected', async () => {
  expect((await POST(json({ image_base64: 'aW1hZ2U=', format: 'gif' }))).status).toBe(400);
  expect(io.exec).not.toHaveBeenCalled();
});
pending('R05 / Phase 3: unsafe remote image destinations are rejected before fetching', async () => {
  // fetch stays blocked by setup.ts; this request never reaches a real host.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect((await POST(json({ image_url: 'http://127.0.0.1/private-fixture' }))).status).toBe(400);
  expect(fetch).not.toHaveBeenCalled();
  expect(io.exec).not.toHaveBeenCalled();
});
