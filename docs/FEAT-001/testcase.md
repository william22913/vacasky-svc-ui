---
feature_code: FEAT-001
service: vacasky-svc
version: 1
status: complete
spec_version: 1
open_questions: []
pr_url: https://github.com/william22913/sandbox-docs/pull/29
last_updated: 2026-11-09
---

# FEAT-001 — Tour & Travel Agency Website — Test Cases

Black-box acceptance tests derived only from `spec.md` version 1 (merged via
PR #28) and the requester's design brief (`vacasky-home.png`, 1440×900).
No implementation, API contract, or source code was inspected. Each case
states the layer it exercises (API / UI / end-to-end) and whether it is a
realistic automation candidate.

Screens under test: **Home**, **Tour listing**, **Tour detail**, **Tour not
found**, **Offline page**.

## Test data fixtures

Cases reference these fixtures by name; each case remains independently
executable by seeding the named fixture.

- **F1 — Default catalog**: 30 published tours. Destinations: Bali (12),
  Lombok (6), Yogyakarta (5), Komodo (4), Jakarta (3). All five categories
  present. Prices from 450,000 to 12,000,000 IDR; durations 1–14 days.
  Anchor tours: *Bali Island Escape* (Bali, Beach, 5 days, 4,500,000 IDR),
  *Komodo Sailing Adventure* (Komodo, Adventure, 3 days, 6,200,000 IDR),
  *Yogyakarta Heritage Walk* (Yogyakarta, Culture, 2 days, 1,250,000 IDR),
  *Lombok Mountain Trek* (Lombok, Mountain, 4 days, 3,800,000 IDR),
  *Jakarta City Lights* (Jakarta, City, 1 day, 450,000 IDR).
- **F2 — Mixed publication**: F1 plus 3 unpublished tours, one named
  *Hidden Draft Tour* (Bali), each with a valid content record.
- **F3 — Exactly 12**: 12 published tours.
- **F4 — Empty destination**: F1 plus a published destination *Flores*
  that has zero published tours.
- **F5 — Over-featured**: 7 tours flagged featured with `featured_order`
  1–7 and 7 destinations flagged featured with `featured_order` 1–7.
- **F6 — No featured content**: a catalog with zero tours and zero
  destinations flagged featured.
- **F7 — Fully populated tour**: *Bali Island Escape* (slug
  `bali-island-escape`) with description, 3 highlights, 4 inclusion items,
  3 images, and 3 departure dates.
- **F8 — Unpublished-only tour**: *Hidden Draft Tour* (slug
  `hidden-draft-tour`), a valid record marked unpublished.

## Requirement coverage

| Requirement | Description | Test cases | Notes |
|---|---|---|---|
| REQ-001 | Homepage shows up to six featured tours and six featured destinations in the agency's order, plus a way into the full catalog | TC-001, TC-002, TC-003 | Boundary cases cover the six-item cap and the zero-featured state |
| REQ-002 | Selecting a featured tour opens its detail page | TC-004 | |
| REQ-003 | Selecting a featured destination opens the listing filtered to that destination | TC-005 | |
| REQ-004 | Listing shows every published tour by default, 12 per page | TC-008, TC-009, TC-010, TC-011 | Unpublished tours are excluded (TC-011) |
| REQ-005 | Keyword search narrows by tour name or destination, case-insensitively, without a full page reload | TC-013, TC-014, TC-015, TC-024 | |
| REQ-006 | Destination, category, price-range and duration-range filters can be combined and cleared | TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-033 | |
| REQ-007 | Results update as the visitor changes them; a slow earlier request never overwrites newer results | TC-025, TC-026 | |
| REQ-008 | Selecting a tour from the listing opens its detail page | TC-050 | |
| REQ-009 | Detail page shows name, destination, duration, price per person in IDR, description, highlights, inclusions, images, departure dates | TC-051, TC-052 | |
| REQ-010 | Search, filters, sort and page are kept in the URL and restored by a copied link and by back/forward | TC-047, TC-048, TC-049 | |
| REQ-011 | Loading shows a skeleton or spinner rather than a blank page | TC-006, TC-057, TC-059 | One per data-loading screen |
| REQ-012 | No matches shows a plain message and a one-click clear that works | TC-022, TC-023 | |
| REQ-013 | Load failure shows a plain message and a retry; never raw errors | TC-007, TC-058, TC-060 | One per data-loading screen |
| REQ-014 | Site is public; no login for any browsing action | TC-061 | |
| REQ-015 | Works from 360px to wide desktop without horizontal scrolling; every interactive target is at least 44px | TC-062, TC-063 | |
| REQ-016 | Accessibility basics: semantics, labels, visible focus, keyboard operability, contrast, meaningful alt text | TC-064, TC-065, TC-066, TC-067, TC-068, TC-069 | |
| REQ-017 | PWA: valid manifest, service worker with offline page, HTTPS in production, viewport meta | TC-070, TC-071, TC-073 | Offline serving itself is REQ-026 |
| REQ-018 | Empty or whitespace-only search is treated as no keyword | TC-016, TC-017 | |
| REQ-019 | Search trimmed and case-insensitive; 100-character limit enforced by the input and by the server with a human-readable message | TC-015, TC-018, TC-019, TC-020, TC-021 | |
| REQ-020 | Price or duration range with minimum greater than maximum is reported invalid, not shown as empty results | TC-035, TC-036, TC-037, TC-038 | Equal minimum and maximum is valid (TC-037, TC-038) |
| REQ-021 | A filter or sort value outside the allowed list is ignored and falls back to the default for that control | TC-039, TC-040, TC-041, TC-042, TC-043, TC-044 | |
| REQ-022 | A destination with no published tours shows the empty state with a link back to all tours | TC-034 | Distinct from an unknown destination (TC-042) |
| REQ-023 | Missing or unpublished tour shows a not-found page with a link back and HTTP 404 | TC-053, TC-054 | |
| REQ-024 | A tour unpublished while being viewed shows the not-found state on the next data load | TC-055 | |
| REQ-025 | A page number past the last page is clamped to the last page | TC-012 | |
| REQ-026 | Offline, the PWA serves the app shell and an offline page instead of the browser network error | TC-072 | |
| REQ-027 | A no-permission state does not apply | — | Not testable — the site has no restricted content and no login, so there is no no-permission state to exercise; the positive public-access behaviour is covered by REQ-014 / TC-061 |
| REQ-028 | "Enquire about this tour" opens email or WhatsApp pre-filled with the tour name; no form submission, no payment | TC-056 | |

Non-goals (no behaviour exists to test; recorded so their absence is
deliberate, not an oversight):

| Non-goal | Why no case |
|---|---|
| Online booking, payment, checkout, reservation hold | Not implemented in this pass; TC-056 only confirms the enquiry action takes no payment |
| Contact or enquiry form submission | No form exists; TC-056 confirms the action does not submit one |
| User accounts, login, saved trips, wishlists | No account behaviour; public access is REQ-014 / TC-061 |
| Reviews and ratings | No such surface in scope |
| Multi-language and multi-currency | Interface is English and prices are IDR only; TC-052 checks the IDR display |
| Admin content-management UI | Content is authored outside the public site; not reachable from the public screens |
| Date-based availability search or filtering | Departure dates are display-only on the detail page (TC-051) |
| Blog, news, or generic CMS pages | No such page in scope |

## Test cases

### TC-001 — Homepage shows featured tours and destinations in the agency's order, plus a way into the catalog (positive)
- **Type**: positive
- **Spec reference**: REQ-001
- **Preconditions / test data**: Fixture F1, with six tours and six destinations flagged featured and given explicit `featured_order` values 1–6.
- **Action/input**: Open the homepage.
- **Expected result**: The homepage lists the six featured tours in the configured `featured_order`, and the six featured destinations in their configured order. A search box / link that starts a search of the full catalog is present. No login is requested.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-002 — Homepage shows at most six featured tours and six featured destinations (boundary)
- **Type**: boundary
- **Spec reference**: REQ-001
- **Preconditions / test data**: Fixture F5 (seven tours and seven destinations flagged featured, orders 1–7).
- **Action/input**: Open the homepage.
- **Expected result**: Exactly six featured tours are shown, in order 1–6 (the seventh is omitted). Exactly six featured destinations are shown, in order 1–6. The omitted seventh items are still reachable through the full tour listing.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-003 — Homepage with no featured content still renders and offers the catalog (boundary)
- **Type**: boundary
- **Spec reference**: REQ-001
- **Preconditions / test data**: Fixture F6 (zero featured tours, zero featured destinations).
- **Action/input**: Open the homepage.
- **Expected result**: The page renders without an error or a blank screen. The featured sections show no tour or destination cards. The way to start searching the full catalog is still present and works.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-004 — Selecting a featured tour opens its detail page (positive)
- **Type**: positive
- **Spec reference**: REQ-002
- **Preconditions / test data**: Fixture F1; *Bali Island Escape* is featured.
- **Action/input**: On the homepage, select the featured tour *Bali Island Escape*.
- **Expected result**: The tour detail page for *Bali Island Escape* opens and shows that tour's information.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-005 — Selecting a featured destination opens the listing filtered to it (positive)
- **Type**: positive
- **Spec reference**: REQ-003
- **Preconditions / test data**: Fixture F1; *Komodo* is a featured destination with 4 published tours.
- **Action/input**: On the homepage, select the featured destination *Komodo*.
- **Expected result**: The tour listing opens showing only the 4 published Komodo tours, with the Komodo destination filter visibly applied, and the URL carrying that destination.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-006 — Homepage shows a loading state while data loads (positive)
- **Type**: positive
- **Spec reference**: REQ-011
- **Preconditions / test data**: Fixture F1; throttle the home data request so it takes at least 2 seconds.
- **Action/input**: Open the homepage.
- **Expected result**: While the data is in flight, the featured areas show a skeleton or spinner. The page is not blank and no error is shown. When data arrives, the featured content replaces the loading state.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-007 — Homepage load failure shows a plain message and a working retry (negative)
- **Type**: negative
- **Spec reference**: REQ-013
- **Preconditions / test data**: Fixture F1; make the home data request fail (e.g. server error or network failure).
- **Action/input**: Open the homepage.
- **Expected result**: A plain, human-readable message says the home content could not be loaded and offers a retry action. No stack trace, raw error text, HTTP status code, or internal code is shown. After the fault is removed, activating retry loads the featured content normally.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-008 — Listing shows every published tour by default, 12 per page (positive)
- **Type**: positive
- **Spec reference**: REQ-004
- **Preconditions / test data**: Fixture F1 (30 published tours).
- **Action/input**: Open the tour listing with no search, no filters, no sort, and no page parameter.
- **Expected result**: Page 1 shows exactly 12 tours drawn from the 30 published tours, and pagination indicates 3 pages. No unpublished tour appears (see TC-011).
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-009 — Later pages show the remaining tours (positive)
- **Type**: positive
- **Spec reference**: REQ-004
- **Preconditions / test data**: Fixture F1 (30 published tours).
- **Action/input**: Open page 2, then page 3.
- **Expected result**: Page 2 shows the next 12 tours (12 items); page 3 shows the remaining 6 tours. Across pages 1–3, each of the 30 published tours appears exactly once and none is duplicated.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-010 — Exactly 12 tours fit on a single page (boundary)
- **Type**: boundary
- **Spec reference**: REQ-004
- **Preconditions / test data**: Fixture F3 (exactly 12 published tours).
- **Action/input**: Open the tour listing with no page parameter.
- **Expected result**: All 12 tours appear on page 1, and there is no page 2.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-011 — Unpublished tours never appear in listings or featured sections (negative)
- **Type**: negative
- **Spec reference**: REQ-004
- **Preconditions / test data**: Fixture F2 (30 published tours and 3 unpublished tours, one named *Hidden Draft Tour*).
- **Action/input**: Open the homepage and browse every page of the tour listing, including a search for "hidden".
- **Expected result**: *Hidden Draft Tour* and the other unpublished tours never appear in the listing, in search results, or in featured sections. The listing still shows all 30 published tours.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-012 — A page number past the last page is clamped to the last page (boundary)
- **Type**: boundary
- **Spec reference**: REQ-025
- **Preconditions / test data**: Fixture F1 (30 published tours, 3 pages).
- **Action/input**: Open the listing with `page=99` (hand-edited URL).
- **Expected result**: The listing shows the last page (page 3, the remaining 6 tours) instead of a blank listing. The page control reflects the last page. No error is shown.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-013 — Search by tour name narrows the listing (positive)
- **Type**: positive
- **Spec reference**: REQ-005
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Type `Komodo Sailing` into the search box and let the results update.
- **Expected result**: The listing shows *Komodo Sailing Adventure*, and no tour whose name and destination both lack that substring.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-014 — Search also matches the destination name (positive)
- **Type**: positive
- **Spec reference**: REQ-005
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Type `Yogyakarta` into the search box.
- **Expected result**: All 5 Yogyakarta tours are shown, even where the tour name itself does not contain "Yogyakarta" (for example a Yogyakarta tour named only after its activity).
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-015 — Search is case-insensitive (boundary)
- **Type**: boundary
- **Spec reference**: REQ-005, REQ-019
- **Preconditions / test data**: Fixture F1; *Bali Island Escape* exists.
- **Action/input**: Search with `bAlI eScApE` (mixed case).
- **Expected result**: The same result is returned as for `bali island escape`: *Bali Island Escape* is shown. No case-related mismatch occurs.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-016 — An empty search term shows all tours (boundary)
- **Type**: boundary
- **Spec reference**: REQ-018
- **Preconditions / test data**: Fixture F1; a non-empty search has already been applied and then deleted character by character.
- **Action/input**: Clear the search box completely.
- **Expected result**: The listing returns to all published tours (12 on page 1), exactly as with no search applied. No empty state and no error is shown.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-017 — A whitespace-only search term is treated as no keyword (boundary)
- **Type**: boundary
- **Spec reference**: REQ-018
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Enter `   ` (three spaces) into the search box.
- **Expected result**: The listing behaves as if no keyword was entered: all published tours are shown (12 on page 1), with no empty state and no error.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-018 — Leading and trailing whitespace is trimmed before matching (boundary)
- **Type**: boundary
- **Spec reference**: REQ-019
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Search for `   bali   ` (spaces before and after).
- **Expected result**: The result is identical to searching `bali`: the Bali tours match normally, and the spaces do not cause an empty result.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-019 — A 100-character search term is accepted (boundary)
- **Type**: boundary
- **Spec reference**: REQ-019
- **Preconditions / test data**: Fixture F1; a 100-character term (the maximum allowed length).
- **Action/input**: Submit the 100-character term to the listing search.
- **Expected result**: The term is accepted with no validation error; the listing shows its normal result for that term (the empty state if nothing matches, which is a valid result, not an error).
- **Priority**: Medium
- **Level**: API
- **Automation candidate**: yes

### TC-020 — The search input prevents more than 100 characters (boundary)
- **Type**: boundary
- **Spec reference**: REQ-019
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Paste or type a 101-character term into the search box.
- **Expected result**: The search field never holds more than 100 characters; the extra character is not accepted. No validation error message is needed for input the field refused.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-021 — The server rejects an over-length search term with a human-readable message (negative)
- **Type**: negative
- **Spec reference**: REQ-019
- **Preconditions / test data**: Fixture F1; a 101-character term sent directly to the tour listing data request, bypassing the input's length limit.
- **Action/input**: Request the listing with the 101-character search term.
- **Expected result**: The request is rejected with a client-error (4xx) response. The message returned to the visitor is clear and human-readable (for example, that the search is too long). No raw validation code, stack trace, or internal field name is exposed.
- **Priority**: Medium
- **Level**: API
- **Automation candidate**: yes

### TC-022 — No matches shows the empty state with a one-click clear (positive)
- **Type**: positive
- **Spec reference**: REQ-012
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Search for `zzzzzz` (no tour name or destination contains it).
- **Expected result**: The listing shows a plain message that no tours match, and a one-click action to clear the search and filters. The page is not blank and no error is shown.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-023 — Clearing from the empty state restores the full listing (positive)
- **Type**: positive
- **Spec reference**: REQ-012
- **Preconditions / test data**: Fixture F1; the no-match empty state from TC-022 is shown.
- **Action/input**: Activate the clear action in the empty state.
- **Expected result**: The search and filter values are cleared, and all published tours return (12 on page 1). The empty state disappears.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-024 — Search updates results without a full page reload (positive)
- **Type**: positive
- **Spec reference**: REQ-005
- **Preconditions / test data**: Fixture F1; the listing is open.
- **Action/input**: Type a search term and wait for the results to update.
- **Expected result**: The results change in place; the browser does not perform a full document navigation/reload. Only the results and the URL change.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-025 — A slow earlier search response never overwrites newer results (negative)
- **Type**: negative
- **Spec reference**: REQ-007
- **Preconditions / test data**: Fixture F1; network interception delays the first search request by about 3 seconds and lets the second complete quickly.
- **Action/input**: Search `bali`, then quickly change the term to `komodo` before the first response returns.
- **Expected result**: When the delayed `bali` response finally arrives, the listing still shows the `komodo` results. The older response does not replace them.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-026 — Results update as the visitor changes the term (positive)
- **Type**: positive
- **Spec reference**: REQ-007
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Type into the search box without pressing Enter and without submitting a form.
- **Expected result**: The listing updates to the new term as it is typed (a short debounce is acceptable). Typing `komodo` ends with only Komodo-matching tours shown.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-027 — Destination filter returns only that destination's tours (positive)
- **Type**: positive
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1; *Lombok* has 6 published tours.
- **Action/input**: Set the destination filter to *Lombok*.
- **Expected result**: Exactly the 6 Lombok tours are shown; no tour from another destination appears. The filter is reflected in the URL and in the control.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-028 — Category filter accepts every valid category value (positive)
- **Type**: positive
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1, with tours in all five categories.
- **Action/input**: For each value in turn — `Beach`, `Mountain`, `City`, `Culture`, `Adventure` — set the category filter.
- **Expected result**: For each value, every displayed tour belongs to that category and every published tour of that category is displayed. The control and URL show the selected category.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-029 — Price range filter returns tours within the range, endpoints inclusive (boundary)
- **Type**: boundary
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1; *Bali Island Escape* is priced 4,500,000 IDR, the cheapest tour is 450,000 IDR, the most expensive 12,000,000 IDR.
- **Action/input**: (a) set only a minimum of 3,000,000; (b) set only a maximum of 1,500,000; (c) set minimum 1,000,000 and maximum 5,000,000; (d) set minimum 4,500,000.
- **Expected result**: (a) only tours priced at least 3,000,000 are shown; (b) only tours priced at most 1,500,000; (c) only tours priced 1,000,000–5,000,000 inclusive; (d) *Bali Island Escape* (exactly 4,500,000) is included — the endpoints are inclusive.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-030 — A price minimum of zero is accepted (boundary)
- **Type**: boundary
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1; no tour has a negative price.
- **Action/input**: Set the price minimum to `0`.
- **Expected result**: The value is accepted with no validation error; no tour is excluded, because every price is non-negative.
- **Priority**: Low
- **Level**: UI
- **Automation candidate**: yes

### TC-031 — Duration range filter returns tours within the range, endpoints inclusive (boundary)
- **Type**: boundary
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1; *Bali Island Escape* lasts 5 days; durations span 1–14 days.
- **Action/input**: Set minimum `1`; then minimum `3` and maximum `5`; then minimum `5` and maximum `5`.
- **Expected result**: Minimum 1 excludes nothing (all durations are at least 1). The 3–5 range shows only tours lasting 3–5 days inclusive, including the 5-day *Bali Island Escape*. The 5–5 range shows only 5-day tours.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-032 — Combined filters return only tours satisfying every filter (positive)
- **Type**: positive
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1.
- **Action/input**: (a) Set destination *Yogyakarta*, category *Culture*, price 1,000,000–5,000,000, duration 1–3. (b) Additionally enter the keyword `heritage`.
- **Expected result**: (a) Only tours that are in Yogyakarta AND in the Culture category AND priced 1,000,000–5,000,000 AND lasting 1–3 days are shown — for example *Yogyakarta Heritage Walk* is included; a Culture tour in Bali is excluded. (b) Only tours satisfying all filters and the keyword remain.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-033 — Clearing all filters restores the full list (positive)
- **Type**: positive
- **Spec reference**: REQ-006
- **Preconditions / test data**: Fixture F1; destination, category, price and duration filters are applied, narrowing the list.
- **Action/input**: Activate the clear-all action.
- **Expected result**: All four filters are cleared in the controls and the URL, and all 30 published tours return (12 on page 1), in the default order.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-034 — A valid destination with no published tours shows the empty state with a link back (boundary)
- **Type**: boundary
- **Spec reference**: REQ-022
- **Preconditions / test data**: Fixture F4; *Flores* is a published destination with zero published tours.
- **Action/input**: Set the destination filter to *Flores*.
- **Expected result**: The listing shows the same plain empty state as a no-match search, with a link back to all tours. Following that link shows all published tours (12 on page 1). The destination remains selected rather than being silently dropped.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-035 — A price range with minimum greater than maximum is reported invalid (negative)
- **Type**: negative
- **Spec reference**: REQ-020
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Set price minimum `5,000,000` and maximum `1,000,000`.
- **Expected result**: A clear, human-readable message says the price range is invalid. The listing is not presented as "no tours match" and no error code or stack trace is shown.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-036 — A duration range with minimum greater than maximum is reported invalid (negative)
- **Type**: negative
- **Spec reference**: REQ-020
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Set duration minimum `7` and maximum `2`.
- **Expected result**: A clear, human-readable message says the duration range is invalid. The listing is not presented as "no tours match" and no raw error is shown.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-037 — Equal price minimum and maximum is valid and returns exact-price tours (boundary)
- **Type**: boundary
- **Spec reference**: REQ-020
- **Preconditions / test data**: Fixture F1; *Bali Island Escape* is priced 4,500,000 IDR.
- **Action/input**: Set price minimum `4,500,000` and maximum `4,500,000`.
- **Expected result**: No invalid-range message is shown. Only tours priced exactly 4,500,000 IDR are listed, including *Bali Island Escape*.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-038 — Equal duration minimum and maximum is valid and returns exact-duration tours (boundary)
- **Type**: boundary
- **Spec reference**: REQ-020
- **Preconditions / test data**: Fixture F1; *Bali Island Escape* lasts 5 days.
- **Action/input**: Set duration minimum `5` and maximum `5`.
- **Expected result**: No invalid-range message is shown. Only 5-day tours are listed, including *Bali Island Escape*.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-039 — A negative or fractional price bound is ignored and the price control falls back to unfiltered (negative)
- **Type**: negative
- **Spec reference**: REQ-021
- **Preconditions / test data**: Fixture F1; the URL is hand-edited.
- **Action/input**: Open the listing with (a) `price_min=-100` and (b) `price_min=1000.5`.
- **Expected result**: In both cases the invalid value is not applied: the price controls show no active price filter, the listing is unfiltered by price, and no error is shown.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-040 — A duration bound below 1 is ignored and the duration control falls back to unfiltered (boundary)
- **Type**: boundary
- **Spec reference**: REQ-021
- **Preconditions / test data**: Fixture F1; the URL is hand-edited.
- **Action/input**: Open the listing with (a) `duration_min=0` and (b) `duration_min=-3`.
- **Expected result**: The invalid value is not applied: the duration controls show no active duration filter, the listing is unfiltered by duration, and no error is shown.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-041 — An unknown category value is ignored and the listing falls back to unfiltered (negative)
- **Type**: negative
- **Spec reference**: REQ-021
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Open the listing with `category=Safari` (not one of the five allowed values).
- **Expected result**: The category filter is not applied: no category is shown as selected, the listing shows all published tours, and no error is shown.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-042 — An unknown destination value is ignored and the listing falls back to unfiltered (negative)
- **Type**: negative
- **Spec reference**: REQ-021
- **Preconditions / test data**: Fixture F1; *Atlantis* is not a published destination.
- **Action/input**: Open the listing with `destination=atlantis`.
- **Expected result**: The destination filter is not applied: no destination is shown as selected, the listing shows all 30 published tours, and no error is shown. This differs from a valid destination with no tours (TC-034).
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-043 — Multiple destination values violate the single-value rule and are ignored (negative)
- **Type**: negative
- **Spec reference**: REQ-021
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Open the listing with two destination parameters (`destination=Bali&destination=Lombok`).
- **Expected result**: The destination filter is not applied: the control shows no destination selected, the listing is unfiltered by destination, and no error is shown.
- **Priority**: Low
- **Level**: UI
- **Automation candidate**: yes

### TC-044 — An unknown sort value falls back to the default order (negative)
- **Type**: negative
- **Spec reference**: REQ-021
- **Preconditions / test data**: Fixture F1; record the result order with no sort parameter.
- **Action/input**: Open the listing with `sort=price` (not one of the four allowed values).
- **Expected result**: No error is shown. The displayed tours and their order are identical to the listing with no sort parameter (the default `recommended` view), and the sort control shows the default.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-045 — Every valid sort value orders the results correctly (positive)
- **Type**: positive
- **Spec reference**: Data Validation Rules — Sort (no REQ id; see Traceability notes)
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Apply each valid sort in turn: `recommended`, `price-asc`, `price-desc`, `duration-asc`.
- **Expected result**: `price-asc` lists tours by non-decreasing price per person; `price-desc` by non-increasing price per person; `duration-asc` by non-decreasing duration in days; `recommended` matches the default listing order exactly. Every sort persists in the URL (REQ-010).
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-046 — A page value below 1 or a non-integer page value falls back to page 1 (boundary — explicit assumption)
- **Type**: boundary
- **Spec reference**: Data Validation Rules — Page (no REQ id; see Traceability notes)
- **Preconditions / test data**: Fixture F1 (30 published tours, 3 pages); the page parameter is hand-edited.
- **Action/input**: Open the listing with (a) `page=0`, (b) `page=-3`, (c) `page=abc`, (d) `page=2.5`.
- **Expected result**: In every case the listing shows page 1 (the default results, first 12 tours), the invalid page value is ignored, and no error is shown — mirroring REQ-021's fallback for a hand-edited URL. No blank or partial listing appears.
- **Assumption**: spec.md defines page as a whole number of at least 1 and defines clamping only for a page past the last page (REQ-025); it does not yet state this below-minimum rule. This expected result is an explicit assumption confirmed by the requester on 2026-11-09, recorded pending a future spec.md amendment. This case is executable against the assumption.
- **Priority**: Low
- **Level**: UI
- **Automation candidate**: yes

### TC-047 — Search, filters, sort and page are written into the URL (positive)
- **Type**: positive
- **Spec reference**: REQ-010
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Enter a keyword, set a destination, a category, a price range, a duration range, a sort and go to page 2.
- **Expected result**: The address bar carries the search term, every filter, the sort and the page. Changing any one of them updates the URL without a full page reload.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-048 — A copied listing URL reopens the same view (positive)
- **Type**: positive
- **Spec reference**: REQ-010
- **Preconditions / test data**: Fixture F1; a URL produced by TC-047 that carries search, filters, sort and page 2.
- **Action/input**: Open that URL in a fresh browser context (no prior state).
- **Expected result**: The same tour results appear in the same order on the same page, and every control shows the value carried by the URL.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-049 — Browser back and forward restore prior listing states (positive)
- **Type**: positive
- **Spec reference**: REQ-010
- **Preconditions / test data**: Fixture F1; listing open at its default state.
- **Action/input**: Search `bali`, then replace the term with `lombok`, then set the destination filter to *Lombok*, then go to page 2. Use browser Back twice, then Forward twice.
- **Expected result**: Each Back restores the immediately previous search, filters, sort and page together with its results; each Forward restores the next state. No state is lost or mixed between views.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-050 — Selecting a tour from the listing opens its detail page (positive)
- **Type**: positive
- **Spec reference**: REQ-008
- **Preconditions / test data**: Fixture F1.
- **Action/input**: On the tour listing, select the *Komodo Sailing Adventure* card.
- **Expected result**: The detail page for *Komodo Sailing Adventure* opens and shows that tour's information.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-051 — The detail page shows every required tour field (positive)
- **Type**: positive
- **Spec reference**: REQ-009
- **Preconditions / test data**: Fixture F7 (*Bali Island Escape* fully populated).
- **Action/input**: Open the tour's detail page.
- **Expected result**: The page shows the tour name, destination, duration, price per person, description, highlights, what is included, at least one image, and the departure dates. No required field is missing or empty.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-052 — The detail page shows the price per person in IDR (positive)
- **Type**: positive
- **Spec reference**: REQ-009
- **Preconditions / test data**: Fixture F7; price 4,500,000 IDR.
- **Action/input**: Open the tour's detail page.
- **Expected result**: The price is displayed with an IDR currency indicator (for example "Rp") and is identified as the price per person. It is not shown as a bare number without a currency, and no other currency is used.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-053 — A tour that does not exist shows the not-found page and HTTP 404 (negative)
- **Type**: negative
- **Spec reference**: REQ-023
- **Preconditions / test data**: Fixture F1; slug `does-not-exist` is not a tour.
- **Action/input**: Request the detail page for `/tours/does-not-exist`.
- **Expected result**: The page shows a clear "tour not found" state with a link back to the tour listing; following it opens the listing. The page responds with HTTP 404. No stack trace or internal detail is shown.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-054 — An unpublished tour shows the not-found page and HTTP 404 (negative)
- **Type**: negative
- **Spec reference**: REQ-023
- **Preconditions / test data**: Fixture F8 (slug `hidden-draft-tour` is unpublished).
- **Action/input**: Request the detail page for `/tours/hidden-draft-tour`.
- **Expected result**: The page shows the same "tour not found" state with a link back to the listing, and responds with HTTP 404. No tour content is disclosed.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-055 — A tour unpublished while being viewed shows the not-found state on the next load (negative)
- **Type**: negative
- **Spec reference**: REQ-024
- **Preconditions / test data**: Fixture F7; *Bali Island Escape* is open on its detail page. The tour is then marked unpublished in the data.
- **Action/input**: Trigger the next data load (reload the detail page).
- **Expected result**: The page shows the "tour not found" state instead of the previously loaded tour content. No stale tour information remains visible.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-056 — The enquiry action opens email or WhatsApp with the tour name, with no form and no payment (positive)
- **Type**: positive
- **Spec reference**: REQ-028
- **Preconditions / test data**: Fixture F7 (*Bali Island Escape*).
- **Action/input**: On the tour detail page, activate the "Enquire about this tour" action.
- **Expected result**: The visitor's email app or WhatsApp opens with the tour name included in the pre-filled subject/body (encoded correctly). The action submits no form, shows no booking or checkout step, and requests no payment. The tour name appears in the pre-filled text, not just in a generic message.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes (assert the action's `mailto:` / WhatsApp link and that no form submission or payment step occurs)

### TC-057 — The detail page shows a loading state while data loads (positive)
- **Type**: positive
- **Spec reference**: REQ-011
- **Preconditions / test data**: Fixture F7; throttle the detail data request so it takes at least 2 seconds.
- **Action/input**: Open the tour detail page.
- **Expected result**: While loading, the page shows a skeleton or spinner rather than a blank page or an error. The tour content replaces it when the data arrives.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-058 — Detail load failure shows a plain message and a working retry (negative)
- **Type**: negative
- **Spec reference**: REQ-013
- **Preconditions / test data**: Fixture F7; make the detail data request fail.
- **Action/input**: Open the tour detail page.
- **Expected result**: A plain message says the tour could not be loaded and offers a retry. No stack trace, raw error, status code, or internal code is shown. After the fault is removed, retry loads the tour.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-059 — The listing shows a loading state while data loads (positive)
- **Type**: positive
- **Spec reference**: REQ-011
- **Preconditions / test data**: Fixture F1; throttle the listing data request so it takes at least 2 seconds.
- **Action/input**: Open the tour listing.
- **Expected result**: While loading, the results area shows a skeleton or spinner rather than a blank page. Results replace it when the data arrives. Repeated for a search change: the results area shows the loading state while the new results load.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-060 — Listing load failure shows a plain message and a working retry (negative)
- **Type**: negative
- **Spec reference**: REQ-013
- **Preconditions / test data**: Fixture F1; make the listing data request fail while the listing is open.
- **Action/input**: Change the search term or filters so a new data load is required.
- **Expected result**: The affected results area shows a plain message and a retry action. No raw error, stack trace, internal code, or enum value is shown. After the fault is removed, retry shows the requested results.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-061 — Every browsing action works anonymously with no login (positive)
- **Type**: positive
- **Spec reference**: REQ-014
- **Preconditions / test data**: A fresh browser context with no cookies, no session, and no account.
- **Action/input**: Open the homepage, open the listing, search, apply filters, open a tour detail page, and reach the enquiry action.
- **Expected result**: Every action completes with no login prompt, no redirect to a login page, and no "unauthorized" or "forbidden" response. The enquiry action is available.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-062 — No horizontal scrolling at 360px and 1440px (boundary)
- **Type**: boundary
- **Spec reference**: REQ-015
- **Preconditions / test data**: Fixture F1; viewport widths 360px and 1440px; test data includes a long tour name and the empty and populated listing states.
- **Action/input**: At each width, open the homepage, the tour listing (populated and empty states), and a tour detail page, and measure whether the document is wider than the viewport.
- **Expected result**: At both widths, none of the three screens scrolls horizontally: the document width does not exceed the viewport width, and no content is clipped or pushed off-screen.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-063 — Interactive targets are at least 44px at 360px (boundary)
- **Type**: boundary
- **Spec reference**: REQ-015
- **Preconditions / test data**: Fixture F1; 360px viewport.
- **Action/input**: Measure the rendered size of the main interactive targets on the homepage, listing and detail page: search input, filter controls, sort control, pagination controls, tour-card action areas, and the enquiry action.
- **Expected result**: Every measured target has both width and height of at least 44 CSS pixels (targets may be larger). No main control is smaller than 44px in either dimension.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-064 — The site is fully keyboard operable (positive)
- **Type**: positive
- **Spec reference**: REQ-016
- **Preconditions / test data**: Fixture F1; keyboard only, no pointer.
- **Action/input**: From the homepage, Tab to the search box, type a term, Tab through the filter controls and change one, Tab to a tour card and open it with Enter, then reach the enquiry action.
- **Expected result**: Every step is reachable and operable by keyboard alone, in a logical order, with no keyboard trap. The search and filters can be changed and the tour can be opened without a mouse.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-065 — Every input has an accessible label (positive)
- **Type**: positive
- **Spec reference**: REQ-016
- **Preconditions / test data**: Fixture F1; the listing and detail pages are open.
- **Action/input**: Inspect the accessible name of the search box, destination filter, category filter, price minimum, price maximum, duration minimum, duration maximum, and sort control.
- **Expected result**: Each input has a non-empty accessible name that describes its purpose; no input relies on placeholder text alone or is unlabeled.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-066 — Keyboard focus is visibly indicated (positive)
- **Type**: positive
- **Spec reference**: REQ-016
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Tab through the interactive elements on the homepage, listing and detail page.
- **Expected result**: At every stop the focused element has a visible focus indicator (outline, ring, or equivalent) that is distinguishable from the unfocused state.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-067 — Pages use semantic structure (positive)
- **Type**: positive
- **Spec reference**: REQ-016
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Inspect the homepage, listing and detail page structure.
- **Expected result**: Each page has a main landmark, the site header/navigation is a landmark, each page has one main heading, headings follow a sensible hierarchy, and lists of tours are marked up as lists.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-068 — Images that carry meaning have alt text (positive)
- **Type**: positive
- **Spec reference**: REQ-016
- **Preconditions / test data**: Fixture F1; tour and destination images are present.
- **Action/input**: Inspect the images on the homepage, listing and detail page.
- **Expected result**: Every image that conveys meaning (tour photos, destination photos) has non-empty alternative text that names the tour or destination. No meaningful image is left with an empty or missing alt attribute.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-069 — Text and controls meet WCAG AA colour contrast (positive)
- **Type**: positive
- **Spec reference**: REQ-016
- **Preconditions / test data**: Fixture F1; the design palette (text #111111, muted text #6b7280, primary #2c7ba8, background #ffffff, surface #f2f4f6).
- **Action/input**: Run a contrast check over the homepage, listing and detail page.
- **Expected result**: Normal text meets at least 4.5:1 contrast, and large text and interactive control boundaries meet at least 3:1. No text is rendered in a combination that fails AA.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes

### TC-070 — The web app manifest is valid and complete (positive)
- **Type**: positive
- **Spec reference**: REQ-017
- **Preconditions / test data**: The production-like build; the manifest is linked from the document.
- **Action/input**: Fetch and parse the web app manifest.
- **Expected result**: It declares `name`, `short_name`, icons at 192×192 and 512×512, a `start_url`, `display: "standalone"`, and a `theme_color`. The icon URLs resolve to real images. The manifest parses without errors.
- **Priority**: High
- **Level**: API
- **Automation candidate**: yes

### TC-071 — The document declares a mobile viewport (positive)
- **Type**: positive
- **Spec reference**: REQ-017
- **Preconditions / test data**: Fixture F1.
- **Action/input**: Inspect the document head of the homepage.
- **Expected result**: A viewport meta tag is present with `width=device-width` (and an initial scale), so the layout uses the device width.
- **Priority**: Medium
- **Level**: UI
- **Automation candidate**: yes

### TC-072 — Offline, the PWA serves the app shell and an offline page (positive)
- **Type**: positive
- **Spec reference**: REQ-026
- **Preconditions / test data**: Fixture F1; the site has been loaded once so the service worker is installed and the app shell is cached.
- **Action/input**: Put the browser into offline mode and navigate to a page that is not cached, then reopen the app.
- **Expected result**: The service worker serves the cached app shell and an in-app offline page with a plain message. The browser's own network-error page is not shown, and the offline page is reachable and readable.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: yes

### TC-073 — Production is served over HTTPS (positive)
- **Type**: positive
- **Spec reference**: REQ-017
- **Preconditions / test data**: The production deployment URL.
- **Action/input**: Request the site over `http://` and over `https://`.
- **Expected result**: The production site is served over HTTPS with a valid certificate; an `http://` request is redirected to HTTPS. No mixed-content warnings occur on the homepage, listing or detail page.
- **Priority**: High
- **Level**: End-to-end
- **Automation candidate**: no (deployment-environment check; run manually or as a deployment smoke check)

### TC-074 — The homepage matches the approved design composition at 1440×900 (positive)
- **Type**: positive
- **Spec reference**: Requester design brief (`vacasky-home.png`, 1440×900) — no REQ id in spec.md v1; see Traceability notes
- **Preconditions / test data**: Fixture F1; viewport exactly 1440×900.
- **Action/input**: Render the homepage at 1440×900 and compare it side by side with `vacasky-home.png` at the same size.
- **Expected result**: The page reproduces the design's structure and visual hierarchy: header, hero/search area, featured tours section, featured destinations section, and footer in the same arrangement. No material difference in layout, spacing, or component styling.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: no (human visual comparison; a screenshot diff can assist but the approval is visual)

### TC-075 — The homepage uses the approved palette and fonts (positive)
- **Type**: positive
- **Spec reference**: Requester design brief (`vacasky-home.png`) — no REQ id in spec.md v1; see Traceability notes
- **Preconditions / test data**: Fixture F1; the homepage is rendered.
- **Action/input**: Inspect computed styles on representative elements: primary actions/links, page background, body text, muted text, and headings.
- **Expected result**: Primary actions/links resolve to #2c7ba8 (with #1f5f85 available for the darker variant), the page background is #ffffff, body text is #111111, muted text is #6b7280, surface areas use #f2f4f6 where the design shows them, and any dark card uses #111214. Display headings use the Anton font and body copy uses Inter.
- **Priority**: High
- **Level**: UI
- **Automation candidate**: yes (computed-style assertions on representative elements)

## Open questions for /document-preparation

None at this time.

**Q1 — page parameter below the valid minimum, or non-integer (resolved as
an assumption).** `spec.md` (Data Validation Rules — Page) says page is a
*whole number of at least 1*, and REQ-025 defines clamping only for a page
number *past the last page*. The requester answered on 2026-11-09: any page
value below 1 or not a whole number falls back to page 1, mirroring
REQ-021's graceful fallback for a hand-edited URL, with no error shown.
Because this is a sample project run to verify the workflow and no spec
amendment is being raised now, the rule is recorded as an **explicit
assumption** in TC-046 and in the Traceability notes below, pending a future
`spec.md` amendment. `open_questions` is therefore empty and TC-046 is
executable against the stated assumption.

## Traceability notes

- **Sort (valid values).** The four allowed sort values and the default
  `recommended` are defined in Data Validation Rules, but no `REQ-*` assigns
  the sort behaviour itself (REQ-021 covers only *invalid* sort values;
  REQ-010 covers keeping sort in the URL). TC-045 cites the rule directly.
  `/document-preparation` may want to assign a requirement ID in a future
  spec revision; this does not block behaviour testing.
- **Page (valid values).** The page rule is likewise defined in Data
  Validation Rules without its own `REQ-*`; REQ-025 covers only the
  past-the-last-page case. **Assumption pending a spec amendment:** a page
  value below 1 or not a whole number falls back to page 1, mirroring
  REQ-021's fallback for a hand-edited URL. Confirmed by the requester on
  2026-11-09; exercised by TC-046. Recorded here rather than as a
  requirement because `spec.md` v1 does not yet state it.
- **Tour content (authoring).** The rules for tour name length, destination,
  category, duration, price, images, description and departure dates govern
  content authored *outside* the public site. This feature has no admin UI,
  so those authoring rules are not exercised by public-site tests; the
  public site's display of valid content is covered by TC-051/TC-052.
- **Tour identifier slug.** The `[a-z0-9-]` slug format is exercised
  negatively through REQ-023 (a slug that matches no tour shows the
  not-found page, TC-053).
- **Visual design tokens.** The palette and fonts come from the requester's
  design brief (`vacasky-home.png`, 1440×900). `spec.md` v1 has no `REQ-*`
  for visual fidelity, so TC-074 and TC-075 trace to the brief rather than a
  requirement ID. This is noted rather than invented as a requirement.
