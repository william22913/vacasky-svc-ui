import { expect, test } from '@playwright/test';

test('detail shows the tour, itinerary and the enquiry link', async ({ page }, testInfo) => {
  await page.goto('/tours/komodo-sailing-3d2n');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Komodo National Park Sailing 3D2N'
  );
  await expect(page.getByRole('heading', { name: 'Day by day' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What is included' })).toBeVisible();
  await expect(page.getByText('Rp 4.750.000').first()).toBeVisible();

  const enquiry = page.getByRole('link', { name: 'Enquire on WhatsApp' }).first();
  await expect(enquiry).toHaveAttribute('href', /^https:\/\/wa\.me\//);
  await expect(enquiry).toHaveAttribute('target', '_blank');

  await page.screenshot({
    path: `docs/FEAT-001/evidence/detail-${testInfo.project.name}.png`,
    fullPage: false,
  });
});

test('gallery thumbnails switch the lead image', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'checked once at desktop size');

  await page.goto('/tours/komodo-sailing-3d2n');
  const thumbs = page.getByRole('button', { name: /Show photo/ });
  await expect(thumbs).toHaveCount(3);
  await expect(thumbs.nth(0)).toHaveAttribute('aria-pressed', 'true');

  await thumbs.nth(1).click();
  await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(thumbs.nth(0)).toHaveAttribute('aria-pressed', 'false');
});

test('a missing tour shows the tour not found page', async ({ page }, testInfo) => {
  await page.route(/\/api\/v1\/tours\/[^/?]+$/, (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          code: 'TOUR_NOT_FOUND',
          message: 'No tour with that slug.',
          requestId: 'req-detail-404',
        },
      }),
    })
  );

  await page.goto('/tours/missing-tour');

  await expect(page.getByRole('heading', { name: 'Tour not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to all tours' })).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/not-found-${testInfo.project.name}.png`,
    fullPage: false,
  });
});

test('the offline page is served from the public shell', async ({ page }, testInfo) => {
  await page.goto('/offline.html');

  await expect(page.getByRole('heading', { name: "You're offline" })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/offline-${testInfo.project.name}.png`,
    fullPage: false,
  });
});
