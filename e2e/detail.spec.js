import { expect, test } from '@playwright/test';

test('detail shows every required field and a pre-filled enquiry link', async ({ page }, testInfo) => {
  await page.goto('/tours/bali-island-escape');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bali Island Escape');

  // TC-051: every required field is present, not just the section headings.
  const head = page.locator('.detail-head');
  await expect(head.getByRole('link', { name: 'Bali', exact: true })).toHaveAttribute(
    'href',
    '/tours?destination=bali'
  );
  await expect(head.getByText('Beach', { exact: true })).toBeVisible();
  await expect(head.locator('.detail-meta')).toContainText('5 days');
  await expect(
    page.getByText("Five days across Bali's south coast, from Uluwatu to Ubud.")
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Highlights' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What is included' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Departure dates' })).toBeVisible();
  await expect(page.getByText('20 November 2026')).toBeVisible();
  await expect(page.getByText('Rp 4.500.000').first()).toBeVisible();
  await expect(page.locator('.gallery__lead img')).toHaveAttribute(
    'alt',
    'Bali Island Escape beach at sunset'
  );
  await expect(page.locator('.gallery__thumbs img')).toHaveCount(3);

  // TC-056: the action opens WhatsApp with the tour name in the message and
  // the page has no enquiry form, booking step or payment control.
  const enquiry = page.getByRole('link', { name: 'Enquire about this tour' }).first();
  const href = await enquiry.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  expect(href).toContain(encodeURIComponent('Bali Island Escape'));
  await expect(enquiry).toHaveAttribute('target', '_blank');
  await expect(page.locator('.detail-page form')).toHaveCount(0);
  await expect(
    page.locator('.detail-page input, .detail-page textarea, .detail-page select')
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: /book|pay|checkout|reserve/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /book|pay|checkout|reserve/i })).toHaveCount(0);

  await page.screenshot({
    path: `docs/FEAT-001/evidence/detail-${testInfo.project.name}.png`,
    fullPage: false,
  });
});

test('gallery thumbnails switch the lead image', async ({ page }) => {
  // Serve the photos so MediaImage keeps the contract URL instead of falling
  // back to the local placeholder; only then can the change be observed.
  await page.route(/^https:\/\/cdn\.example\//, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>',
    })
  );

  await page.goto('/tours/bali-island-escape');
  const lead = page.locator('.gallery__lead img');
  const thumbs = page.getByRole('button', { name: /Show photo/ });
  await expect(thumbs).toHaveCount(3);

  const secondThumb = thumbs.nth(1);
  const expectedSrc = await secondThumb.locator('img').getAttribute('src');
  const expectedAlt = await secondThumb.locator('img').getAttribute('alt');
  expect(expectedSrc).toContain('/tours/bali-2.jpg');
  expect(expectedAlt).toBe('Rice terraces in Ubud');

  await expect(lead).toHaveAttribute('src', 'https://cdn.example/tours/bali-1.jpg');
  await expect(lead).toHaveAttribute('alt', 'Bali Island Escape beach at sunset');
  await expect(thumbs.nth(0)).toHaveAttribute('aria-pressed', 'true');

  await secondThumb.click();

  await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(thumbs.nth(0)).toHaveAttribute('aria-pressed', 'false');
  await expect(lead).toHaveAttribute('src', expectedSrc);
  await expect(lead).toHaveAttribute('alt', expectedAlt);
});

test('the detail page shows a skeleton, then the tour', async ({ page }, testInfo) => {
  await page.route(/\/v1\/tours\/[^/?]+$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.goto('/tours/bali-island-escape');
  await expect(page.locator('.detail-page[aria-hidden="true"]')).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/detail-loading-${testInfo.project.name}.png`,
    fullPage: false,
  });

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bali Island Escape');
});

test('a detail load failure offers a working retry', async ({ page }) => {
  let failing = true;
  await page.route(/\/v1\/tours\/[^/?]+$/, async (route) => {
    if (failing) {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          header: { request_id: 'req-detail-503', version: '1.0.0', timestamp: '2026-11-09T00:00:00Z' },
          payload: { status: 503, code: 'E-5-VAC-SRV-001', message: 'down' },
        }),
      });
      return;
    }
    await route.continue();
  });

  await page.goto('/tours/bali-island-escape');
  await expect(page.getByText("We couldn't load this tour. Please try again.")).toBeVisible();

  failing = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bali Island Escape');
});

test('a missing tour shows the tour not found page', async ({ page }, testInfo) => {
  await page.route(/\/v1\/tours\/[^/?]+$/, (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        header: { request_id: 'req-detail-404', version: '1.0.0', timestamp: '2026-11-09T00:00:00Z' },
        payload: { status: 404, code: 'TOUR_NOT_FOUND', message: 'No tour with that slug.' },
      }),
    })
  );

  await page.goto('/tours/missing-tour');

  await expect(page.getByRole('heading', { name: 'Tour not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to all tours' })).toBeVisible();

  // Same page frame as the other state pages: the footer closes the viewport
  // instead of floating above a strip of white space.
  const footerBottom = await page.evaluate(
    () => document.querySelector('.site-footer').getBoundingClientRect().bottom
  );
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  expect(footerBottom).toBeGreaterThanOrEqual(viewportHeight - 1);

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
