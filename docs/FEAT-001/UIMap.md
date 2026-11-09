---
feature_code: FEAT-001
service: vacasky-svc
version: 1
status: complete
spec_version: 1
figma_files:
  - url: "attached design: vacasky-home.png (1440x900); no Figma URL supplied"
    file_key: "screenshot-vacasky-home"
    last_modified: "2026-11-09"
completeness:
  scope_confirmed: covered
  requirement_mapping: covered
  page_inventory: covered
  navigation: covered
  content_and_fields: covered
  states: covered
  interactions: covered
  motion: covered
  responsive: covered
  design_tokens: covered
  components: covered
  assets: covered
open_questions: []
derived_confirmed: 2026-11-09
pr_history: []
pr_url: https://github.com/william22913/sandbox-docs/pull/30
last_updated: 2026-11-09
---

# UI Map — FEAT-001

A public tour and travel browsing site: a Home page of featured tours and
destinations, a searchable and filterable tour listing, and a tour detail
page with an enquiry action, plus not-found and offline pages. Requirements
live in `spec.md` v1; this document records the screens those requirements
imply and the design decisions a frontend developer needs beside the
attached Home design.

## Figma sources

The requester supplied **one attached screenshot, `vacasky-home.png` at
1440×900**, not a Figma file. There is no file key, node id or frame URL,
and the rendered image itself is not available in this session: the design
facts used below are the extraction in the requester's brief (colours,
fonts, the Home screen, its loading/empty/error states, and "50
components"). The GUI preflight reported a Figma token, but no Figma link
was supplied, so the token is not used anywhere in this document.

The designer's instruction is that **the whole UI follows this design**, so
Home is the drawn screen and the pattern for every other screen. The
screens Home does not draw are written below as screen specs adapted from
it, never as invented frames.

| Design source | URL | Version / last modified | Role | Pages / screens used |
|---|---|---|---|---|
| `vacasky-home.png` | none supplied (attached screenshot, 1440×900) | extracted 2026-11-09 | Final design for **Home**; the pattern every other page follows | Home (`/`) |

Provenance words used in every table below:

- `figma` — read directly from the attached design's extraction (tokens,
  the Home screen, its three states).
- `designer` — stated in the requester's brief or confirmed by the
  designer in this session.
- `derived` — adapted from the Home design to a screen or state it does
  not draw, because the designer said the UI follows Home.
- `assumed` — a default proposed in this document with no design or
  instruction behind it, drawn from the design references cited in
  `## Design tokens`. The draft used this tag; the designer confirmed every
  such default on 2026-11-09, so no `assumed` row remains.

## Requirement mapping

Every active `REQ-*` in `spec.md` v1 is accounted for. `Frame link` is used
only where a frame really shows the requirement; Home is the only drawn
screen, so every other row points at the Home design as its **pattern** in
`Follows`.

| REQ | Requirement | Page | Frame name | Frame link | Follows | Source | Notes |
|---|---|---|---|---|---|---|---|
| REQ-001 | Home shows up to six featured tours and six featured destinations, in the agency's order, plus a way to search the catalog | Home | `Home` (attached screenshot) | `vacasky-home.png` (no URL) | - | figma | The screen is drawn; its section arrangement was completed in this map and confirmed by the designer on 2026-11-09 |
| REQ-002 | Selecting a featured tour opens its detail page | Home, Tour detail | `Home` (featured tour card) | `vacasky-home.png` (no URL) | Home | figma, derived | Card link target is the detail screen, which Home does not draw |
| REQ-003 | Selecting a featured destination opens the listing filtered to it | Home, Tour listing | `Home` (destination card) | `vacasky-home.png` (no URL) | Home | figma, derived | Listing screen derived from Home |
| REQ-004 | Listing shows every published tour, 12 per page | Tour listing | not drawn yet | - | Home | derived | Page size is a tunable default: 12 |
| REQ-005 | Keyword search narrows by tour name or destination, case-insensitively, without a full reload | Tour listing, Home | not drawn yet (listing); Home search entry | - | Home | designer, derived | Brief asks for search; the search field on Home is the entry point |
| REQ-006 | Destination, category, price range and duration range filters, combinable and clearable | Tour listing | not drawn yet | - | Home | designer, derived | Filter bar in the listing; drawer on phones |
| REQ-007 | Results update as the visitor edits; a slow earlier response never overwrites a newer one | Tour listing | not drawn yet | - | Home | designer, derived | Request sequencing / abort; no visual state of its own |
| REQ-008 | Selecting a tour from the listing opens its detail page | Tour listing, Tour detail | not drawn yet | - | Home | designer, derived | |
| REQ-009 | Detail shows name, destination, duration, price per person in IDR, description, highlights, inclusions, images, departure dates | Tour detail | not drawn yet | - | Home | designer, derived | |
| REQ-010 | Search, filters, sort and page live in the URL; back/forward works | Tour listing | not drawn yet | - | Home | derived | Query keys defined in the Tour listing page section |
| REQ-011 | Loading shows a skeleton or spinner, not a blank page | Home, Tour listing, Tour detail | `Home` (loading state reported) | `vacasky-home.png` (no URL) | Home | figma, derived | Home's loading state is reported by the design extraction; the other screens' skeletons are derived |
| REQ-012 | No matches shows a plain empty state with a one-click clear | Tour listing | not drawn yet | - | Home | derived | |
| REQ-013 | Load failure shows a plain message and a working retry; never raw errors | Home, Tour listing, Tour detail | `Home` (error state reported) | `vacasky-home.png` (no URL) | Home | figma, derived | Home's error state is reported; the section-level treatment was confirmed by the designer on 2026-11-09 |
| REQ-014 | The site is public; no login for any browsing action | All | - | - | - | designer | No UI: the absence of login is the requirement. See "Requirements without UI" |
| REQ-015 | 360px phone to wide desktop, no horizontal scroll, every target at least 44px | All | `Home` (1440px drawn) | `vacasky-home.png` (no URL) | Home | figma, derived | Only 1440 is drawn; the smaller layouts are derived |
| REQ-016 | Semantic elements, labels, visible focus, keyboard operability, contrast, meaningful alt text | All | - | - | - | designer, derived | Build rules per page below |
| REQ-017 | Installable PWA from the same web app: manifest, icons, service worker, offline page, HTTPS, viewport | All, Offline | - | - | - | designer, derived | Offline screen derived; manifest values recorded |
| REQ-018 | Empty or whitespace-only search means no keyword | Tour listing | not drawn yet | - | Home | derived | Input handling; no separate visual |
| REQ-019 | Search is trimmed, case-insensitive, 0-100 characters, with a human-readable message when too long | Tour listing | not drawn yet | - | Home | derived | Input prevents over-length; the message is the fallback |
| REQ-020 | Invalid price or duration ranges are explained, not shown as an empty result | Tour listing | not drawn yet | - | Home | derived | Inline range error |
| REQ-021 | Unknown filter or sort values in the URL fall back to the unfiltered/default view | Tour listing | not drawn yet | - | Home | derived | No error state for a hand-edited URL |
| REQ-022 | A destination with no published tours shows the same empty state, with a link back to all tours | Tour listing | not drawn yet | - | Home | derived | |
| REQ-023 | Missing or unpublished tour shows a "tour not found" page with a link back, HTTP 404 | Tour not found | not drawn yet | - | Home | derived | |
| REQ-024 | If a tour is unpublished while being viewed, the next load shows the not-found state | Tour detail, Tour not found | not drawn yet | - | Home | derived | |
| REQ-025 | A page number past the last page clamps to the last page | Tour listing | not drawn yet | - | Home | derived | |
| REQ-026 | Offline serves the app shell and an offline page, not the browser error | Offline | not drawn yet | - | Home | derived | |
| REQ-027 | No-permission state does not apply: no restricted content and no login | All | - | - | - | designer | No UI by definition. See "Requirements without UI" |
| REQ-028 | "Enquire about this tour" opens email or WhatsApp with the tour name filled in; no form, no payment | Tour detail | not drawn yet | - | Home | designer, derived | Resolved 2026-11-09: WhatsApp primary (`wa.me`) with a `mailto:` fallback; placeholder number and address until launch |

### Requirements without UI

| REQ | Reason |
|---|---|
| REQ-014 | Public access is the absence of a gate. No login screen, account menu, or permission-dependent content exists; every screen is reachable anonymously. |
| REQ-027 | By `spec.md` there is no restricted content, so a no-permission state has nothing to show. The frontend must not invent one. |

### Frames without a requirement

| Frame | What it is | Decision |
|---|---|---|
| None | The attached Home screen is fully accounted for: its header, search entry, featured tours and featured destinations serve REQ-001/002/003/005; its loading, empty and error states serve REQ-011/013. | No unclaimed frame |

## Pages

### Home

**Purpose:** the first impression and the discovery hub: featured tours,
featured destinations, and the entry point into the full listing and its
search (`REQ-001`).

**Roles:** any anonymous visitor (`REQ-014`). No variation by role.

**Entry / exit:**
- Entry: `/`, the site's start URL in the manifest (`REQ-017`).
- Exit: featured tour card → `/tours/:slug` (`REQ-002`); featured
  destination card → `/tours?destination=<slug>` (`REQ-003`); hero search
  → `/tours?q=<term>` (`REQ-005`); header "Tours" → `/tours`; footer links.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Hero search | text input + submit button | no | 0-100 characters, trimmed; empty or whitespace-only means no keyword; submits to the listing rather than filtering in place (`REQ-005`, `REQ-018`, `REQ-019`) | designer, derived |
| Featured tour card | link card, up to 6 | - | Agency's featured order; each card shows image, category tag, tour name, destination, duration, price per person (IDR) and opens the detail page (`REQ-001`, `REQ-002`) | designer, derived |
| Featured destination card | link card, up to 6 | - | Agency's featured order; each card shows the destination image and name and opens the listing filtered to that destination (`REQ-001`, `REQ-003`) | designer, derived |
| Header navigation | links | - | Home, Tours, Destinations; no login or account entry (`REQ-014`) | designer |
| Footer | links + contact | - | Wordmark, primary navigation, the REQ-028 enquiry channel, copyright. No social links until supplied | designer |

**Actions**

- Submit the hero search: navigates to `/tours?q=<trimmed term>`; an empty
  term goes to `/tours` with no query parameter (`REQ-005`, `REQ-018`).
- Featured tour card: opens `/tours/:slug` (`REQ-002`).
- Featured destination card: opens `/tours?destination=<slug>`
  (`REQ-003`).
- Header "Tours": opens the unfiltered listing. Header "Destinations"
  moves to the featured destinations section on this page (there is no
  separate destinations page in `spec.md`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default (populated) | Hero with search, "Featured tours" with up to six cards, "Featured destinations" with up to six cards, footer | figma |
| Loading | The hero is static (it does not depend on data). Each featured section shows six skeleton cards at the final card size, 4:3 image block plus two text lines; no spinner, no layout shift (`REQ-011`) | derived |
| Empty | Section-level: if no tours are published, "Featured tours" shows "New tours are on the way." with a "Browse all tours" link; if no destinations are featured, "Featured destinations" shows "Destinations are being added." with the same link. The other section still renders. The design reports an empty state exists for Home; its copy is proposed here (`REQ-001`) | figma, derived |
| Error | Section-level, not page-level: the failed section is replaced by one sentence plus a "Retry" button; the other section and the hero stay. Copy: "We couldn't load the featured tours." / "We couldn't load the featured destinations." (`REQ-013`) | figma, derived |
| Partial failure | One featured section can fail while the other succeeds; each retries independently | derived |
| No permission | Not applicable (`REQ-027`) | designer |

**Responsive**

- 1440px (the drawn size): 1280px content container, 3-column cards,
  two rows of three for each featured section; hero is a split layout with
  copy on the left and the lead image on the right.
- 1024-1279px: same 3-column grid, narrower gutters.
- 768-1023px: 2-column cards; hero stacks copy above the image; header
  collapses to wordmark, menu button and one primary action.
- 360-767px: 1-column cards; search fills the row; every control at least
  44px; no horizontal scroll; images use `aspect-ratio` so they do not
  jump (`REQ-015`).

**Frames used:** the attached `Home` design only.

**Section spec** (the design is the pattern; its section arrangement below
is proposed and must be confirmed)

| Region | Contents | Detail | Source | REQ |
|---|---|---|---|---|
| Skip link | "Skip to content" | First focusable element; visible only on focus; targets the main landmark | derived | REQ-016 |
| Header | Wordmark "vacasky" in Anton, nav (Home, Tours, Destinations), primary "Browse tours" | 72px tall maximum, one line on desktop; mobile: wordmark + menu button opening a drawer; no login control | designer | REQ-001, REQ-014 |
| Hero | Eyebrow (optional), H1, one-line subcopy, search form, lead image | H1 in Anton, at most two lines; subcopy at most 20 words; search is a labelled input plus a primary button; the hero fits the first viewport | designer | REQ-001, REQ-005 |
| Featured tours | Section title "Featured tours", "View all tours" link, up to six TourCards | 3-column grid; card = 4:3 image, category tag, name (two lines maximum), destination, duration, price per person, one link; the whole card is the link | designer | REQ-001, REQ-002 |
| Featured destinations | Section title "Featured destinations", up to six DestinationCards | Dark cards (`#111214`) with a photograph, destination name and "Explore <destination>" affordance; whole card is the link | designer | REQ-001, REQ-003 |
| Footer | Wordmark, nav, enquiry channel, copyright | Dark-card background, inverse text; 4-column at desktop, stacked at mobile; no invented social links | designer | REQ-014, REQ-016 |
| Home data states | Skeleton, empty and error per featured section | See the States table; the hero is never replaced by a data state | figma, derived | REQ-011, REQ-013 |

### Tour listing

**Purpose:** all published tours, narrowed by keyword, destination,
category, price and duration, sorted, paginated, and shareable by URL
(`REQ-004` to `REQ-007`, `REQ-010`).

**Roles:** any anonymous visitor (`REQ-014`).

**Entry / exit:**
- Entry: header "Tours"; a featured destination card (`?destination=`);
  the Home hero search (`?q=`); a shared or bookmarked URL (`REQ-010`).
- Exit: a tour card → `/tours/:slug`; the header/home wordmark → `/`.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Keyword | search input, labelled "Search tours" | no | Trimmed; 0-100 characters; case-insensitive substring over tour name and destination name; empty means all tours (`REQ-005`, `REQ-018`, `REQ-019`) | designer |
| Destination | select, labelled "Destination" | no | One published destination value; an unknown value in the URL is ignored (`REQ-006`, `REQ-021`) | designer |
| Category | select, labelled "Category" | no | One of Beach, Mountain, City, Culture, Adventure; unknown values ignored (`REQ-006`, `REQ-021`) | designer |
| Price minimum / maximum | two number inputs, IDR | no | Non-negative whole numbers; minimum must not exceed maximum, otherwise show the range error and do not request (`REQ-006`, `REQ-020`) | designer |
| Duration minimum / maximum | two number inputs, days | no | Whole days of at least 1; minimum must not exceed maximum, otherwise show the range error (`REQ-006`, `REQ-020`) | designer |
| Sort | select, labelled "Sort by" | no | `recommended` (default), `price-asc`, `price-desc`, `duration-asc`; any other value falls back to recommended (`REQ-006`, `REQ-021`) | designer |
| Page | pagination control | no | Whole number of at least 1; 12 tours per page; a value past the last page clamps to the last page (`REQ-004`, `REQ-025`) | designer |
| Clear all | button | - | Rendered only when at least one search, filter or sort is active; resets to the unfiltered listing (`REQ-006`, `REQ-012`) | derived |
| Result count | text, `aria-live="polite"` | - | "24 tours" / "1 tour"; announces the new count after each update | derived |

URL query keys (`REQ-010`): `q`, `destination`, `category`,
`priceMin`, `priceMax`, `durationMin`, `durationMax`, `sort`, `page`.
Default values are omitted from the URL. Reading an unknown value falls
back per control (`REQ-021`); writing uses `pushState` for discrete changes
(filter, sort, page) and `replaceState` for debounced typing, so Back
returns to the previous meaningful view.

**Actions**

- Typing in the keyword field: debounced 300ms, then fetches; Enter
  fetches immediately; a clear button empties it. Requests are sequenced or
  aborted so a slow earlier response cannot overwrite a newer one
  (`REQ-005`, `REQ-007`).
- Changing a select: applies immediately; changing a numeric range: applies
  on blur or Enter after the min/max check (`REQ-006`, `REQ-020`).
- Sort: applies immediately (`REQ-006`).
- Pagination: loads that page, moves focus/scroll to the results heading
  (not the document top), and keeps every active control (`REQ-004`,
  `REQ-010`, `REQ-025`).
- Tour card: opens `/tours/:slug` (`REQ-008`).
- Clear all: removes every listing query parameter and restores focus to
  the keyword field (`REQ-006`, `REQ-012`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Filter bar, 12 tour cards in a 3-column grid, pagination; result count shown | derived |
| Loading | 12 skeleton cards at the final card size; the filter bar stays usable and `aria-busy="true"`; no spinner and no page-level blocking (`REQ-011`) | derived |
| Empty (no matches) | The grid is replaced by an empty block: "No tours match your search." + "Clear search and filters". The filter bar stays visible (`REQ-012`) | derived |
| Empty (destination) | "No tours in <destination> yet." + "See all tours", which clears the destination filter (`REQ-022`) | derived |
| Error | The grid is replaced by one sentence and a "Try again" button that re-runs the current query; never a raw error, stack trace or enum (`REQ-013`) | derived |
| Invalid range | Inline message under the range inputs: "Minimum price must be lower than maximum price." / "Minimum duration must be lower than maximum duration." The previous results stay visible; no request is made (`REQ-020`) | derived |
| Search too long | The input caps at 100 characters; if a longer value arrives from the URL it is trimmed to 100 and the human-readable message "Search is limited to 100 characters." is shown (`REQ-019`) | derived |
| No permission | Not applicable (`REQ-027`) | designer |

**Responsive**

- ≥1280px: filter bar in one wrap row above the grid; 3 columns; full
  pagination (Previous, page numbers, Next).
- 1024-1279px: same grid, filters wrap to two rows.
- 768-1023px: 2 columns; filters in a collapsible panel; compact
  pagination (Previous / "Page 2 of 5" / Next).
- <768px: 1 column; a "Filters" button opens a bottom drawer with all
  filters and "Apply" / "Clear all"; a badge shows the active filter count;
  compact pagination; 44px targets; no horizontal scroll (`REQ-015`).

**Frames used:** none drawn. Follows the attached `Home` design.

**Screen spec** (follows `Home`)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Site header | Keep | Same header, nav and wordmark as Home; the "Tours" item is the active state | derived | REQ-004 |
| Hero | Replace | Compact page header instead of the marketing hero: title "Tours", one-line intro, result count, and the search field. No hero image, so the grid starts higher | derived | REQ-004, REQ-005 |
| Hero search | Keep | Same search component, moved into the page header; it now filters this page instead of navigating (`REQ-005`, `REQ-007`) | derived | REQ-005 |
| Featured tours grid | Replace | The six featured cards become the full results grid, 12 per page, using the same TourCard component and card size | derived | REQ-004, REQ-008 |
| Featured destinations | Remove | Destinations are a filter on this page, not a section; there is no separate destinations page in `spec.md` | derived | REQ-006 |
| Marketing section titles | Remove | "Featured tours" / "Featured destinations" labels do not belong on the listing | derived | - |
| Filter bar | Add | Destination, Category, Price min/max, Duration min/max, Sort, Clear all; labels above inputs; one accent for the active state | derived | REQ-006, REQ-020 |
| Mobile filter drawer | Add | Bottom sheet under 768px; focus trapped; Escape closes; "Apply" commits, "Clear all" resets | derived | REQ-006, REQ-015 |
| Sort control | Add | Select with the four allowed values; default "Recommended" | derived | REQ-006, REQ-021 |
| Pagination | Add | Previous / page numbers / Next at desktop; compact at phone; page past the end clamps | derived | REQ-004, REQ-025 |
| Loading skeleton | Add | 12 card skeletons; no layout shift between states | derived | REQ-011 |
| Empty state | Add | One sentence and one clear action, per the States table | derived | REQ-012, REQ-022 |
| Error state | Add | One sentence and a retry, per the States table | derived | REQ-013 |
| Footer | Keep | Same footer as Home | derived | - |

### Tour detail

**Purpose:** the full tour record and the single conversion action,
"Enquire about this tour" (`REQ-009`, `REQ-028`).

**Roles:** any anonymous visitor (`REQ-014`).

**Entry / exit:**
- Entry: a tour card from Home or the listing; a shared detail URL.
- Exit: "Enquire about this tour" leaves the site for email/WhatsApp; the
  header and footer return to Home or the listing; browser Back returns to
  the prior listing view with its URL state intact (`REQ-010`).

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| Image gallery | image set, one lead image + thumbnails | - | At least one image per published tour; alt text names the tour and destination (`REQ-009`, `REQ-016`) | designer, derived |
| Tour name | page title, Anton | - | 1-120 characters | designer, derived |
| Category | tag | - | One of the five category values | designer, derived |
| Destination | text | - | Destination name, linked to the filtered listing (`REQ-003`, `REQ-009`) | designer, derived |
| Duration | text | - | Whole days, e.g. "4 days" | designer, derived |
| Price per person | text, IDR | - | Whole rupiah, formatted for Indonesian locale, e.g. "Rp 2.450.000 per person"; never a booking or payment action (`REQ-009`) | designer, derived |
| Description | rich text (rendered as text) | - | Present on every published tour | designer, derived |
| Highlights | list | - | Present on every published tour | designer, derived |
| What is included | list | - | Present on every published tour | designer, derived |
| Departure dates | list of dates | - | At least one per published tour; display only, not filterable in this pass | designer, derived |
| Enquire about this tour | primary button/link | - | Opens WhatsApp as the primary action (`https://wa.me/<number>?text=<tour name>`) with a `mailto:<address>?subject=<tour name>` fallback; placeholder number/address at build time, real values before launch; no form submit, no payment (`REQ-028`) | designer, derived |

**Actions**

- Enquire: opens the configured WhatsApp deep link (`wa.me/<number>`) with
  the tour name in the pre-filled message; if no WhatsApp number is
  configured, the same control uses the `mailto:<address>` fallback with the
  tour name in the subject. The page does not navigate away (`REQ-028`).
- Destination link: opens `/tours?destination=<slug>` (`REQ-003`).
- Gallery thumbnails: switch the lead image; keyboard operable; no
  automatic carousel.
- Back: returns to the previous listing URL, state intact (`REQ-010`).

**States**

| State | Treatment | Source |
|---|---|---|
| Default | Gallery, title block (category, destination, duration, price), description, highlights, inclusions, departure dates, enquiry action | derived |
| Loading | Skeleton mirroring the final layout: gallery block, title lines, meta lines, section blocks; no spinner (`REQ-011`) | derived |
| Error | One sentence and "Try again" in place of the whole detail body; header and footer stay; never raw errors (`REQ-013`) | derived |
| Not found | The Tour not found page, HTTP 404 (`REQ-023`) | derived |
| Unpublished while viewing | The next data load (refresh or re-fetch) shows the Tour not found page, not stale content (`REQ-024`) | derived |
| No permission | Not applicable (`REQ-027`) | designer |

**Responsive**

- ≥1280px: two columns: gallery and enquiry panel on the left, long-form
  sections on the right; title block above both.
- 768-1023px: one column; gallery first; enquiry action below the price,
  repeated as a sticky bottom bar on phones.
- <768px: one column; gallery is a horizontal scroll-snap strip with
  visible page dots (semantic, not decorative); enquiry is a sticky bottom
  bar with a safe-area inset; 44px targets; no horizontal page scroll
  (`REQ-015`).

**Frames used:** none drawn. Follows the attached `Home` design.

**Screen spec** (follows `Home`)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Site header | Keep | Same header; the "Tours" item is active | derived | REQ-009 |
| Hero | Replace | The marketing hero becomes a tour gallery with the title block beneath it: name, category tag, destination, duration, price per person | derived | REQ-009 |
| Featured tours grid | Remove | The home discovery grids do not belong on a detail page | derived | - |
| Featured destinations | Remove | Same reason | derived | - |
| Long-form sections | Add | "About this tour", "Highlights", "What is included", "Departure dates", in that order; headings at the small display size, body at 16px | derived | REQ-009 |
| Enquiry action | Add | Primary "Enquire about this tour": desktop below the price in the title block; mobile in a sticky bottom bar. Opens WhatsApp (primary) with a mailto fallback, tour name pre-filled; no form | derived | REQ-028 |
| Booking / payment controls | Remove | Out of scope by `spec.md`; no "Book now", date picker, traveller count or checkout | designer | - |
| Loading skeleton | Add | Mirrors the gallery, title and section blocks | derived | REQ-011 |
| Error state | Add | One sentence plus "Try again" in place of the body | derived | REQ-013 |
| Footer | Keep | Same footer as Home | derived | - |

### Tour not found

**Purpose:** a dead end with a way forward when a tour is missing or
unpublished (`REQ-023`, `REQ-024`).

**Roles:** any anonymous visitor.

**Entry / exit:**
- Entry: any `/tours/:slug` that does not resolve, or a tour unpublished
  while being viewed.
- Exit: "Back to all tours" → `/tours`; header/footer.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| State title | text | - | "Tour not found" | derived |
| State copy | text | - | "This tour may have been removed or is no longer available." | derived |
| Back action | primary button | - | "Back to all tours" → `/tours` (`REQ-023`) | derived |

**Actions**

- Back to all tours: `/tours`, unfiltered (`REQ-023`).
- Header/footer links work as elsewhere.

**States**

| State | Treatment | Source |
|---|---|---|
| Default | The state page replaces the detail body; the header and footer stay. The response is HTTP 404 (`REQ-023`) | derived |
| Unpublished while viewing | Same page on the next data load (`REQ-024`) | derived |
| Loading | A short skeleton while the detail request resolves; the 404 is shown only after the response says not found | derived |
| No permission | Not applicable (`REQ-027`) | designer |

**Responsive:** the state block is centred, max 480px wide, 24px gutters,
one action; 44px target; no horizontal scroll.

**Frames used:** none drawn. Follows the attached `Home` design.

**Screen spec** (follows `Home`)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| Site header | Keep | Same header | derived | REQ-023 |
| Page body | Replace | The detail body becomes a state page: title, one sentence, "Back to all tours" | derived | REQ-023 |
| Footer | Keep | Same footer | derived | - |

### Offline

**Purpose:** when the device has no connection, serve the cached app shell
and a plain offline page instead of the browser's network error
(`REQ-026`).

**Roles:** any visitor.

**Entry / exit:**
- Entry: any navigation while offline, served by the service worker's
  navigation fallback.
- Exit: "Try again" reloads when the connection returns; header links go
  to cached routes.

**Content and fields**

| Field | Type | Required | Rule | Source |
|---|---|---|---|---|
| State title | text | - | "You're offline" | derived |
| State copy | text | - | "Check your connection and try again." | derived |
| Retry action | primary button | - | "Try again" reloads the current URL (`REQ-026`) | derived |

**States**

| State | Treatment | Source |
|---|---|---|
| Default | The offline page from the precache; the app shell is still styled | derived |
| Back online | "Try again" reloads; if the page is still unavailable, the normal error/empty state takes over | derived |
| No permission | Not applicable | designer |

**Responsive:** single centred column, max 480px, 24px gutters, 44px
target.

**Frames used:** none drawn. Follows the attached `Home` design.

**Screen spec** (follows `Home`)

| Part | Action | Detail | Source | REQ |
|---|---|---|---|---|
| App shell | Keep | Cached header, fonts and colours so the page is not unstyled | derived | REQ-017, REQ-026 |
| Page body | Replace | The offline state page: title, sentence, "Try again" | derived | REQ-026 |
| Footer | Keep | Cached footer | derived | - |

## Navigation

| From | Trigger | To |
|---|---|---|
| Any page | Header "Tours" or "Browse tours" | Tour listing, `/tours` |
| Any page | Wordmark / Home | Home, `/` |
| Home | Hero search submit | Tour listing, `/tours?q=<trimmed term>` (`REQ-005`) |
| Home | Featured tour card | Tour detail, `/tours/:slug` (`REQ-002`) |
| Home | Featured destination card | Tour listing, `/tours?destination=<slug>` (`REQ-003`) |
| Home | "View all tours" | Tour listing, `/tours` |
| Tour listing | Tour card | Tour detail, `/tours/:slug` (`REQ-008`) |
| Tour listing | Search, filter, sort or page change | Same page; URL updated; no full reload (`REQ-007`, `REQ-010`) |
| Tour listing | Browser Back / Forward | Previous or next listing state from the URL (`REQ-010`) |
| Tour listing empty state | "Clear search and filters" / "See all tours" | Same page, unfiltered (`REQ-012`, `REQ-022`) |
| Tour listing error state | "Try again" | Same page, same query re-fetched (`REQ-013`) |
| Tour detail | "Enquire about this tour" | External: WhatsApp (primary) or email fallback, tour name pre-filled; the site stays open (`REQ-028`) |
| Tour detail | Destination link | Tour listing filtered to that destination (`REQ-003`) |
| Tour detail | Browser Back | The prior listing URL with search/filter/page intact (`REQ-010`) |
| Tour detail (missing/unpublished) | Automatic | Tour not found page, HTTP 404 (`REQ-023`, `REQ-024`) |
| Tour not found | "Back to all tours" | Tour listing, `/tours` (`REQ-023`) |
| Any page while offline | Navigation | Offline page from the service worker (`REQ-026`) |
| Offline | "Try again" | Reload the current URL |

There is no separate destinations page and no login or account route in
this feature (`REQ-014`, REQ-027).

## Motion & interaction catalog

The attached design is a static screenshot and reports no interactions, so
every timing below was proposed from the design references and confirmed by
the designer on 2026-11-09. All of them are removed under
`prefers-reduced-motion: reduce`: state still changes, instantly, and
opacity/colour transitions may stay. Hover motion is gated to
`@media (hover: hover) and (pointer: fine)`.

| ID | Trigger | Element | Effect | Duration | Easing | Frame | Source |
|---|---|---|---|---|---|---|---|
| MO-001 | hover / focus-visible | Tour and destination cards | 2px lift + shadow from `shadow/card` to `shadow/lift`; border colour moves to primary | 160ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | designer |
| MO-002 | press | Primary and secondary buttons | `scale(0.98)` (or 1px down) while pressed; colour also darkens | 120ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | designer |
| MO-003 | keyboard focus | Inputs, selects, buttons, cards, pagination | 2px primary ring + 2px white offset; appears without layout shift | 120ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | designer |
| MO-004 | while loading | Featured and listing skeletons | Shimmer sweep across the surface colour | 1200ms | linear, loop | - | designer |
| MO-005 | open, <768px | Filter drawer | Sheet rises from the bottom; scrim fades in; background inert | 260ms (scrim 200ms) | `cubic-bezier(0.32, 0.72, 0, 1)` | - | designer |
| MO-006 | close, <768px | Filter drawer | Sheet leaves the way it entered; scrim fades | 200ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | designer |
| MO-007 | open / close, <1024px | Header menu | Fade + `scale(0.97)` to 1 from the trigger; reverse on close | 160ms | `cubic-bezier(0.23, 1, 0.32, 1)` | - | designer |
| MO-008 | results change | Listing grid | No animation: the new result set swaps in place and the count is announced with `aria-live="polite"`. Content being read must not move | instant | - | - | designer |
| MO-009 | route change | Whole page | No page transition; scroll to the top of the new page, except pagination which scrolls to the results heading | instant | - | - | designer |
| MO-010 | reduced motion | All of the above | All transforms and position changes removed; colour/opacity changes capped at 120ms | 120ms | linear | - | designer |

There is no auto-playing carousel, no scroll-jacking, no parallax and no
animation on the search input itself.

## Design tokens

**Design Read:** a public consumer travel marketplace for anonymous trip
planners, with a bold editorial travel language (Anton display, ocean blue,
photography-led cards), leaning toward an Airbnb-style marketplace grid
while keeping the requester's own palette and type. **Dials:**
`DESIGN_VARIANCE 7 / MOTION_INTENSITY 5 / VISUAL_DENSITY 4` (consumer
marketplace, not an agency landing page; the landing-only hero, marquee,
logo-wall and bento checks are not applicable, with the hero checked only
for fit and copy length).

**References used:** taste-skill (`design-taste-frontend` sections 0, 1,
4.5-4.9, 8-9 and 14), awesome-design-md → **`airbnb`** (closest character:
a photography-led travel marketplace with a quiet white canvas, pill search,
soft card radii and generous whitespace; its palette, fonts and marks are
not copied), emilkowalski-skills (animation timings and reduced-motion
rules), and playwright-skill (screenshot check of the docs preview). The
tokens below are the requester's; `airbnb` supplies rhythm and state
vocabulary only and never overrides a value the design fixed. There is no
dark mode in scope: the design is light-only, and adding one would be an
unrequested second theme.

### Colour

| Token | Value | Where used | Source |
|---|---|---|---|
| `color/primary` | `#2C7BA8` | Primary buttons, links, active filter, focus ring, search submit | figma |
| `color/primary-dark` | `#1F5F85` | Hover/pressed primary, link hover, header emphasis | figma |
| `color/background` | `#FFFFFF` | Page background | figma |
| `color/surface` | `#F2F4F6` | Section bands, filter panel, skeletons, image placeholders | figma |
| `color/text` | `#111111` | Headings and body text on white and on surface | figma |
| `color/text-muted` | `#6B7280` | Secondary text **on white only** (4.84:1); never on `surface` | figma |
| `color/inverse` | `#FFFFFF` | Text on primary and on dark cards | figma |
| `color/dark-card` | `#111214` | Featured destination cards and footer | figma |
| `color/text-muted-on-surface` | `#4B5563` | Secondary text on `surface` (6.86:1); `text-muted` is too light there (4.35:1, below AA for body text) | designer |
| `color/hairline` | `#E5E7EB` | Card borders, dividers, input borders | designer |
| `color/scrim` | `rgba(17, 18, 20, 0.45)` | Text over photographs and the filter drawer backdrop | designer |
| `color/error` | `#B42318` | Inline validation and error messages (6.48:1 on white) | designer |
| `color/error-surface` | `#FEF3F2` | Error block background | designer |
| `color/focus` | `#2C7BA8` | 2px focus ring with a 2px white offset (4.66:1 on white) | figma, designer |

One accent only: `#2C7BA8`. It carries the primary action, links, active
filter and focus; the error red is a status colour, never decoration. The
`color/text-muted` restriction is a measured accessibility finding, not a
style preference.

### Typography

| Token | Value | Where used | Source |
|---|---|---|---|
| `font/display` | Anton 400 | H1, section titles on Home, page titles | figma |
| `type/display` | Anton 400, 64/60 desktop, 40/38 phone, line-height 0.98, letter-spacing 0.01em | Hero H1; at most two lines | designer |
| `type/h1` | Anton 400, 48/44 desktop, 34/32 phone, line-height 1.0 | Page titles (Tours, tour name) | designer |
| `type/h2` | Anton 400, 32/30 desktop, 26/24 phone, line-height 1.05 | Section titles | designer |
| `font/body` | Inter 400/500/600 | All body, labels, buttons, legal | figma |
| `type/body` | Inter 400, 16/17px, line-height 1.6 | Descriptions, long-form sections | designer |
| `type/body-small` | Inter 400, 14px, line-height 1.5 | Card meta, helper text | designer |
| `type/label` | Inter 500, 14px, line-height 1.4 | Field labels, filter labels | designer |
| `type/button` | Inter 600, 15px, line-height 1.2 | Buttons and links that act as buttons | designer |
| `type/caption` | Inter 400, 12px, line-height 1.4 | Image captions, legal, result count | designer |

Anton has one weight only; do not synthesise a bold. Inter is the body and
UI face; it is not used for display headings. Both are self-hosted with
`font-display: swap` (taste-skill 3.A), never linked from Google Fonts in
production.

### Spacing, radius, elevation

| Token | Value | Where used | Source |
|---|---|---|---|
| `space` scale | 4, 8, 12, 16, 24, 32, 48, 64, 96 | All layout gaps and padding; 4px base | designer |
| `container` | max-width 1280px, gutters 24px phone / 32px tablet / 48px desktop | Page shell | designer |
| `radius/sm` | 8px | Inputs, small chips, thumbnails | designer |
| `radius/md` | 12px | Search field, filter panel | designer |
| `radius/lg` | 16px | Tour and destination cards, gallery | designer |
| `radius/pill` | 9999px | Primary/secondary buttons and category tags | designer |
| `shadow/card` | `0 8px 24px rgba(17, 18, 20, 0.08)` | Cards at rest | designer |
| `shadow/lift` | `0 12px 32px rgba(17, 18, 20, 0.12)` | Card hover | designer |
| `shadow/overlay` | `0 24px 64px rgba(17, 18, 20, 0.20)` | Mobile filter drawer | designer |
| `border` | 1px solid `color/hairline` | Card and input rest state | designer |
| `focus ring` | 2px `color/focus` + 2px white offset | Every interactive element | designer |
| `breakpoints` | 360, 640, 768, 1024, 1280, 1440 | Layout changes documented per page | designer |

**Shape lock:** buttons and tags are full pill; cards and gallery are 16px;
inputs and the search field are 12px. No other radius is introduced.

**Contrast checks (measured):** white on `#2C7BA8` 4.66:1 (passes AA
normal text); white on `#1F5F85` 6.92:1; `#6B7280` on white 4.84:1 (passes);
`#6B7280` on `#F2F4F6` 4.35:1 (fails for body text, hence
`text-muted-on-surface`); `#111111` on white 18.9:1; `#B42318` on white
6.48:1. Focus rings must reach 3:1 against both the control and the page;
the 2px primary ring plus white offset does.

## Components

The attached design is a screenshot: it has **no Figma `Code` properties**
and does not enumerate its reported 50 component instances, and no
nexcomponent-ui package is present in this environment, so no export is
claimed here. The column records what a builder must resolve; an unresolved
row is a known gap, not an invented import.

| Component | Figma `Code` and variants | nexcomponent export (import path) | Resolution status | States | Used on | Note |
|---|---|---|---|---|---|---|
| Site header | none (screenshot) | not resolved: map to the house header/nav or Ant Design `Layout.Header` + `Menu` | unresolved | Default, sticky/scrolled, mobile closed/open | All pages | 72px max, one line desktop, drawer under 1024px |
| Wordmark | none | text in Anton until the logo SVG is supplied | unresolved (asset missing) | Default | Header, footer | See `## Assets` |
| Primary / secondary / ghost button | none | not resolved: nexcomponent-ui `Button`, else Ant Design `Button` | unresolved | Default, hover, pressed, focus, disabled, loading | All pages | Pill radius; one accent |
| Search field | none | not resolved: `Input` + `Button`, else Ant Design `Input.Search` | unresolved | Default, focus, filled, error, disabled | Home, Tour listing | Labelled; 100-character cap; debounced |
| Select (destination, category, sort) | none | not resolved: nexcomponent-ui select, else Ant Design `Select` | unresolved | Default, focus, open, disabled | Tour listing | Labels above; unknown URL values fall back |
| Number range input | none | not resolved: two `InputNumber` fields, else Ant Design `InputNumber` | unresolved | Default, focus, invalid, disabled | Tour listing | Min/max check before request |
| Tour card | none | not resolved: composed `Card` + image + `Tag`; no single export expected | unresolved | Default, hover, focus-visible, loading skeleton | Home, Tour listing | Whole card is one link; 4:3 image |
| Destination card | none | not resolved: composed dark `Card` | unresolved | Default, hover, focus-visible, skeleton | Home | `#111214` base, photo, inverse text |
| Category tag | none | not resolved: `Tag`, else Ant Design `Tag` | unresolved | Default | Cards, detail title block | Pill, 12px, `surface` fill and `text` label |
| Filter bar / drawer | none | not resolved: composed panel + `Drawer`, else Ant Design `Drawer` | unresolved | Default, open, applying, invalid | Tour listing | Focus trap, Escape, Apply/Clear all |
| Pagination | none | not resolved: nexcomponent-ui pagination, else Ant Design `Pagination` | unresolved | Default, current, disabled prev/next | Tour listing | Compact phone variant |
| Result count live region | none | plain text with `aria-live="polite"` | compose | Updating, idle | Tour listing | Announces the new count |
| Skeleton card | none | composed CSS block, no library | compose | Loading | Home, Tour listing, Tour detail | Final-size, no layout shift |
| Empty state | none | not resolved: `StatePage` if available, else composed block | unresolved | Empty | Home sections, Tour listing | One sentence + one action |
| Error state | none | composed inline block + `Button` | compose | Error, retrying | Home sections, Tour listing, Tour detail | Never raw errors |
| Not-found / offline state | none | not resolved: `StatePage` if available, else composed block | unresolved | 404, offline | Tour not found, Offline | One action |
| Image gallery | none | composed: lead image + thumbnail strip; CSS scroll-snap on phone | compose | Default, loading, broken image | Tour detail | Alt text; no autoplay |
| Enquiry action | none | not resolved: `Button` rendered as an external link | unresolved | Default, hover, focus | Tour detail | WhatsApp/mailto, no form |
| Mobile menu / drawer | none | not resolved: house drawer over `Dialog` primitives | unresolved | Closed, open, closing | All pages <1024px | Focus trap, Escape |
| Toast / notification | none | none required by this feature | not needed | - | - | Feedback is inline, never a toast |

## Assets

| Asset | Location in Figma | Format | Note |
|---|---|---|---|
| Brand wordmark / logo | Not in the supplied extraction | SVG | Missing. The designer must supply it; until then the wordmark is set in Anton. Listed in `## Open design gaps` |
| Tour photography | From each tour record, authored outside the public site | image URL; serve WebP/AVIF with a JPEG fallback, responsive `srcset` | At least one image per published tour; `alt` names the tour and destination. Licensed by the agency, not bundled in the repo |
| Destination photography | From each destination record | image URL, same format policy | Used on featured destination cards; `alt` is the destination name |
| Category and UI icons | Not in the supplied extraction | SVG, from the project's existing icon library | Search, menu, close, chevron, calendar, clock, map pin, image placeholder. No hand-rolled icon paths (taste-skill 3.C) |
| Display font | Not in the supplied extraction | webfont, self-hosted, `font-display: swap` | Anton, SIL Open Font License |
| Body font | Not in the supplied extraction | webfont, self-hosted, `font-display: swap` | Inter, SIL Open Font License |
| PWA icons | Produced from the brand mark | 192×192 and 512×512 PNG, plus a maskable 512 | Required by `REQ-017`; the manifest cannot be valid without them |
| Favicon | Produced from the brand mark | SVG + PNG fallback | House default |
| Offline illustration | None | - | Not needed: the offline page uses the state-page block, no illustration |

## Open design gaps

| Gap | Owner | Status |
|---|---|---|
| The Home screenshot itself is not available in this session; only the extracted design brief is. Section arrangement, spacing and copy below the token level were completed here | designer | Resolved 2026-11-09: the designer confirmed the proposed Home section spec in this session. The confirmation is against this document, not pixels; a later PNG/Figma check can still correct spacing |
| Tour listing, Tour detail, Tour not found and Offline are not drawn | designer | Resolved 2026-11-09: the designer confirmed the derived screen patterns in this session |
| Enquiry channel and address (`REQ-028`) | designer / spec owner | Resolved 2026-11-09: WhatsApp is primary with a `mailto:` fallback; placeholder number and address at build time, real values before launch |
| Brand wordmark, footer contact details and social links | designer | Resolved 2026-11-09: wordmark set in Anton, footer reuses the enquiry channel, no social links until supplied |
| Photography for tours and destinations | content owner / designer | Resolved 2026-11-09: neutral placeholders accepted; real images come with tour/destination records authored outside the site |
| Component exports | frontend | Deferred to `/fe-dev`: no Figma `Code` values and no nexcomponent-ui package here; the Components table records the required families and leaves the import unresolved rather than inventing one |
| The design reports 50 component instances on Home but does not enumerate them | designer | Accepted 2026-11-09: this map groups them into the section/component inventory above; no exact instance count is claimed |
| Responsive, loading, empty, error and motion are not in the static design | designer | Resolved 2026-11-09: the proposed defaults were confirmed in this session |
