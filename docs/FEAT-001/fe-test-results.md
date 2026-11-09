---
feature_code: FEAT-001
service: vacasky-svc
version: 1
status: complete
spec_version: 1
testcase_version: 1
architecture_version: 1
contract_version: 1
tested_commit: 34a64c1
mock_mode: mock-server.mjs (port 4010)
last_updated: 2026-11-09
---

# FEAT-001 — Frontend Test Results

Feature: tour and travel agency website (Home, Tour listing, Tour detail,
Tour not found, Offline page).

Repo: `william22913/vacasky-svc-ui` — branch
`feat/FEAT-001-dev-home-listing-detail`, tested at commit `34a64c1`.
Test cases: `docs/FEAT-001/testcase.md` version 1 (PR #29). Spec:
`docs/FEAT-001/spec.md` version 1 (PR #28). API contract version 1, used
unchanged.

Everything below was executed on 2026-11-09 against the same working tree.
The backend service is a separate repo and is out of scope for this
document.

## Verification summary

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | PASS — 0 errors, 0 warnings (`--max-warnings 0`) |
| Unit/component tests | `npm run test` | PASS — 6 files, 23 tests |
| Production build | `npm run build` | PASS — Vite build; PWA precache 24 entries |
| End-to-end (desktop 1440×900 + mobile 360×800) | `npx playwright test` | PASS — 78 passed, 2 skipped (see note) |
| Live Docker/nginx preview | `verify_stack` with `docker-compose.verify.yml` | PASS — stack healthy; Newman 4 requests, 5 assertions, 0 failures |

The two skips are deliberate device-specific checks: the gallery thumbnail
test runs once at desktop size, and the bottom-sheet filters test exists
only for the mobile breakpoint.

## Test environment

- **Mock mode.** All browser tests use the supplied `mock-server.mjs`
  (`node mock-server.mjs 4010`) through the Vite dev proxy. The Docker
  preview runs the same mock behind nginx. The fixture is static: the
  listing endpoint ignores query parameters, the detail endpoint returns
  one fixture (`komodo-sailing-3d2n`) for every slug, and image URLs point
  at the unreachable `cdn.vacasky.example` host. Tests therefore assert the
  slug and parameters the app *requests*, and use response interception
  where a filtered or slower response is needed.
- **Browsers.** Playwright Chromium desktop (1440×900) and Pixel 5 profile
  (360×800), against `vite dev` on port 5180. The service-worker test uses
  the production build served by `vite preview` on port 4174.
- **Accessibility audit.** `e2e/accessibility.spec.js` runs inside the page
  and checks document overflow, accessible names, target sizes, alt text,
  landmarks, WCAG AA contrast and the approved fonts on all three screens at
  both viewports.

## Case-by-case results

Result meanings: **PASS** — an automated or manual check in this repo
demonstrates the expected result; **PASS (UI)** — the UI half is verified
and the remaining behaviour belongs to the service; **N/A (service)** — the
case exercises backend/API behaviour that this repo neither owns nor can
observe with the static mock.

| Case | Level | Result | Evidence / notes |
|---|---|---|---|
| TC-001 | UI | PASS | `home.spec.js › home shows the hero, featured tours and featured destinations`; featured items render in API order and the hero search starts a full-catalog search |
| TC-002 | UI | PASS | `home.spec.js › home never shows more than six featured tours or destinations`; 7-tour and 7-destination payload renders 6 cards each |
| TC-003 | UI | PASS | `home.spec.js › home with no featured content still renders and offers the catalog` |
| TC-004 | End-to-end | PASS | `home.spec.js › a featured tour opens its page and a destination opens its listing` |
| TC-005 | End-to-end | PASS | same test — Bali card carries `/tours?destination=bali` and the listing opens filtered |
| TC-006 | UI | PASS | `home.spec.js › home shows six skeletons while the feed loads` |
| TC-007 | UI | PASS | `home.spec.js › home keeps the hero and recovers a failed featured section on retry` |
| TC-008 | UI | PASS | `listing.spec.js › listing shows results, the count and keeps the URL in sync`; page size is fixed at 12 |
| TC-009 | UI | PASS | `listing.spec.js › pagination loads the next page of twelve tours` |
| TC-010 | UI | PASS | same test — page 1 renders exactly 12 cards |
| TC-011 | UI | N/A (service) | Publication filtering is a service rule; the UI renders only what the API returns |
| TC-012 | UI | PASS | `listing.spec.js › a page past the last page is clamped` |
| TC-013 | UI | PASS (UI) | `listing.spec.js` search tests write `q` and reload results; name matching is a service rule |
| TC-014 | UI | N/A (service) | Destination-name matching is performed by the service |
| TC-015 | UI | N/A (service) | Case-insensitive matching is performed by the service |
| TC-016 | UI | PASS (UI) | Empty keyword is omitted from the request; default listing test shows all tours |
| TC-017 | UI | PASS | `listingParams.test.js › trims the keyword and caps it at 100 characters`; whitespace-only becomes empty and is omitted |
| TC-018 | UI | PASS | same unit test plus `buildListingSearch` trim |
| TC-019 | API | N/A (service) | API acceptance of a 100-character term is a service contract test |
| TC-020 | UI | PASS | `listing.spec.js › the search input stops at 100 characters` |
| TC-021 | API | N/A (service) | Server rejection of an over-length term is a service contract test |
| TC-022 | UI | PASS | `listing.spec.js › listing shows a plain empty state with one clear action` |
| TC-023 | UI | PASS | same test — clear restores `/tours` and the full listing |
| TC-024 | UI | PASS | `listing.spec.js › listing shows results…` asserts the URL changes and results update without a document navigation |
| TC-025 | End-to-end | PASS | `listing.spec.js › a slow earlier search never overwrites the newer results` (sequence guard) |
| TC-026 | UI | PASS | Debounced typing writes the keyword; covered by the URL-sync test and the search-param unit tests |
| TC-027 | UI | PASS | `listing.spec.js › destination filter writes the slug to the URL` |
| TC-028 | UI | PASS | `listing.spec.js › the category filter writes the slug to the URL` |
| TC-029 | UI | PASS (UI) | Price bounds are written to the URL and sent as `minPrice`/`maxPrice`; endpoint inclusiveness is a service rule |
| TC-030 | UI | PASS | Price control allows 0 (`min={0}`) and the parser accepts it; covered by `listingParams.test.js` |
| TC-031 | UI | PASS | `listing.spec.js › the duration range writes to the URL…` |
| TC-032 | UI | PASS | Each filter is URL-backed and round-trips (`buildListingSearch` unit test); combined keys are sent in one request |
| TC-033 | UI | PASS | `listing.spec.js › listing shows a plain empty state…` clear-all action |
| TC-034 | UI | PASS | `listing.spec.js › a destination with no tours offers a way back` |
| TC-035 | UI | PASS | `listing.spec.js › an inverted price range is reported and not requested` |
| TC-036 | UI | PASS | `listing.spec.js › the duration range writes to the URL and rejects an inverted range` |
| TC-037 | UI | PASS | `listing.spec.js › equal price and duration bounds are accepted` |
| TC-038 | UI | PASS | same test |
| TC-039 | UI | PASS | `parseListingParams` accepts only whole, non-negative integers; the control sets `min={0}` and `precision={0}` |
| TC-040 | UI | PASS | Duration parser has minimum 1; control sets `min={1}` and `precision={0}` |
| TC-041 | UI | PASS | Unknown category slugs are dropped by the same slug filter as destinations |
| TC-042 | UI | PASS | `listingParams.test.js › drops unknown slug formats but keeps known style slugs` |
| TC-043 | UI | N/A (service) | Repeated values are sent as repeated parameters; the contract requires the service to ignore them |
| TC-044 | UI | PASS | `listingParams.test.js › ignores invalid sort and page values` |
| TC-045 | UI | PASS (UI) | `listing.spec.js › the sort control writes the requested order`; ordering itself is a service rule |
| TC-046 | UI | PASS | `listing.spec.js › a page below one or a non-integer page falls back to the first page` |
| TC-047 | UI | PASS | URL-backed keyword, filters, sort and page verified across `listing.spec.js` |
| TC-048 | End-to-end | PASS | Direct visits to `/tours?destination=bali`, `?q=nothing`, `?page=5` restore the same view |
| TC-049 | End-to-end | PASS | `listing.spec.js › back restores the previous listing state` (forward is native browser history) |
| TC-050 | End-to-end | PASS | `listing.spec.js › a tour card opens the detail page for that slug` |
| TC-051 | UI | PARTIAL | `detail.spec.js › detail shows the tour, itinerary and the enquiry link` covers title, summary, description, destination, category, duration, price, itinerary, inclusions, exclusions, images and enquiry. Departure dates are absent from contract version 1 although spec REQ-009 lists them — reported as a document conflict |
| TC-052 | UI | PASS | `detail.spec.js` asserts `Rp 4.750.000` with “per person” |
| TC-053 | End-to-end | PASS | `detail.spec.js › a missing tour shows the tour not found page` (404 response) |
| TC-054 | End-to-end | PASS (UI) | The UI renders the not-found page for a 404; publication state is a service rule |
| TC-055 | End-to-end | PASS (UI) | A fresh load after a 404 renders the not-found page (same path as TC-054) |
| TC-056 | UI | PASS | `detail.spec.js` asserts a `https://wa.me/` link with `target="_blank"`, no form and no payment |
| TC-057 | UI | PASS | `detail.spec.js › the detail page shows a skeleton, then the tour` |
| TC-058 | UI | PASS | `detail.spec.js › a detail load failure offers a working retry` |
| TC-059 | UI | PASS | `listing.spec.js › the listing shows skeletons while the first page loads` (12 cards) |
| TC-060 | UI | PASS | `listing.spec.js › listing error offers a working retry` |
| TC-061 | End-to-end | PASS | No auth code exists; every Playwright flow runs in a fresh anonymous context with no login or 401/403 |
| TC-062 | UI | PASS | `accessibility.spec.js` — no horizontal overflow on all three screens at 360 and 1440 |
| TC-063 | UI | PASS | `accessibility.spec.js` — every visible interactive target is at least 44×44 (search, selects, range inputs, buttons, cards, enquiry, navigation) |
| TC-064 | UI | PASS | `listing.spec.js › the search is operable from the keyboard`; controls are native/AntD focusable elements with no keyboard traps |
| TC-065 | UI | PASS | `accessibility.spec.js` — zero controls without an accessible name |
| TC-066 | UI | PASS (manual) | 2px focus ring defined for all focusable elements; focus is visible on the search field and buttons during the keyboard test |
| TC-067 | UI | PASS | `accessibility.spec.js` — header, nav, main, footer and exactly one `h1` on each screen |
| TC-068 | UI | PASS | `accessibility.spec.js` — zero images without alt text; MediaImage keeps the contract alt |
| TC-069 | UI | PASS | `accessibility.spec.js` — zero WCAG AA contrast failures on all screens at both widths |
| TC-070 | API | PASS | `offline.spec.js › the production build publishes a complete web app manifest` and the Newman manifest request |
| TC-071 | UI | PASS | `accessibility.spec.js › the document declares a mobile viewport` |
| TC-072 | End-to-end | PASS | `offline.spec.js › offline navigation falls back to the offline page` against the production build and its service worker |
| TC-073 | End-to-end | N/A (deployment) | HTTPS is terminated by the hosting platform; nginx serves HTTP behind it. Not observable in this environment |
| TC-074 | UI | PASS | Manual comparison with the Home panel of `uploads/design.png` at 1440×900 — see Design fidelity below and `evidence/home-desktop.png` |
| TC-075 | UI | PASS | `accessibility.spec.js › the homepage uses the approved fonts and background`; palette tokens in `src/styles/tokens.css` |

## Component usage

Ladder: `nexcomponent-ui` → Ant Design → existing project component → local.

- **nexcomponent-ui** is not a dependency of this greenfield repo, so nothing
  from it was used (`.nexai/profile.json` records the stack).
- **Ant Design 4.24** behaviour primitives: `ConfigProvider`, `Button`,
  `Input` (inside `SearchField`), `Select` and `InputNumber` (in
  `FilterFields`), `Drawer` (mobile filters).
- **Existing/local components:** `SiteHeader`, `SiteFooter`, `Wordmark`,
  `SearchField`, `TourCard`, `TourCardSkeleton`, `DestinationCard`,
  `CategoryTag`, `MediaImage` (local placeholder fallback), `StateBlock`
  (loading/empty/error), `Pagination` (accessible prev/next and page
  controls), `ScrollToTop`, `FilterFields`.
- All colours and type values come from `src/styles/tokens.css`; Ant Design
  colour overrides live in `src/styles/app.css` because v4 has no theme
  tokens.

## Design fidelity

Compared `evidence/home-desktop.png` (1440×900) with the Home panel of the
supplied collage (`uploads/design.png`; the Home panel is drawn at
1440×900).

| Element | Design | Build | Verdict |
|---|---|---|---|
| Header | Wordmark left, nav and primary action right | Same structure, 44px targets | Match |
| Hero | Dark photographic hero, Anton headline on two lines, subcopy, search row | Same composition and type; photo is a local placeholder because the mock CDN is unreachable | Match in layout/type; imagery is placeholder |
| Featured tours | Three-column card grid under a section heading with a catalogue link | Same grid, card anatomy (image, badge, category, title, meta, price) | Match |
| Featured destinations | Surface-background section with destination cards | Same section order, surface background and cards | Match |
| Footer | Dark wordmark block, link columns, legal line | Same structure and colours | Match |
| Palette | `#2c7ba8`, `#1f5f85`, `#ffffff`, `#f2f4f6`, `#111111`, `#6b7280`, `#111214` | Same values in tokens | Match |
| Type | Anton display, Inter body | Same fonts, self-hosted | Match |
| Sections in the collage outside Home (About, testimonials, values) | Present in the collage | Not built | Out of approved scope (spec/UIMap cover Home, listing and detail only) |
| Sign-in and dropdown navigation | Present in the collage | Not built | Out of approved scope; the site is anonymous (REQ-014) |
| Mobile home | Not drawn in the collage | Single column, hero search below the subcopy, drawer filters on the listing | Responsive adaptation of the same design |

Placeholder imagery is expected in mock mode: every `image.url` in the mock
points at `cdn.vacasky.example`, and `MediaImage` swaps in
`/placeholders/photo.svg` so the layout and alt text stay intact. No design
token, font or layout value was invented for the build.

## Evidence

All screenshots were produced by the Playwright suite in this run
(`docs/FEAT-001/evidence/`):

- Home: `home-desktop.png`, `home-mobile.png`, `home-loading-*.png`,
  `home-error-*.png`
- Listing: `listing-desktop.png`, `listing-mobile.png`,
  `listing-loading-*.png`, `listing-empty-*.png`, `listing-filters-mobile.png`
- Detail: `detail-desktop.png`, `detail-mobile.png`,
  `detail-loading-*.png`, `not-found-*.png`
- Offline: `offline-*.png`, `offline-sw-*.png`

## Known gaps and document conflicts

1. **Contract vs. spec — departure dates.** `spec.md` REQ-009 and TC-051
   require departure dates on the detail page, but contract version 1 has no
   `departureDates` field. The page cannot display them without a contract
   change; TC-051 is recorded as PARTIAL.
2. **architecture.md vs. approved contract.** The architecture document
   describes different paths, query names (`price_min`, `price_max`,
   `price-asc`) and an error envelope than the approved OpenAPI contract
   (`/api/v1/...`, `minPrice`, `maxPrice`, `price_asc`, `{error:{code,
   message, requestId, details}}`). The implementation follows the approved
   contract; this document was not edited.
3. **`testcase.md`** has no `## Frontend` heading; the UI cases were
   identified from the `Level` field of each case.
4. **Mock limits.** The static mock cannot demonstrate server-side filtering,
   ordering, paging or publication rules (TC-011, 014–015, 019, 021, 029,
   043, 045 and the service halves of 013, 054–055). Those are marked
   N/A/UI-half above rather than claimed as passes.
