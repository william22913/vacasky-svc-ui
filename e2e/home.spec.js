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

test('a featured tour opens its page and a destination opens its listing', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Komodo National Park Sailing 3D2N' }).click();
  await expect(page).toHaveURL(/\/tours\/komodo-sailing-3d2n$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Komodo National Park Sailing 3D2N'
  );

  await page.goBack();
  const bali = page.getByRole('link', { name: 'Bali', exact: true });
  await expect(bali).toHaveAttribute('href', '/tours?destination=bali');
  await bali.click();
  await expect(page).toHaveURL(/\/tours\?destination=bali$/);
});

test('home shows six skeletons while the feed loads', async ({ page }, testInfo) => {
  await page.route('**/api/v1/home', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.goto('/');
  await expect(page.locator('.skeleton-card')).toHaveCount(6);

  await page.screenshot({
    path: `docs/FEAT-001/evidence/home-loading-${testInfo.project.name}.png`,
    fullPage: false,
  });

  await expect(
    page.getByRole('link', { name: 'Komodo National Park Sailing 3D2N' })
  ).toBeVisible();
});

test('home with no featured content still renders and offers the catalog', async ({ page }) => {
  const response = await page.request.get('http://localhost:4010/api/v1/home');
  const body = await response.json();
  await page.route('**/api/v1/home', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...body, featuredTours: [], featuredDestinations: [] }),
    })
  );

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('New tours are on the way.')).toBeVisible();
  await expect(page.getByText('Destinations are being added.')).toBeVisible();

  await page.getByLabel('Search tours').fill('komodo');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page).toHaveURL(/\/tours\?q=komodo/);
});

test('home never shows more than six featured tours or destinations', async ({ page }) => {
  const response = await page.request.get('http://localhost:4010/api/v1/home');
  const body = await response.json();
  const sevenTours = Array.from({ length: 7 }, (_, index) => ({
    ...body.featuredTours[0],
    slug: `sample-tour-${index + 1}`,
    title: `Sample featured tour ${index + 1}`,
  }));
  const sevenDestinations = Array.from({ length: 7 }, (_, index) => ({
    ...body.featuredDestinations[0],
    slug: `sample-destination-${index + 1}`,
    name: `Sample destination ${index + 1}`,
  }));
  await page.route('**/api/v1/home', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...body,
        featuredTours: sevenTours,
        featuredDestinations: sevenDestinations,
      }),
    })
  );

  await page.goto('/');
  await expect(page.locator('.tour-card')).toHaveCount(6);
  await expect(page.locator('.destination-card')).toHaveCount(6);
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
