import { expect, test } from '@playwright/test';

const HOME_ERROR = {
  error: {
    code: 'INTERNAL_ERROR',
    message: 'The homepage feed could not be read.',
    requestId: 'req-home-1',
  },
};

test('home shows the hero, featured tours and featured destinations', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Create unforgettable memories'
  );
  await expect(page.getByRole('heading', { name: 'Featured tours' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Featured destinations' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Komodo National Park Sailing 3D2N' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bali', exact: true })).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/home-${testInfo.project.name}.png`,
    fullPage: false,
  });
});

test('hero search opens the listing with the keyword in the URL', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Search tours').fill('komodo');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page).toHaveURL(/\/tours\?q=komodo/);
  await expect(page.getByRole('heading', { level: 1, name: 'Tours' })).toBeVisible();
});

test('home keeps the hero and recovers a failed featured section on retry', async ({
  page,
}, testInfo) => {
  let failing = true;
  await page.route('**/api/v1/home', async (route) => {
    if (failing) {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify(HOME_ERROR) });
      return;
    }
    await route.continue();
  });

  await page.goto('/');

  await expect(page.getByText("We couldn't load the featured tours.")).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.screenshot({
    path: `docs/FEAT-001/evidence/home-error-${testInfo.project.name}.png`,
    fullPage: false,
  });

  failing = false;
  await page.getByRole('button', { name: 'Retry' }).first().click();

  await expect(
    page.getByRole('link', { name: 'Komodo National Park Sailing 3D2N' })
  ).toBeVisible();
});
