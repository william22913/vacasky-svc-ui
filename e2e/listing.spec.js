import { expect, test } from '@playwright/test';

const EMPTY_PAGE = { data: [], meta: { page: 1, pageSize: 12, totalItems: 0, totalPages: 0 } };

test('listing shows results, the count and keeps the URL in sync', async ({ page }, testInfo) => {
  await page.goto('/tours');

  await expect(page.getByRole('heading', { level: 1, name: 'Tours' })).toBeVisible();
  await expect(page.getByText('2 tours')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Raja Ampat Dive Expedition 6D5N' })
  ).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/listing-${testInfo.project.name}.png`,
    fullPage: false,
  });

  await page.getByLabel('Search tours').fill('komodo');
  await expect(page).toHaveURL(/q=komodo/, { timeout: 5000 });
  await expect(page.getByLabel('Search tours')).toHaveValue('komodo');
});

test('destination filter writes the slug to the URL', async ({ page }, testInfo) => {
  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  await page.getByRole('combobox', { name: 'Destination' }).click();
  await page.getByTitle('Bali').click();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Apply filters' }).click();
  }

  await expect(page).toHaveURL(/destination=bali/);
});

test('mobile filters open in a bottom drawer and apply', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'drawer exists below 1024px');

  await page.goto('/tours');
  await page.getByRole('button', { name: /Filters/ }).click();
  await expect(page.getByText('Apply filters')).toBeVisible();

  await page.screenshot({
    path: 'docs/FEAT-001/evidence/listing-filters-mobile.png',
    fullPage: false,
  });

  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.getByText('Apply filters')).toBeHidden();
});

test('listing shows a plain empty state with one clear action', async ({ page }, testInfo) => {
  await page.route(/\/api\/v1\/tours\?/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_PAGE) })
  );

  await page.goto('/tours?q=nothing');

  await expect(page.getByText('No tours match your search.')).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/listing-empty-${testInfo.project.name}.png`,
    fullPage: false,
  });

  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(page).not.toHaveURL(/q=/);
});

test('listing error offers a working retry', async ({ page }) => {
  let failing = true;
  await page.route(/\/api\/v1\/tours\?/, async (route) => {
    if (failing) {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { code: 'SERVICE_UNAVAILABLE', message: 'down', requestId: 'req-list-1' },
        }),
      });
      return;
    }
    await route.continue();
  });

  await page.goto('/tours');

  await expect(page.getByText("We couldn't load tours.")).toBeVisible();
  failing = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('2 tours')).toBeVisible();
});
