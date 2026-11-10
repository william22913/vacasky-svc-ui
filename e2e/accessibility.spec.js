import { expect, test } from '@playwright/test';

// One pass over the rendered DOM per page and viewport. Runs in the page, so
// it sees the real computed colours, sizes and labels the visitor gets.
function audit() {
  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      Number(style.opacity) > 0
    );
  };
  const parse = (colour) => {
    const match = colour.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const [r, g, b, a = 1] = match[1].split(',').map(Number);
    return { r, g, b, a };
  };
  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const contrast = (a, b) => {
    const [high, low] = [luminance(a), luminance(b)].sort((left, right) => right - left);
    return (high + 0.05) / (low + 0.05);
  };
  const backgroundOf = (el) => {
    const stack = [];
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      const colour = parse(getComputedStyle(node).backgroundColor);
      if (colour && colour.a > 0) stack.push(colour);
      if (colour && colour.a === 1) break;
    }
    let background = { r: 255, g: 255, b: 255, a: 1 };
    for (let index = stack.length - 1; index >= 0; index -= 1) {
      background = blend(stack[index], background);
    }
    return background;
  };
  const nameOf = (el) =>
    el.getAttribute('aria-label') ||
    (el.labels && el.labels.length
      ? [...el.labels].map((label) => label.textContent.trim()).join(' ')
      : '') ||
    el.getAttribute('title') ||
    (el.textContent || '').trim();
  // Ant Design puts the input inside a taller visual control, and the tour
  // card exposes a stretched title link. Measure the area the visitor hits.
  const targetRect = (el) => {
    const wrapper = el.closest(
      '.ant-input-affix-wrapper, .ant-select-selector, .ant-input-number, .ant-btn'
    );
    if (wrapper) return wrapper.getBoundingClientRect();
    const after = getComputedStyle(el, '::after');
    if (
      el.tagName === 'A' &&
      after.content !== 'none' &&
      after.position === 'absolute'
    ) {
      const card = el.closest('article');
      if (card) return card.getBoundingClientRect();
    }
    return el.getBoundingClientRect();
  };

  const report = {
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    // Every control, including buttons and links, must carry an accessible
    // name: aria-label, an associated label, a title, or its own text.
    unlabeled: [
      ...document.querySelectorAll(
        'input, select, textarea, button, a[href], [role="combobox"], [role="button"], [role="link"]'
      ),
    ]
      .filter(visible)
      .filter((el) => !nameOf(el).trim())
      .map((el) => el.outerHTML.slice(0, 120)),
    smallTargets: [...document.querySelectorAll('a, button, input, [role="combobox"]')]
      .filter(visible)
      .map((el) => {
        const rect = targetRect(el);
        return {
          label: (nameOf(el) || el.textContent || '').trim().slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })
      .filter((target) => target.width < 44 || target.height < 44),
    imagesMissingAlt: [...document.images]
      .filter(visible)
      .filter((image) => !image.getAttribute('alt'))
      .map((image) => image.currentSrc.slice(-40)),
    h1Count: [...document.querySelectorAll('h1')].length,
    landmarks: {
      header: Boolean(document.querySelector('header')),
      nav: Boolean(document.querySelector('nav')),
      main: Boolean(document.querySelector('main')),
      footer: Boolean(document.querySelector('footer')),
    },
    contrastFailures: [],
  };

  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || el.closest('[aria-hidden="true"]')) continue;
    const ownText = [...el.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      .map((node) => node.textContent.trim())
      .join(' ');
    if (!ownText) continue;
    const style = getComputedStyle(el);
    const foreground = parse(style.color);
    if (!foreground) continue;
    const background = backgroundOf(el);
    const colour = foreground.a < 1 ? blend(foreground, background) : foreground;
    const size = parseFloat(style.fontSize);
    const bold = Number(style.fontWeight) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const required = large ? 3 : 4.5;
    const ratio = contrast(colour, background);
    const key = `${style.color}|${style.backgroundColor}|${size}|${ownText.slice(0, 20)}`;
    if (ratio + 0.01 < required && !seen.has(key)) {
      seen.add(key);
      report.contrastFailures.push({ text: ownText.slice(0, 50), ratio: Math.round(ratio * 100) / 100, required });
    }
  }

  return report;
}

const PAGES = [
  { name: 'home', path: '/', ready: 'Featured tours' },
  { name: 'listing', path: '/tours', ready: '30 tours' },
  { name: 'detail', path: '/tours/bali-island-escape', ready: 'Highlights' },
];

for (const { name, path, ready } of PAGES) {
  test(`${name} meets the accessibility checks`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(ready).first()).toBeVisible();

    const report = await page.evaluate(audit);

    expect(report.overflow, 'no horizontal scrolling').toBe(false);
    expect(report.unlabeled, 'every control has an accessible name').toEqual([]);
    expect(report.smallTargets, 'targets are at least 44px in both dimensions').toEqual([]);
    expect(report.imagesMissingAlt, 'every image has alt text').toEqual([]);
    expect(report.h1Count, 'exactly one h1').toBe(1);
    expect(report.landmarks, 'header, nav, main and footer are present').toEqual({
      header: true,
      nav: true,
      main: true,
      footer: true,
    });
    expect(report.contrastFailures, 'text meets WCAG AA').toEqual([]);
  });
}

test('the homepage uses the approved fonts and background', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Featured tours')).toBeVisible();

  const styles = await page.evaluate(() => ({
    h1: getComputedStyle(document.querySelector('h1')).fontFamily,
    body: getComputedStyle(document.body).fontFamily,
    background: getComputedStyle(document.body).backgroundColor,
  }));

  expect(styles.h1).toContain('Anton');
  expect(styles.body).toContain('Inter');
  expect(styles.background).toBe('rgb(255, 255, 255)');
});

test('the document declares a mobile viewport', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);
});
