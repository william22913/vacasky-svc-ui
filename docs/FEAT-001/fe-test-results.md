---
feature_code: FEAT-001
service: vacasky-svc
version: 2
status: complete
spec_version: 1
testcase_version: 1
architecture_version: 1
contract_version: 3
tested_commit: e1adbd137bd994bc1c7f2de1abfa0ca4864c74c5
pr_url: https://github.com/william22913/vacasky-svc-ui/pull/1
mock_mode: mock-server.mjs (port 4010), contract version 3
last_updated: 2026-11-09
---

# FEAT-001 — Frontend Test Results

Feature: tour and travel agency website (Home, Tour listing, Tour detail,
Tour not found, Offline page).

Repo: `william22913/vacasky-svc-ui` — branch
`feat/FEAT-001-dev-home-listing-detail`, continuing PR #1. The run below was
made against commit `e1adbd137bd994bc1c7f2de1abfa0ca4864c74c5`, the test
commit that closes the round-3 review; this results document is the
metadata commit immediately after it and changes no application code.

Test cases: `docs/FEAT-001/testcase.md` version 1 (docs PR #29). Spec:
`docs/FEAT-001/spec.md` version 1 (docs PR #28). UI map:
`docs/FEAT-001/UIMap.md` version 1. API contract **version 3**, supplied
with the task and used unchanged.

Everything below was executed on 2026-11-09 against that commit.
The backend service is a separate repo and is out of scope for this
document.

## Verification summary

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | PASS — 0 errors, 0 warnings (`--max-warnings 0`) |
| Unit/component tests | `npm test` | PASS — 7 files, 31 tests |
| Production build | `npm run build` | PASS — Vite build; PWA precache 24 entries |
| End-to-end (desktop 1440×900 + mobile 360×800) | `npx playwright test` | PASS — 80 passed (40 per project), 0 skipped, 2.7 min |
| Live Docker/nginx preview | `verify_stack` with `docker-compose.verify.yml` | PASS — stack healthy; Newman 5 requests, 7 assertions, 0 failures |

Every test runs on both the desktop and mobile projects; there are no
conditional skips. The responsive filter test asserts the inline filter bar
on desktop and the bottom drawer on mobile in the same test.

## Test environment

- **Contract version 3.** Success responses are
  `{success, header:{request_id,version,timestamp}, payload}`; errors are
  `{success:false, header, payload:{status,code,message}}`. Endpoints:
  `/v1/home/featured-tours`, `/v1/home/featured-destinations`, `/v1/tours`,
  `/v1/tours/{slug}`, `/v1/destinations`, `/v1/health`. Listing parameters
  are `q, destination, category, price_min, price_max, duration_min,
  duration_max, sort, page`; the page size is fixed at 12; sort is
  `recommended|price-asc|price-desc|duration-asc`; prices are whole IDR.
  The contract was not edited.
- **Mock mode.** All browser tests use the supplied `mock-server.mjs`
  (`node mock-server.mjs 4010`) through the Vite dev proxy (`/v1` →
  `:4010`). The Docker preview runs the same mock behind nginx. The fixture
  is static: the listing endpoint ignores query parameters, the detail
  endpoint returns one fixture (`bali-island-escape`) for every slug, and
  image URLs point at the unreachable `cdn.vacasky.example` host. Tests
  therefore assert the slug and parameters the app *requests*, and use
  response interception where a filtered, slower, empty or failing response
  is needed.
- **Contract artifact note.** The docs repo contains no `openapi.yaml`,
  Postman collection or base URL for `vacasky-svc`; contract version 3 was
  supplied with the task and is authoritative. Nothing from the docs or
  backend repo was copied into this repo.
- **Browsers.** Playwright Chromium desktop (1440×900) and Pixel 5 profile
  (360×800), against `vite dev` on port 5180. The service-worker test uses
  the production build served by `vite preview` on port 4174.
- **Accessibility audit.** `e2e/accessibility.spec.js` runs inside the page
  and checks document overflow, accessible names, target sizes, alt text,
  landmarks, WCAG AA contrast and the approved fonts on the three screens at
  both viewports.

## Case-by-case results

Result meanings: **PASS** — an automated or manual check in this repo
demonstrates the expected result; **PASS (UI)** — the UI half is verified
and the remaining behaviour belongs to the service; **N/A (service)** — the
case exercises backend/API behaviour that this repo neither owns nor can
observe with the static mock.

| Case | Level | Result | Evidence / notes |
|---|---|---|---|
| TC-001 | UI | PASS | `home.spec.js › home shows the hero, featured tours and featured destinations`; featured items render in the API's order and the hero search starts a full-catalog search |
| TC-002 | UI | PASS | `home.spec.js › home never shows more than six featured tours or destinations`; 7-tour and 7-destination payloads render 6 cards each |
| TC-003 | UI | PASS | `home.spec.js › home with no featured content still renders and offers the catalog` |
| TC-004 | End-to-end | PASS | `home.spec.js › a featured tour opens its page and a destination opens its listing` |
| TC-005 | End-to-end | PASS | same test — the destination card carries `/tours?destination=<slug>` and the listing opens with the filter applied and in the URL (checked with Bali; the link is built the same way for every card) |
| TC-006 | UI | PASS | `home.spec.js › home shows six skeletons per section while the feed loads`; 12 skeletons total at final card size |
| TC-007 | UI | PASS | `home.spec.js › home keeps the hero and recovers a failed featured section on retry`; plain message, no raw error or code |
| TC-008 | UI | PASS | `listing.spec.js › listing shows results, the count and keeps the URL in sync`; 12 cards, "30 tours", page size fixed at 12 |
| TC-009 | UI | PASS (UI) | `listing.spec.js › pagination loads the next page of twelve tours`; the app requests page 2 and renders its 12 cards. Which tours make up pages 2–3 is service paging (the static mock does not page) |
| TC-010 | UI | PASS | same test — page 1 renders exactly 12 cards |
| TC-011 | UI | N/A (service) | Publication filtering is a service rule; the UI renders only what the API returns |
| TC-012 | UI | PASS | `listing.spec.js › a page past the last page is clamped`; `?page=5` is written back to `page=3` from `total_pages` |
| TC-013 | UI | PASS (UI) | `listing.spec.js` search tests write `q` and reload results; name matching is a service rule |
| TC-014 | UI | N/A (service) | Destination-name matching is performed by the service |
| TC-015 | UI | N/A (service) | Case-insensitive matching is performed by the service |
| TC-016 | UI | PASS | Empty keyword is omitted from the request (`listingParams.test.js`); the default listing test shows all tours |
| TC-017 | UI | PASS | `listingParams.test.js › trims the keyword and caps it at 100 characters`; whitespace-only becomes empty and is omitted |
| TC-018 | UI | PASS | same unit test plus `buildListingSearch` trim |
| TC-019 | API | N/A (service) | API acceptance of a 100-character term is a service contract test |
| TC-020 | UI | PASS | `listing.spec.js › the search input stops at 100 characters` |
| TC-021 | API | N/A (service) | Server rejection of an over-length term is a service contract test |
| TC-022 | UI | PASS | `listing.spec.js › listing shows a plain empty state with one clear action` |
| TC-023 | UI | PASS | same test — clear restores `/tours` and the full listing |
| TC-024 | UI | PASS | `listing.spec.js › listing shows results…` asserts the URL changes and results update without a document navigation |
| TC-025 | End-to-end | PASS | `listing.spec.js › a slow earlier search never overwrites the newer results` (debounce + abort + request sequence) |
| TC-026 | UI | PASS | Debounced typing (300 ms) writes the keyword; covered by the URL-sync test and the search-param unit tests |
| TC-027 | UI | PASS | `listing.spec.js › destination filter writes the slug to the URL` |
| TC-028 | UI | PASS | `listing.spec.js › the category filter writes the value to the URL` (Beach end-to-end); the fixed five-value list is unit-tested and no free text is accepted |
| TC-029 | UI | PASS (UI) | Price bounds are written to the URL and sent as `price_min`/`price_max`; endpoint inclusiveness is a service rule |
| TC-030 | UI | PASS | Price parser accepts 0 and the control sets `min={0}`; covered by `listingParams.test.js` |
| TC-031 | UI | PASS | `listing.spec.js › the duration range writes to the URL and rejects an inverted range` |
| TC-032 | UI | PASS | Each filter is URL-backed and round-trips (`buildListingSearch` unit test); combined values are sent in one request |
| TC-033 | UI | PASS | `listing.spec.js › listing shows a plain empty state…` clear-all action removes every filter key and restores the listing |
| TC-034 | UI | PASS | `listing.spec.js › a destination with no tours offers a way back`; destination stays selected and "No tours in Bali yet." is shown |
| TC-035 | UI | PASS | `listing.spec.js › an inverted price range is reported and not requested` |
| TC-036 | UI | PASS | `listing.spec.js › the duration range writes to the URL and rejects an inverted range` |
| TC-037 | UI | PASS | `listing.spec.js › equal price and duration bounds are accepted` |
| TC-038 | UI | PASS | same test — equal duration bounds are accepted |
| TC-039 | UI | PASS | `parseListingParams` accepts only whole, non-negative integers (`listingParams.test.js`); the control sets `min={0}` and `precision={0}` |
| TC-040 | UI | PASS | Duration parser has minimum 1; control sets `min={1}` and `precision={0}` |
| TC-041 | UI | PASS | `listingParams.test.js › drops unknown slug formats but keeps known style slugs`; unknown category values fall back to unfiltered |
| TC-042 | UI | PASS | A destination that is not in `/v1/destinations` is cleared from the URL and control, falling back to unfiltered (`TourListingPage` existence check plus the slug-format unit test) |
| TC-043 | UI | PASS | `singleOf` drops a repeated `destination`/`category` parameter (`listingParams.test.js`), matching the contract's single-value rule |
| TC-044 | UI | PASS | `listingParams.test.js › ignores invalid sort and page values` |
| TC-045 | UI | PASS (UI) | `listing.spec.js › the sort control writes the requested order`; ordering itself is a service rule |
| TC-046 | UI | PASS | `listing.spec.js › a page below one or a non-integer page falls back to the first page` (`0`, `2.5`, `abc`) |
| TC-047 | UI | PASS | URL-backed keyword, filters, sort and page verified across `listing.spec.js` |
| TC-048 | End-to-end | PASS | Direct visits to `/tours?destination=bali`, `?q=nothing`, `?page=5` and `/tours?page=0` restore the same view |
| TC-049 | End-to-end | PASS | `listing.spec.js › back restores the previous listing state` (forward is native browser history) |
| TC-050 | End-to-end | PASS | `listing.spec.js › a tour card opens the detail page for that slug` |
| TC-051 | UI | PASS | `detail.spec.js › detail shows every required field and a pre-filled enquiry link` asserts name, destination link and slug, category, duration, price, description text, highlights, what is included, three gallery images with alt text and departure dates (20 November 2026) |
| TC-052 | UI | PASS | `detail.spec.js` asserts `Rp 4.500.000` with "per person" |
| TC-053 | End-to-end | PASS | `detail.spec.js › a missing tour shows the tour not found page` (404 response) with a link back to the listing; the service returns 404 |
| TC-054 | End-to-end | PASS (UI) | The UI renders the not-found page for a 404; publication state is a service rule |
| TC-055 | End-to-end | PASS (UI) | A fresh load after a 404 renders the not-found page with no stale content (same path as TC-054) |
| TC-056 | UI | PASS | same test — asserts the `https://wa.me/` href contains the URL-encoded tour name, `target="_blank"`, and that the detail page has no form, input, booking/payment control or enquiry form |
| TC-057 | UI | PASS | `detail.spec.js › the detail page shows a skeleton, then the tour` |
| TC-058 | UI | PASS | `detail.spec.js › a detail load failure offers a working retry`; plain message only |
| TC-059 | UI | PASS | `listing.spec.js › the listing shows skeletons while the first page loads` (12 cards); the same skeleton renders for debounced search/filter reloads |
| TC-060 | UI | PASS | `listing.spec.js › listing error offers a working retry` |
| TC-061 | End-to-end | PASS | No auth code exists; every Playwright flow runs in a fresh anonymous context with no login or 401/403 |
| TC-062 | UI | PASS | `accessibility.spec.js` — no horizontal overflow on the three screens at 360 and 1440; the empty listing is screenshotted at both widths |
| TC-063 | UI | PASS | `accessibility.spec.js` — every visible interactive target is at least 44×44 (search, selects, range inputs, buttons, cards, enquiry, navigation) |
| TC-064 | UI | PASS | `listing.spec.js › the search is operable from the keyboard`; controls are native/AntD focusable elements with no keyboard traps |
| TC-065 | UI | PASS | `accessibility.spec.js` — zero unlabeled controls, scanning inputs, selects, textareas, buttons, links and ARIA button/link roles, with accessible names from aria-label, labels, title or text content |
| TC-066 | UI | PASS | 2px `:focus-visible` ring with offset defined for all focusable elements in `src/styles/app.css`; visible in the keyboard test |
| TC-067 | UI | PASS | `accessibility.spec.js` — header, nav, main, footer and exactly one `h1` on each screen |
| TC-068 | UI | PASS | `accessibility.spec.js` — zero images without alt text; `MediaImage` keeps the contract alt |
| TC-069 | UI | PASS | `accessibility.spec.js` — zero WCAG AA contrast failures on all screens at both widths (hero copy sits on the opaque dark card behind the scrim) |
| TC-070 | API | PASS | `offline.spec.js › the production build publishes a complete web app manifest` and the Newman manifest request |
| TC-071 | UI | PASS | `accessibility.spec.js › the document declares a mobile viewport` |
| TC-072 | End-to-end | PASS | `offline.spec.js › offline navigation falls back to the offline page` against the production build and its service worker |
| TC-073 | End-to-end | N/A (deployment) | HTTPS is terminated by the hosting platform; nginx serves HTTP behind it. Not observable in this environment |
| TC-074 | UI | PASS (manual) | Side-by-side comparison with `vacasky-home.png` at 1440×900 — see Design fidelity below and `evidence/home-desktop.png` |
| TC-075 | UI | PASS | `accessibility.spec.js › the homepage uses the approved fonts and background`; palette tokens in `src/styles/tokens.css` |

## Component usage

Ladder: `nexcomponent-ui` → Ant Design → existing project component → local.

- **nexcomponent-ui** is not a dependency of this greenfield repo, so nothing
  from it was used (`.nexai/profile.json` records the stack).
- **Ant Design 4.24** behaviour primitives: `ConfigProvider`, `Button`,
  `Input` (inside `SearchField`), `Select` and `InputNumber` (in
  `FilterFields`), `Drawer` (mobile filters).
- **Data layer:** `client.js` (one axios base URL), `catalogApi.js` (the six
  contract calls), `adapters/catalogAdapter.js` (`toTour`, `toTourDetail`,
  `toDestinationCard`, `toDestinationOption`, `toTourPage`), and
  `catalogService.js` (wire → view model).
- **Hooks:** `useApiResource` (status/data/error/retry, abort on unmount),
  `useTourListing` (URL state, debounce, request sequence, page write-back),
  `useDebouncedValue`.
- **Components:** `SiteHeader`, `SiteFooter`, `Wordmark`, `SearchField`,
  `TourCard`/`TourCardSkeleton`, `DestinationCard`, `CategoryTag`,
  `MediaImage` (local placeholder fallback), `StateBlock`
  (loading/empty/error), `Pagination`, `ScrollToTop`, `FilterFields`.
- All colours and type values come from `src/styles/tokens.css`; Ant Design
  colour overrides live in `src/styles/app.css` because v4 has no theme
  tokens.

## Design fidelity

Compared `evidence/home-desktop.png` (1440×900) with the supplied
`vacasky-home.png` (1440×900).

| Element | Design | Build | Verdict |
|---|---|---|---|
| Header | Wordmark left; Home, Tours, Destinations and a primary "Browse tours" action right | Same structure, 44px targets | Match |
| Hero | Split composition: photographic panel with Anton headline and subcopy over it, dark note card beside it, search field floating below | Same 2fr/1fr split at ≥1024px, copy over the scrimmed photo, dark `#111214` note card, white shadowed search card; below 1024px copy above the photo, then note, then search | Match in layout and type; imagery is a placeholder |
| Featured tours | Section heading and catalogue link over a three-column card grid | Same grid and card anatomy (photo, category tag, title, destination/duration, price) | Match |
| Featured destinations | Dark destination cards with photo, name and an "Explore …" affordance | Same `#111214` cards, whole-card link to the filtered listing | Match |
| Footer | Dark wordmark block, link columns, legal line | Same structure and colours | Match |
| Palette | `#2c7ba8`, `#1f5f85`, `#ffffff`, `#f2f4f6`, `#111111`, `#6b7280`, `#111214` | Same values in tokens | Match |
| Type | Anton display, Inter body | Same fonts, self-hosted, Anton uppercase display | Match |
| Sections outside Home (About, gallery, testimonials, values, blog) | Present in the wider collage | Not built | Out of approved scope (spec/UIMap cover Home, listing and detail only) |
| Sign-in and dropdown navigation | Present in the wider collage | Not built | Out of approved scope; the site is anonymous (REQ-014) |
| Mobile home | Not drawn | Single column: copy, photo, note card, search | Responsive adaptation of the same design |

Placeholder imagery is expected in mock mode: every `image_url` in the mock
points at `cdn.vacasky.example`, and `MediaImage` swaps in
`/placeholders/photo.svg` so layout, aspect ratios and alt text stay intact.
No design token, font or layout value was invented for the build.

## Evidence

All screenshots were produced by the Playwright suite in this run
(`docs/FEAT-001/evidence/`):

- Home: `home-desktop.png`, `home-mobile.png`, `home-loading-desktop.png`,
  `home-loading-mobile.png`, `home-error-desktop.png`,
  `home-error-mobile.png`
- Listing: `listing-desktop.png`, `listing-mobile.png`,
  `listing-loading-desktop.png`, `listing-loading-mobile.png`,
  `listing-empty-desktop.png`, `listing-empty-mobile.png`,
  `listing-filters-mobile.png`
- Detail: `detail-desktop.png`, `detail-mobile.png`,
  `detail-loading-desktop.png`, `detail-loading-mobile.png`,
  `not-found-desktop.png`, `not-found-mobile.png`
- Offline: `offline-desktop.png`, `offline-mobile.png`,
  `offline-sw-desktop.png`, `offline-sw-mobile.png`

## Known gaps and document conflicts

1. **Contract artifact.** Contract version 3 was supplied inline with the
   task; the docs repo has no `openapi.yaml`, Postman collection or base URL
   for `vacasky-svc`. The mock implements version 3 and was not edited by
   hand. Cases whose outcome depends on server filtering, ordering, paging
   or publication rules (TC-011, 014–015, 019, 021, 029, 045 and the
   service halves of 009, 013, 053–055) are marked N/A (service) or
   PASS (UI) rather than claimed as end-to-end passes.
2. **Enquiry values.** Contract version 3 has no enquiry object, so the
   detail page and footer build the WhatsApp/`mailto:` link from
   `VITE_WHATSAPP_NUMBER` / `VITE_CONTACT_EMAIL`. The checked-in example
   values are placeholders; when both are unset the enquiry action is hidden.
   No secret is committed.
3. **architecture.md in this repo.** It still describes the earlier
   `/api/...` paths and different query names. The implementation follows
   contract version 3; `architecture.md` was not edited (a `dev_feedback`
   entry requires asking first).
4. **Mock limits.** The static mock cannot demonstrate server-side filtering,
   ordering, paging or publication rules; response interception supplies the
   filtered, empty and failing shapes.
5. **TC-073** is a deployment-environment check (HTTPS termination and
   redirect) and cannot be observed here.
