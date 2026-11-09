---
feature_code: FEAT-001
service: vacasky-svc
ticket_url: null
has_ui: true
version: 1
status: complete
completeness:
  problem: covered
  target_user: covered
  success_criteria: covered
  non_goals: covered
  primary_flow: covered
  edge_cases: covered
  dependencies: covered
  priority: covered
  data_validation_rules: covered
  external_integrations: covered
open_questions: []
sources: []
pr_history: []
pr_url: https://github.com/william22913/sandbox-docs/pull/28
last_updated: 2026-11-09
---

# FEAT-001 — Tour & Travel Agency Website (vacasky-svc)

## Problem

Prospective travelers cannot discover vacasky's tours today: the agency has
no public website. With no browsable catalog, visitors cannot see what is
available, compare tours, or find one for the destination they want to
visit, and the agency has no self-service way to present its offering.

## Target User

Anonymous prospective travelers visiting vacasky from a phone or a desktop,
typically while planning a trip. There is no account or login, and the
visitor is not assumed to know the agency or its catalog in advance.

## Primary Flow

- **REQ-001**: A visitor opens the homepage and sees the agency's featured
  tours and featured destinations, plus a way to start searching the full
  tour catalog. Up to six featured tours and up to six featured
  destinations are shown, in the order the agency chooses (the featured flag
  and ordering are set in the tour/destination data). (source: requester,
  this session)
- **REQ-002**: Selecting a featured tour opens that tour's detail page.
- **REQ-003**: Selecting a featured destination opens the tour listing
  already filtered to that destination.
- **REQ-004**: The tour listing shows every published tour by default,
  paginated at 12 tours per page. (source: requester, this session)
- **REQ-005**: The visitor can type a keyword into a search box; the listing
  narrows to tours whose name or destination matches the term,
  case-insensitively, without a full page reload. (source: requester, this
  session)
- **REQ-006**: The visitor can narrow the listing with filters —
  destination, category, price range, and duration range — combine several
  filters, and clear them all. (source: requester, this session)
- **REQ-007**: Search and filter results update as the visitor changes
  them. A slow earlier request must never overwrite the results of a newer
  one.
- **REQ-008**: Selecting a tour from the listing opens that tour's detail
  page.
- **REQ-009**: The tour detail page shows the tour's name, destination,
  duration, price per person in IDR, description, highlights, what is
  included, images, and departure dates. (source: requester, this session)
- **REQ-010**: Search, filters, sort, and page are kept in the URL, so a
  copied link reopens the same listing view and browser back/forward works.
  (source: requester, this session)
- **REQ-011**: While tour data is loading, the affected section shows a
  skeleton or spinner rather than a blank page.
- **REQ-012**: When a search or filter matches no tours, the listing says
  so plainly and offers a one-click way to clear the search and filters.
- **REQ-013**: When tour data cannot be loaded, the affected section shows
  a plain message and a retry action. Raw errors, stack traces, and
  internal codes are never shown.
- **REQ-014**: The site is public: no login is required for any browsing
  action.
- **REQ-015**: The site works from a 360px phone up to a wide desktop with
  no horizontal scrolling, and every interactive target is at least 44px.
- **REQ-016**: Accessibility basics hold everywhere: semantic elements, a
  label on every input, visible focus, keyboard operability, sufficient
  colour contrast, and alt text on images that carry meaning.
- **REQ-017**: Phone use is delivered as a PWA from the same web app: a
  valid web app manifest (name, short name, 192px and 512px icons, start
  URL, `display: standalone`, theme colour), a service worker that caches
  the app shell and serves an offline page, HTTPS in production, and a
  viewport meta tag.
- **REQ-028**: The tour detail page has an "Enquire about this tour" action
  that opens the visitor's email app or WhatsApp with the tour name filled
  in. It does not submit a form and does not take a payment. (source:
  requester, this session — confirmed as the phase-1 conversion path)

## Non-Goals

- No online booking, payment, checkout, or reservation hold.
- No contact form or enquiry form submission in this pass; the enquiry
  action is a pre-filled email/WhatsApp link only (REQ-028).
- No user accounts, login, saved trips, or wishlists.
- No reviews or ratings.
- No multi-language or multi-currency; the interface is English and prices
  are in IDR only. (source: requester, this session)
- No admin content-management UI in this feature; tour and destination
  content is authored outside the public site.
- No date-based availability search or filtering in this pass. Departure
  dates are displayed on the detail page only.
- No blog, news, or generic CMS pages beyond the three browsing screens.

## Edge Cases

- **REQ-018**: A search term that is empty or only spaces is treated as no
  keyword; the listing shows all tours.
- **REQ-019**: Search terms are trimmed and compared case-insensitively. A
  term longer than 100 characters is prevented by the input and rejected by
  the server with a clear, human-readable message, not a raw validation
  code.
- **REQ-020**: If a price range's minimum is greater than its maximum, or a
  duration range's minimum is greater than its maximum, the visitor is told
  the range is invalid instead of being shown an empty result.
- **REQ-021**: A filter or sort value that is not in the allowed list (for
  example a hand-edited URL) is ignored and the listing falls back to the
  unfiltered/default view for that control, rather than erroring.
- **REQ-022**: A destination with no published tours shows the same empty
  state as a search with no matches, with a link back to all tours.
- **REQ-023**: A tour that does not exist, or is no longer published, shows
  a "tour not found" page with a link back to the listing, and the page
  responds with HTTP 404.
- **REQ-024**: If a tour is unpublished while a visitor is viewing its
  detail page, the next data load shows the not-found state rather than
  stale content.
- **REQ-025**: A page number past the last page is clamped to the last
  page instead of showing a blank listing.
- **REQ-026**: When the device is offline, the PWA serves the app shell and
  an offline page instead of the browser's own network error.
- **REQ-027**: A no-permission state does not apply: the site has no
  restricted content and no login.

## Dependencies

- Tour, destination, and category data owned and served by vacasky-svc
  itself; the public web app calls the same service. No external booking or
  data provider is involved. (source: requester, this session)
- Images for tours and destinations.
- There is no code repository yet: this feature covers the public web app
  and the API/data that serves it. The implementation split between
  frontend and backend is `/code-preparation`'s decision, not fixed here.
- A hosting setup that serves the site over HTTPS in production (also a
  PWA requirement, REQ-017).
- No dependency on another feature: FEAT-001 is the first feature of a new
  service.

## Priority

This pass covers:

- The homepage with featured tours and featured destinations
  (REQ-001..003).
- The tour listing with keyword search, filters, sort, pagination, and
  shareable URL state (REQ-004..008, REQ-010).
- The tour detail page and its enquiry action (REQ-008, REQ-009, REQ-028).
- Loading, empty, and error states, the not-found page, and invalid-input
  handling (REQ-011..013, REQ-018..025).
- Responsive layout, accessibility basics, and the PWA shell
  (REQ-015..017, REQ-026).

Explicitly deferred to a later pass (confirmed by the requester, this
session):

- Booking, payment, and accounts.
- Contact/enquiry forms with submission.
- Reviews and ratings.
- Multi-language and multi-currency.
- Admin content management.
- Date-based availability search and filtering.

## Success Criteria

- A first-time visitor can reach a tour's detail page from the homepage
  (REQ-001, REQ-002).
- A keyword search returns only tours whose name or destination contains
  the term (REQ-005).
- Applying a destination, category, price, or duration filter returns only
  tours that satisfy every applied filter, and clearing the filters
  restores the full list (REQ-006).
- A listing link carrying search, filter, sort, and page reopens the same
  results (REQ-010).
- A search or filter with no matches shows the empty state with a way to
  clear it, not a blank page (REQ-012).
- When tour data fails to load, the visitor sees a plain message and a
  retry that works (REQ-013).
- From a tour's detail page, the visitor can start an email/WhatsApp
  enquiry carrying the tour name (REQ-028).
- The homepage, listing, and detail page render without horizontal
  scrolling at 360px and at 1440px, and are keyboard operable (REQ-015,
  REQ-016).
- Business metric: none, because the brief and the requester set no
  post-launch metric beyond these acceptance criteria; phase 1 has no
  booking, so there is no conversion metric to measure yet. (source:
  requester, this session)

## Data Validation Rules

These are business rules, not the implementation's validator/regex/DB
constraints. All confirmed by the requester in this session.

- **Search term**: optional; trimmed; 0–100 characters; case-insensitive
  substring match against tour name and destination name (REQ-019).
- **Destination filter**: optional; must be one of the published
  destination values; single value (REQ-006).
- **Category filter**: optional; one of `Beach`, `Mountain`, `City`,
  `Culture`, `Adventure`; single value (REQ-006).
- **Price filter**: optional minimum and maximum, non-negative whole
  numbers of Indonesian rupiah (IDR); minimum must not exceed maximum
  (REQ-020).
- **Duration filter**: optional minimum and maximum, whole days of at
  least 1; minimum must not exceed maximum (REQ-020).
- **Sort**: one of `recommended` (default), `price-asc`, `price-desc`,
  `duration-asc`; any other value falls back to `recommended` (REQ-021).
- **Page**: whole number of at least 1; page size fixed at 12 (a tunable
  default, not a business rule).
- **Tour identifier in the detail URL**: a slug using only `[a-z0-9-]`,
  unique per tour.
- **Tour content (authored outside the public site)**: name required,
  1–120 characters; destination required; category required, one of the
  five category values above; duration of at least 1 day; price of at least
  0 IDR; at least one image; a published tour has a description and at
  least one departure date. A tour is either published or unpublished;
  unpublished tours never appear in listings or featured sections.

## External Integrations

None, because vacasky-svc owns and serves its own tour, destination, and
category catalog, and the public web app calls the same service. No
third-party booking, payment, map, or analytics API is in scope for this
pass. (source: requester, this session — confirmed no external provider)

## Feedback responses

None yet.
