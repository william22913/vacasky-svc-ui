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

test('filters are inline on desktop and open in a bottom drawer on mobile', async ({
  page,
}, testInfo) => {
  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
    await expect(page.getByText('Apply filters')).toBeVisible();

    await page.screenshot({
      path: 'docs/FEAT-001/evidence/listing-filters-mobile.png',
      fullPage: false,
    });

    await page.getByRole('button', { name: 'Apply filters' }).click();
    await expect(page.getByText('Apply filters')).toBeHidden();
    return;
  }

  await expect(page.getByRole('combobox', { name: 'Destination' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Filters/ })).toBeHidden();
});

test('pagination loads the next page of twelve tours', async ({ page }) => {
  const response = await page.request.get('http://localhost:4010/api/v1/tours');
  const template = (await response.json()).data[0];
  await page.route(/\/api\/v1\/tours\?/, (route) => {
    const pageNo = Number(new URL(route.request().url()).searchParams.get('page') || 1);
    const data = Array.from({ length: 12 }, (_, index) => ({
      ...template,
      slug: `page-${pageNo}-tour-${index + 1}`,
      title: `Page ${pageNo} tour ${index + 1}`,
    }));
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data,
        meta: { page: pageNo, pageSize: 12, totalItems: 24, totalPages: 2 },
      }),
    });
  });

  await page.goto('/tours');
  await expect(page.locator('.tour-card')).toHaveCount(12);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('.tour-card')).toHaveCount(12);
  await expect(
    page.getByRole('link', { name: 'Page 2 tour 1', exact: true })
  ).toBeVisible();
});

test('a page past the last page is clamped', async ({ page }) => {
  await page.goto('/tours?page=5');

  await expect(page.getByText('2 tours')).toBeVisible();
  await expect(page).not.toHaveURL(/page=5/);
});

test('a page below one or a non-integer page falls back to the first page', async ({ page }) => {
  for (const value of ['0', '2.5', 'abc']) {
    await page.goto(`/tours?page=${value}`);
    await expect(page.getByText('2 tours')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Komodo National Park Sailing 3D2N' })).toBeVisible();
  }
});

test('the search input stops at 100 characters', async ({ page }) => {
  await page.goto('/tours');

  const search = page.getByLabel('Search tours');
  await search.pressSequentially('x'.repeat(105));
  await expect(search).toHaveValue('x'.repeat(100));
});

test('the category filter writes the slug to the URL', async ({ page }, testInfo) => {
  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  await page.getByRole('combobox', { name: 'Category' }).click();
  await page.getByTitle('Nature').click();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Apply filters' }).click();
  }

  await expect(page).toHaveURL(/category=nature/);
});

test('an inverted price range is reported and not requested', async ({ page }, testInfo) => {
  let requested = false;
  await page.route(/\/api\/v1\/tours\?/, (route) => {
    if (/priceMin=2000000|priceMax=1000000/.test(route.request().url())) requested = true;
    return route.continue();
  });

  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  await page.getByRole('spinbutton', { name: 'Minimum price in rupiah' }).fill('2000000');
  await page.getByRole('spinbutton', { name: 'Maximum price in rupiah' }).fill('1000000');
  await page.getByRole('spinbutton', { name: 'Maximum price in rupiah' }).blur();

  await expect(page.getByText('Minimum price must be lower than maximum price.')).toBeVisible();
  expect(requested).toBe(false);
});

test('the duration range writes to the URL and rejects an inverted range', async ({
  page,
}, testInfo) => {
  let requested = null;
  await page.route(/\/api\/v1\/tours\?/, (route) => {
    requested = route.request().url();
    return route.continue();
  });

  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  const min = page.getByRole('spinbutton', { name: 'Minimum duration in days' });
  const max = page.getByRole('spinbutton', { name: 'Maximum duration in days' });

  await min.fill('5');
  await max.fill('2');
  await max.blur();
  await expect(
    page.getByText('Minimum duration must be lower than maximum duration.')
  ).toBeVisible();
  expect(requested).not.toContain('durationMax=2');

  await min.fill('2');
  await max.fill('5');
  await max.blur();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Apply filters' }).click();
  }

  await expect(page).toHaveURL(/durationMin=2/);
  await expect(page).toHaveURL(/durationMax=5/);
});

test('equal price and duration bounds are accepted', async ({ page }, testInfo) => {
  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  await page.getByRole('spinbutton', { name: 'Minimum price in rupiah' }).fill('2000000');
  await page.getByRole('spinbutton', { name: 'Maximum price in rupiah' }).fill('2000000');
  await page.getByRole('spinbutton', { name: 'Maximum price in rupiah' }).blur();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Apply filters' }).click();
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  await page.getByRole('spinbutton', { name: 'Minimum duration in days' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Maximum duration in days' }).fill('3');
  await page.getByRole('spinbutton', { name: 'Maximum duration in days' }).blur();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Apply filters' }).click();
  }

  await expect(page).toHaveURL(/priceMin=2000000/);
  await expect(page).toHaveURL(/priceMax=2000000/);
  await expect(page).toHaveURL(/durationMin=3/);
  await expect(page).toHaveURL(/durationMax=3/);
  await expect(page.getByText('Minimum price must be lower than maximum price.')).toHaveCount(0);
  await expect(page.getByText('Minimum duration must be lower than maximum duration.')).toHaveCount(0);
});

test('the sort control writes the requested order', async ({ page }, testInfo) => {
  await page.goto('/tours');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /Filters/ }).click();
  }

  const sort = page.getByRole('combobox', { name: 'Sort by' });
  await sort.focus();
  await sort.press('Enter');
  await page.getByTitle('Price: low to high').click();

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Apply filters' }).click();
  }

  await expect(page).toHaveURL(/sort=price_asc/);
});

test('a destination with no tours offers a way back', async ({ page }) => {
  await page.route(/\/api\/v1\/tours\?/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_PAGE) })
  );

  await page.goto('/tours?destination=bali');
  await expect(page.getByText('No tours in Bali yet.')).toBeVisible();

  await page.getByRole('button', { name: 'See all tours' }).click();
  await expect(page).not.toHaveURL(/destination=/);
});

test('back restores the previous listing state', async ({ page }, testInfo) => {
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

  await page.goBack();
  await expect(page).not.toHaveURL(/destination=/);
  await expect(page.getByText('2 tours')).toBeVisible();
});

test('a tour card opens the detail page for that slug', async ({ page }) => {
  // The mock server serves one fixture for every slug, so the assertion is on
  // the slug the page asks for, not on the fixture's title.
  let requestedSlug = null;
  await page.route(/\/api\/v1\/tours\/[^/?]+$/, (route) => {
    requestedSlug = new URL(route.request().url()).pathname.split('/').pop();
    return route.continue();
  });

  await page.goto('/tours');
  await page.getByRole('link', { name: 'Raja Ampat Dive Expedition 6D5N' }).click();

  await expect(page).toHaveURL(/\/tours\/raja-ampat-dive-6d5n$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(requestedSlug).toBe('raja-ampat-dive-6d5n');
});

test('the search is operable from the keyboard', async ({ page }) => {
  await page.goto('/tours');

  await page.getByLabel('Search tours').focus();
  await page.keyboard.type('komodo');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/q=komodo/);
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

test('a slow earlier search never overwrites the newer results', async ({ page }) => {
  await page.route(/\/api\/v1\/tours\?/, async (route) => {
    const term = new URL(route.request().url()).searchParams.get('q') || '';
    const response = await route.fetch();
    const body = await response.json();
    const data = body.data.filter((tour) => tour.title.toLowerCase().includes(term.toLowerCase()));
    if (term === 'komodo') {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    await route.fulfill({
      response,
      json: { ...body, data, meta: { ...body.meta, totalItems: data.length, totalPages: 1 } },
    });
  });

  await page.goto('/tours');
  const search = page.getByLabel('Search tours');

  await search.fill('komodo');
  await page.waitForTimeout(450);
  await search.fill('raja');

  await expect(page.getByRole('link', { name: 'Raja Ampat Dive Expedition 6D5N' })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.getByRole('link', { name: 'Raja Ampat Dive Expedition 6D5N' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Komodo National Park Sailing 3D2N' })).toHaveCount(0);
});

test('the listing shows skeletons while the first page loads', async ({ page }, testInfo) => {
  await page.route(/\/api\/v1\/tours\?/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.goto('/tours');
  await expect(page.locator('.skeleton-card')).toHaveCount(12);

  await page.screenshot({
    path: `docs/FEAT-001/evidence/listing-loading-${testInfo.project.name}.png`,
    fullPage: false,
  });

  await expect(page.getByRole('link', { name: 'Raja Ampat Dive Expedition 6D5N' })).toBeVisible();
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
