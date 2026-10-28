import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const cutout = readFileSync(path.join(process.cwd(), 'tests/fixtures/cutout.png'));

test.beforeEach(async ({ context }) => {
  // No model, Python, external images or credentials. Only localhost assets and
  // the explicitly stubbed inference response are available in this suite.
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/remove-bg') {
      await route.fulfill({ status: 200, contentType: 'image/png', body: cutout });
    } else if (url.origin === 'http://127.0.0.1:3100') {
      await route.continue();
    } else {
      await route.abort('blockedbyclient');
    }
  });
});

for (const [route, text] of [
  ['/', 'Remove Backgrounds in Seconds.'],
  ['/batch', 'Batch Background Removal'],
  ['/collage', 'Export Collage'],
  ['/pricing', 'Sleek Pricing. Instant Scale.'],
  ['/api-docs', 'API'],
]) {
  test(`primary route ${route} renders and hydrates`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator('main')).toContainText(text);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.fonts.check('16px "ClearCut Inter"'))).toBe(true);
    // Header effect proves hydration and the mobile menu proves event handling.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open Navigation' }).click();
    await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Close menu', exact: true }).click();
    expect(errors).toEqual([]);
  });
}

test('Studio upload → mocked processing → export dialog → free PNG download', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.locator('input[type=file]').first().setInputFiles('tests/fixtures/product.png');
  await page.getByRole('button', { name: 'Export / Download' }).click();
  await expect(page.getByText('Export Photo Studio Asset', { exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('studio-export.png') });
  await page.getByRole('button', { name: 'Current Studio Shot' }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Free Web Preview' }).click();
  const download = await downloaded;
  expect(await download.failure()).toBeNull();
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  const file = await download.path();
  expect(file).not.toBeNull();
  expect(readFileSync(file!).subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  expect(errors).toEqual([]);
});
