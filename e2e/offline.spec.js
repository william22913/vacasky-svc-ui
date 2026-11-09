import { expect, test } from '@playwright/test';

// Uses the production build served by `vite preview`, because the service
// worker is only registered there.
test('offline navigation falls back to the offline page', async ({ page, context }, testInfo) => {
  await page.goto('http://localhost:4174/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

  await context.setOffline(true);
  await page.goto('http://localhost:4174/tours/komodo-sailing-3d2n').catch(() => {});

  // NetworkFirst waits 3s for the network before serving the fallback.
  await expect(page.getByRole('heading', { name: "You're offline" })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/offline-sw-${testInfo.project.name}.png`,
    fullPage: false,
  });

  await context.setOffline(false);
});
