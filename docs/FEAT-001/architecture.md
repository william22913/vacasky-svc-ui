---
feature_code: FEAT-001
service: vacasky-svc
version: 1
status: complete
spec_version: 1
code_repo: https://github.com/william22913/vacasky-svc-code
release_branch: main
integration_branch: feat/FEAT-001
stack: go
frontend_repo: https://github.com/william22913/vacasky-svc-ui
frontend_base_branch: main
dev_feedback: []
code_prep_feedback: []
sources: []
pr_url: https://github.com/william22913/sandbox-docs/pull/31
last_updated: 2026-11-09
---

# FEAT-001 — Tour & Travel Agency Website (vacasky-svc) — Architecture

## Revision notes (spec v1)

First design pass for this feature. `spec.md` v1 is complete and merged
(PR #28); `testcase.md` v1 is complete and merged (PR #29) and pins
`spec_version: 1`. `UIMap.md` and `DesignBrief.md` are merged (PR #30) and
are the design authority for the frontend. All 28 requirements are covered
in the traceability checklist below.

The feature is a **read-only public catalog**: there are no writes, no
accounts, no payments and no external integrations. The design work is
concentrated in five places:

1. **Two small repositories, one service boundary.** The Go API owns the
   catalog data and exposes five read endpoints; the React app is the only
   consumer. No admin or content-management surface is built here.
2. **One shared Go backend pattern, not a new one.** The service reuses the
   organisation's Go stack — nexcommon v0.3.68-swagger, `gorilla/mux`,
   PostgreSQL via `database/sql` + pgx, `sql-migrate` — exactly as the
   sibling `sandbox-svc` does. Public routes use nexcommon's no-op
   `WhitelistValidator`, so no token infrastructure (and no Redis) is
   needed.
3. **The listing contract does the fallback work.** Unknown or malformed
   filter, sort and page values are ignored and the request falls back to
   the unfiltered/default view; out-of-range pages clamp to the last page.
   Invalid numeric ranges and over-long search terms are the only
   requests that return a client error, with a human-readable message.
4. **The frontend treats the URL as the source of truth.** Search, filters,
   sort and page live in `URLSearchParams`; requests are debounced and
   aborted so a slow earlier response can never overwrite a newer one.
5. **The PWA is the same web app.** One Vite build produces the manifest,
   service worker, app shell cache and offline page; no separate mobile
   application is built.

## Survey notes (Part 2)

Both repositories were surveyed read-only over the GitHub API; neither was
cloned or modified. Both are greenfield: each contains only a `README.md`
on `main`, with no `CLAUDE.md`, `PROJECT.md`, `go.mod`, `package.json`,
`Dockerfile`, CI workflow or code of any kind. There is no existing
convention in either repository to match, so the organisation defaults
below apply.

The organisation's Go stack was read from `nexsoft-git/nexcommon` (the
library itself, not a guess) and from the sibling service
`william22913/sandbox-svc-code`, which is the closest working reference for
this exact house pattern:

- **Library and pin** — `github.com/nexsoft-git/nexcommon v0.3.68-swagger`.
  A new project with no existing `go.mod` uses the swagger-wired build, so
  `GenerateSwaggerDocs` is wired at startup.
- **Verified response envelope** — read from
  `nexcommon/dto/out/out.go`, not assumed:
  `DefaultResponse` is `{"success", "header", "payload"}` for success and
  `DefaultErrorResponse` is
  `{"success": false, "header": {...}, "payload": {"status", "code", "message"}}`
  for errors. There is no top-level `error_code`/`message` pair.
- **Route prefix** — the sibling service's `router.V1PrefixPath = "/v1"`.
  Every path below is written with its real `/v1` prefix, not a shorthand.
- **Public access** — `ControllerValidator.WhitelistValidator` returns
  `nil` and is nexcommon's documented route strategy for public endpoints.
  It needs no Redis, no token and no authorization API, which removes the
  sibling service's Redis dependency entirely.
- **Health** — `nexcommon/http/endpoint/health.NewHealthEndpoint` with the
  DB connection checker. Only the database is a real dependency, so the
  health endpoint checks only the database.
- **Migrations** — `sql-migrate` batch files under `sql_migrations/main`,
  applied at startup through `nexcommon/server/db_migration`.
- **Metrics** — `nexcommon/server/metrics.NewMetrics` registers
  `my_app_http_hist` on the default registry; `promhttp.Handler()` is
  served at `GET /metrics`. The library's own middleware still has a
  nil-route dereference and an unlimited path label, so this service uses
  the status-aware wrapper pattern already proven in `sandbox-svc-code`.
- **Tests** — table-driven Go tests against a throwaway PostgreSQL
  (`tests/testdb`), endpoint tests with `httptest`, and a live smoke script.

## Technology Stack

**Stack decision: `go`** for the API and **React/Vite** for the web app.
This is a request/response catalog that a browser calls, not a batch or
warehouse pipeline, so the `go` stack applies (Part 2b rule 3). The Go
service is the only owner of the catalog data; the frontend is a pure
consumer of its HTTP contract.

| Area | Choice | Purpose / reason |
|---|---|---|
| Language | Go 1.27 | Organisation default; matches `nexcommon` and the sibling service |
| HTTP framework | `github.com/gorilla/mux` via `nexcommon/controller/http` | House routing/validation/response wrapper |
| Shared library | `github.com/nexsoft-git/nexcommon v0.3.68-swagger` | Response envelope, config idioms, health, migrations, metrics, swagger generation |
| Database | PostgreSQL 15+ | Relational catalog with filters and aggregates |
| DB access | `database/sql` + `github.com/jackc/pgx` | Same pattern as the sibling service; parameterized SQL only |
| Migrations | `github.com/rubenv/sql-migrate` | Batched, applied at startup |
| Logging | `github.com/nexsoft-git/nexlogger` | Structured, request-scoped logging |
| Metrics | `github.com/prometheus/client_golang` | `/metrics` with a status-aware middleware |
| API documentation | nexcommon swagger generator | `openapi.yaml` generated by `/go-dev`; `/inspect` UI |
| Frontend | React 18.2 + Vite 5 + JavaScript/JSX | House frontend stack; no TypeScript in the sibling UI |
| UI primitives | Ant Design 4.24 | House fallback layer; `nexcomponent-ui` is not available (see Frontend) |
| Routing | `react-router-dom` 6 | House routing |
| HTTP client | `axios` 1.7 | Single configured API client |
| Fonts | `@fontsource/anton`, `@fontsource/inter` | Self-hosted webfonts, no Google Fonts runtime link |
| PWA | `vite-plugin-pwa` (Workbox) | Manifest, app-shell precache, offline navigation fallback |
| Frontend tests | `vitest` + Testing Library, Playwright | Unit/component and desktop/mobile end-to-end |

## Architecture Overview

```
Browser (React SPA + PWA)
        │  HTTPS, GET only
        ▼
vacasky-svc (Go, nexcommon)
  router (mux, /v1 prefix, CORS, status-aware metrics)
        │
  endpoint layer (WhitelistValidator — public, no token)
        │
  service layer (query parsing/fallback, business rules, typed errors)
        │
  DAO layer (parameterized SQL, read-only)
        │
  PostgreSQL (destinations, tours, tour_images)
```

- **New** — this feature creates the whole service: five public read
  endpoints, three tables, and the React app.
- **Touched** — nothing existing; both repositories are greenfield.
- **Untouched** — no writes, no admin UI, no booking, no accounts, no
  payments, no external integrations, no multi-language. These are
  `spec.md` non-goals, not deferred design decisions.

The service is read-only. There is no `POST`, `PUT`, `PATCH` or `DELETE`
route in this pass, so no CSRF protection, idempotency key or write
transaction is needed. TLS terminates at the deployment ingress/nginx.

## Backend — Endpoints

Every endpoint is public and anonymous (`REQ-014`). There is no
authorization matrix because there are no roles, no restricted records and
no identity: **anyone may call every endpoint**. The route validator is
nexcommon's `WhitelistValidator`, which is a no-op by design.

All paths include the real `/v1` prefix. All responses use nexcommon's
envelope:

Success:

```json
{
  "success": true,
  "header": {"request_id": "...", "version": "1.0.0", "timestamp": "..."},
  "payload": {}
}
```

Error:

```json
{
  "success": false,
  "header": {"request_id": "...", "version": "1.0.0", "timestamp": "..."},
  "payload": {
    "status": 400,
    "code": "SEARCH_TERM_TOO_LONG",
    "message": "Search is limited to 100 characters."
  }
}
```

`header.request_id` and `header.timestamp` come from nexcommon's request
context; `header.version` is `server.version` from configuration. Error
messages are human-readable and come from the i18n bundle; codes are stable
machine identifiers and never shown as the primary message.

| Method | Path | Consumer | Purpose |
|---|---|---|---|
| GET | `/v1/home/featured-tours` | `fe` — Home | Up to six featured tours, in `featured_order` |
| GET | `/v1/home/featured-destinations` | `fe` — Home | Up to six featured destinations, in `featured_order` |
| GET | `/v1/tours` | `fe` — Tour listing | Published tours with search, filters, sort and pagination |
| GET | `/v1/tours/{slug}` | `fe` — Tour detail / not found | One published tour by slug |
| GET | `/v1/destinations` | `fe` — Tour listing (destination filter) | Destination filter options |
| GET | `/v1/health` | deployment | Database health check |
| GET | `/metrics` | deployment | Prometheus scrape (outside token validation) |

`/v1/health` and `/metrics` are operational endpoints, not `## Backend —
Endpoints` consumer contract; they are included here so the full route
table is in one place.

### Endpoint details

#### GET `/v1/home/featured-tours`

- Query parameters: none.
- Selection: published, featured, not deleted; ordered by
  `featured_order ASC NULLS LAST, name ASC, id ASC`; `LIMIT 6`.
- Payload:

```json
{
  "tours": [
    {
      "slug": "bali-island-escape",
      "name": "Bali Island Escape",
      "destination": {"slug": "bali", "name": "Bali"},
      "category": "Beach",
      "duration_days": 5,
      "price_per_person": 4500000,
      "image_url": "https://cdn.example/tours/bali-1.jpg",
      "image_alt": "Bali Island Escape beach at sunset"
    }
  ]
}
```

- Empty catalog → `{"tours": []}` with HTTP 200. `null` is never returned
  for a list.

#### GET `/v1/home/featured-destinations`

- Query parameters: none.
- Selection: featured, not deleted; ordered by
  `featured_order ASC NULLS LAST, name ASC, id ASC`; `LIMIT 6`.
- Payload:

```json
{
  "destinations": [
    {
      "slug": "komodo",
      "name": "Komodo",
      "image_url": "https://cdn.example/destinations/komodo.jpg",
      "image_alt": "Komodo island coastline"
    }
  ]
}
```

- Empty → `{"destinations": []}` with HTTP 200.

#### GET `/v1/tours`

| Parameter | Type | Rules | Fallback |
|---|---|---|---|
| `q` | string | trimmed; 0–100 characters; case-insensitive substring over tour name or destination name | empty after trim → no keyword; over 100 characters → **400** |
| `destination` | string | at most one value; must be a non-deleted destination slug | unknown or repeated value → filter ignored |
| `category` | string | at most one value; one of `Beach`, `Mountain`, `City`, `Culture`, `Adventure` | unknown or repeated value → filter ignored |
| `price_min` | integer | ≥ 0, whole rupiah | non-integer or negative → bound ignored |
| `price_max` | integer | ≥ 0, whole rupiah; must be ≥ `price_min` when both are applied | non-integer or negative → bound ignored |
| `duration_min` | integer | ≥ 1 whole day | non-integer or below 1 → bound ignored |
| `duration_max` | integer | ≥ 1 whole day; must be ≥ `duration_min` when both are applied | non-integer or below 1 → bound ignored |
| `sort` | string | `recommended` (default), `price-asc`, `price-desc`, `duration-asc` | anything else → `recommended` |
| `page` | integer | whole number ≥ 1 | missing, malformed, below 1 → page 1; past the last page → last page |

- `price_min > price_max` (both applied) → **400** `INVALID_PRICE_RANGE`.
- `duration_min > duration_max` (both applied) → **400**
  `INVALID_DURATION_RANGE`.
- Search matching uses
  `strpos(lower(tour.name), lower($q)) > 0 OR strpos(lower(destination.name), lower($q)) > 0`,
  so `%` and `_` are literal characters and no LIKE-escaping bug is
  possible.
- Only published, non-deleted tours are returned.
- Page size is fixed at **12**; the caller cannot change it.
- Effective ordering:
  - `recommended`: `is_featured DESC, featured_order ASC NULLS LAST, name ASC, id ASC`
  - `price-asc`: `price_per_person ASC, name ASC, id ASC`
  - `price-desc`: `price_per_person DESC, name ASC, id ASC`
  - `duration-asc`: `duration_days ASC, name ASC, id ASC`
- Payload:

```json
{
  "tours": [],
  "page": 1,
  "page_size": 12,
  "total": 30,
  "total_pages": 3
}
```

- `page` is the **effective** page after clamping; the frontend writes it
  back to the URL when it differs. `total_pages` is
  `ceil(total / 12)` and is `0` when `total` is `0`; `page` is `1` in that
  case.
- No matches → HTTP 200 with `tours: []`, not 404.

#### GET `/v1/tours/{slug}`

- `slug` is validated in the service layer against `^[a-z0-9-]+$` before
  any query (nexcommon does not validate path params). A malformed or
  unknown slug, or an unpublished/deleted tour, returns the same
  **404** `TOUR_NOT_FOUND` with the message
  `"This tour may have been removed or is no longer available."` — the two
  cases are deliberately indistinguishable (`REQ-023`, `REQ-024`).
- Payload:

```json
{
  "slug": "bali-island-escape",
  "name": "Bali Island Escape",
  "destination": {"slug": "bali", "name": "Bali"},
  "category": "Beach",
  "duration_days": 5,
  "price_per_person": 4500000,
  "description": "Five days ...",
  "highlights": ["Uluwatu temple at sunset", "..."],
  "included": ["Airport transfer", "..."],
  "images": [
    {"url": "https://cdn.example/tours/bali-1.jpg", "alt": "Bali Island Escape beach at sunset"}
  ],
  "departure_dates": ["2026-11-20", "2026-12-04", "2026-12-18"]
}
```

- `highlights`, `included`, `images` and `departure_dates` are always
  arrays, never `null`. `departure_dates` are `YYYY-MM-DD` strings.

#### GET `/v1/destinations`

- Filter-options endpoint for the **Tour listing** page, authorized for
  that public page (the consuming page's permission is "public"). It
  returns every non-deleted destination ordered by name, including a
  destination with no published tours, because that destination must remain
  selectable and produce the approved empty state (`REQ-022`).
- Payload:

```json
{"destinations": [{"slug": "bali", "name": "Bali"}]}
```

- The **category** filter's options are the five fixed values from
  `spec.md`; they are constants in both the API and the frontend. No
  category endpoint is needed, and adding one would imply a managed list
  the spec does not have.

#### Error catalogue

| Status | Code | Human message | When |
|---|---|---|---|
| 400 | `SEARCH_TERM_TOO_LONG` | Search is limited to 100 characters. | `q` longer than 100 characters |
| 400 | `INVALID_PRICE_RANGE` | Minimum price must be lower than maximum price. | both price bounds applied and min > max |
| 400 | `INVALID_DURATION_RANGE` | Minimum duration must be lower than maximum duration. | both duration bounds applied and min > max |
| 404 | `TOUR_NOT_FOUND` | This tour may have been removed or is no longer available. | unknown, unpublished or deleted slug |
| 500 | `E-5-VAC-SRV-001` | (generic) | unexpected error; details only in logs |

Business errors are declared as typed nexcommon sentinels in
`error/error.go`; any other error is coerced to the generic 500 by the
formatter. No stack trace, SQL or internal field name is ever returned.

## Data access and query rules

All SQL is parameterized (`$1`, `$2`, …); no value is concatenated into a
statement. Every public read filters `is_deleted = FALSE`; tours also
filter `is_published = TRUE` except in the two homepage queries, which
filter both.

- Destination existence check: one indexed `SELECT EXISTS` by slug when a
  `destination` parameter is present. If it does not exist, the filter is
  dropped before the main query — the API never returns an empty list for
  an unknown destination (`REQ-021`).
- Category, sort and page validation happen in Go before SQL; they are
  enums/ranges, not database lookups.
- Pagination is `COUNT(*)` plus `ORDER BY … LIMIT 12 OFFSET (page-1)*12`
  over the same filter predicate. The count and the page are read in one
  read-committed transaction so the two cannot disagree about which rows
  are eligible.
- The catalog is small (dozens of tours). No `pg_trgm` index, no
  materialized view and no cache are introduced; a sequential scan over a
  few hundred rows is cheaper than maintaining either. `ponytail:` comment
  in the DAO names this ceiling and the upgrade path (add a GIN trigram
  index on `tours.name` and `destinations.name` when the catalog grows).
- `destinations`, `tours` and `tour_images` use the standard audit columns
  and the split soft-delete columns (`is_deleted`, `deleted_at`,
  `deleted_by`). Publication (`is_published`) is a business flag, not a
  deletion state.

## Frontend

**UI scope: yes** (`has_ui: true`). Confirmed targets:
`frontend_repo: https://github.com/william22913/vacasky-svc-ui`,
`frontend_base_branch: main`. The repository is greenfield (only a
`README.md`), so `/fe-dev` scaffolds the app from scratch and owns the
implementation.

**Design authority.** `UIMap.md` (merged, PR #30) and `DesignBrief.md` are
the approved screen and token authority; the attached `design.png`
(`vacasky-home.png`, 1440×900) is the visual reference. The screenshot
contains sections the approved scope does not include — About, Gallery,
Testimonial, Values, Blog, Login/Sign In, and a date-based search field.
`spec.md` explicitly excludes reviews, blog, accounts/login and
date-based search, and `UIMap.md` resolved the Home structure to hero +
featured tours + featured destinations + footer. **Those screenshot
sections are therefore out of scope and must not be built.** The
screenshot's visual language — Anton display type, ocean blue accent,
photography-led cards, dark destination cards, pill controls, generous
white canvas — is followed.

**Stack.** React 18.2, Vite 5, JavaScript/JSX, Ant Design 4.24,
`react-router-dom` 6, `axios` 1.7, `@fontsource/anton` and
`@fontsource/inter`, `vite-plugin-pwa`, `vitest` + Testing Library and
Playwright. `nexcomponent-ui` is **not available** in this environment
(the sibling UI vendors a tarball that this repository does not have);
Ant Design plus local presentational components is the documented
fallback. If the package is supplied later, the local components are the
only call sites to swap.

**Routes.**

| Route | Screen | Data |
|---|---|---|
| `/` | Home | featured tours + featured destinations |
| `/tours` | Tour listing | tour list + destination options |
| `/tours/:slug` | Tour detail | tour detail |
| `/offline` | Offline page | none (service-worker fallback) |
| `*` | Not found | none |

**API layer (adapter → service → hook → page; pages never call axios).**

- `src/core/api/axios/client.js` — one place for
  `baseURL: import.meta.env.VITE_API_BASE_URL || '/api'`, a request
  timeout, and an error normaliser that never surfaces raw status codes.
- `src/core/api/adapters/catalogAdapter.js` — maps wire payloads to view
  models (notably `destination` object → display name, price integer →
  IDR display value).
- `src/core/api/services/catalogService.js` — five calls matching the
  contract above, each accepting an `AbortSignal`.
- `src/features/*/hooks` — `useFeaturedTours`, `useFeaturedDestinations`,
  `useTourList`, `useTourDetail`, `useDestinationOptions`. Each exposes
  `{status, data, error, retry}` with `status ∈ loading | ready | empty |
  error`.
- Per-request `AbortController` plus a monotonically increasing request
  sequence: only the newest response may update state (`REQ-007`). The
  previous request is aborted on every new search/filter change.

**URL state.** `q`, `destination`, `category`, `priceMin`, `priceMax`,
`durationMin`, `durationMax`, `sort`, `page` — exactly the keys in
`UIMap.md`. Defaults are omitted. Discrete changes (filter, sort, page)
use `pushState`; debounced typing uses `replaceState`. On load the app
parses and validates every value against the same allowed lists the API
uses; invalid values are ignored rather than sent, and a server-clamped
`page` is written back to the URL.

**Components (all local unless noted).** `SiteHeader`, `SiteFooter`,
`Hero` (eyebrow, H1, subcopy, `SearchField`), `SearchField`, `TourCard`,
`DestinationCard`, `FilterBar`, `FilterDrawer` (Ant Design `Drawer`, below
768px), `SortSelect`, `RangeInputs`, `Pagination`, `SkeletonCard`,
`EmptyState`, `ErrorState`, `StatePage`, `ImageGallery`, `EnquiryButton`.
Ant Design supplies `Button`, `Input`, `Select`, `InputNumber`, `Tag`,
`Drawer`, `Pagination` and `Spin`; everything else is a small local
component styled from the design tokens.

**States.** Every data-loading screen implements all four required states:

- **Loading** — final-size skeletons (`REQ-011`), `aria-busy="true"`.
- **Empty** — Home sections have their own copy; the listing shows
  "No tours match your search." with a one-click clear, and the
  destination-empty variant with "See all tours" (`REQ-012`, `REQ-022`);
  an empty homepage section keeps the other section and the hero.
- **Error** — one plain sentence and a retry that re-runs the same request
  (`REQ-013`); the Home sections fail and retry independently.
- **No permission** — explicitly not applicable (`REQ-027`); no such
  state is built.

**Detail and enquiry.** The detail page renders the gallery, title block,
description, highlights, inclusions and departure dates. The
"Enquire about this tour" control is an anchor, not a form: it opens
`https://wa.me/<VITE_WHATSAPP_NUMBER>?text=<encoded tour name>`; when no
WhatsApp number is configured it falls back to
`mailto:<VITE_CONTACT_EMAIL>?subject=<encoded tour name>`. No submit, no
payment (`REQ-028`). Placeholder values ship in `.env.example`; real
values are supplied before launch.

**PWA.** `vite-plugin-pwa` with `registerType: 'autoUpdate'`:
manifest `name: "vacasky — Tours & Travel"`, `short_name: "vacasky"`,
`start_url: "/"`, `display: "standalone"`, `theme_color: "#2C7BA8"`,
`background_color: "#FFFFFF"`, icons 192×192 and 512×512 plus a maskable
512; Workbox precaches the app shell and serves `/offline` as the
navigation fallback; `index.html` carries the viewport meta tag; production
is served over HTTPS (`REQ-017`, `REQ-026`).

**Responsive and accessibility.** 360px → wide desktop, no horizontal
scroll, ≥44px targets; semantic landmarks, labelled inputs, visible 2px
focus ring, keyboard-operable cards/menu/drawer/pagination, alt text from
the API (`REQ-015`, `REQ-016`). Mobile filters are a focus-trapped bottom
drawer; the header collapses to a menu button below 1024px.

**Design tokens** are copied from `UIMap.md` (`#2C7BA8` primary,
`#1F5F85` primary-dark, `#FFFFFF` background, `#F2F4F6` surface,
`#111111` text, `#6B7280` text-muted on white only, `#FFFFFF` inverse,
`#111214` dark-card; Anton for display, Inter for body). They live in
`src/styles/tokens.css` as CSS custom properties and are the only source
of colour/type values.

**Tests.** Vitest + Testing Library for query parsing, URL round-trip,
debounce/stale-response behaviour, formatters and state components;
Playwright for the five core flows (home → detail, home → filtered
listing, search/filter/clear, detail enquiry link, offline page) at 360px
and 1440px, with screenshots attached to the PR (`REQ-015`, `REQ-017`,
`REQ-028`).

**Deployment.** Multi-stage Docker build; nginx serves the SPA with a
history fallback, a restrictive CSP (self + the API origin), and proxies
`/api/` to the backend's `/v1/`. HTTPS terminates in front of nginx
(`REQ-017`).

## spec_traceability

One line per requirement in `spec.md` v1. Every line names the concrete
architectural answer, not just the topic.

| Requirement | Architectural answer |
|---|---|
| REQ-001 | `GET /v1/home/featured-tours` and `GET /v1/home/featured-destinations`, each `LIMIT 6` ordered by `featured_order`; Home renders both sections plus the hero search. |
| REQ-002 | Each featured tour card links to `/tours/{slug}`; the detail route calls `GET /v1/tours/{slug}`. |
| REQ-003 | Each featured destination card links to `/tours?destination={slug}`; the listing applies the destination filter server-side. |
| REQ-004 | `GET /v1/tours` defaults to all published tours, page size fixed at 12, returning `total`/`total_pages`. |
| REQ-005 | `q` is parsed and trimmed in `services/tour`, matched with `strpos(lower(...))` over tour and destination names; the frontend debounces 300ms and updates without a page reload. |
| REQ-006 | `destination`, `category`, `price_min`/`price_max`, `duration_min`/`duration_max` are combined in one SQL predicate; `Clear all` resets the URL to no listing parameters. |
| REQ-007 | The frontend aborts the previous request and gates state updates on a monotonically increasing request sequence; the API has no cache that could reorder responses. |
| REQ-008 | Each listing card links to `/tours/{slug}`. |
| REQ-009 | `GET /v1/tours/{slug}` returns name, destination, duration, price (integer IDR), description, highlights, included, images and departure dates; the detail page renders all of them. |
| REQ-010 | `URLSearchParams` is the single source of truth for `q`, four filter pairs, `sort` and `page`; `pushState`/`replaceState` are chosen per interaction. |
| REQ-011 | Each hook exposes `status: loading` and each data region renders final-size skeletons (`SkeletonCard`, gallery skeleton, detail skeleton). |
| REQ-012 | HTTP 200 with `tours: []` is rendered as the empty state with a one-click clear; it is never treated as an error. |
| REQ-013 | Network/5xx failures map to a plain sentence plus a retry that re-issues the same request; raw status, code and stack traces are never rendered. |
| REQ-014 | Every route uses `WhitelistValidator`; there is no token, cookie, login screen or account state anywhere in the stack. |
| REQ-015 | CSS grid/flex with the documented 360/640/768/1024/1280/1440 breakpoints and 44px minimum interactive sizing; Playwright asserts no horizontal overflow at 360 and 1440. |
| REQ-016 | Semantic header/main/nav/footer landmarks, labelled inputs, 2px focus ring token, keyboard handlers for cards/drawer/pagination, alt text supplied by the API. |
| REQ-017 | `vite-plugin-pwa` emits the manifest (name, short name, 192/512 icons, start URL, standalone, theme colour), Workbox service worker, viewport meta and an HTTPS deployment target. |
| REQ-018 | The service trims `q` and treats an empty result as no keyword; the frontend omits an empty `q` from both the URL and the request. |
| REQ-019 | The input caps at 100 characters; the service counts runes, trims, and returns `400 SEARCH_TERM_TOO_LONG` with the human message from the i18n bundle. |
| REQ-020 | The frontend validates min/max before requesting and shows the inline range message; a direct API call with min > max returns `400 INVALID_PRICE_RANGE` or `400 INVALID_DURATION_RANGE`. Equal bounds are valid. |
| REQ-021 | The service ignores unknown/malformed category, destination, sort, price, duration and page values and falls back per control; the frontend applies the same fallback when parsing the URL. |
| REQ-022 | `GET /v1/destinations` includes destinations with no published tours; a selected destination with no matches returns an empty list, rendered as the destination-empty state with "See all tours". |
| REQ-023 | `GET /v1/tours/{slug}` returns `404 TOUR_NOT_FOUND` for unknown/unpublished/deleted slugs; the frontend renders the not-found state with a link to `/tours`. |
| REQ-024 | The detail request is re-issued on every load/refresh and the API filters `is_published` at read time; no stale tour payload is cached in the client. |
| REQ-025 | The service clamps `page` to `total_pages` and returns the effective `page`; the frontend rewrites the URL to the clamped value. |
| REQ-026 | Workbox precaches the app shell and uses `/offline` as the navigation fallback; the offline page offers "Try again". |
| REQ-027 | Not applicable: there is no restricted content, no identity and no permission check, so no no-permission state is implemented. |
| REQ-028 | The detail page renders an anchor to `wa.me` (primary) or `mailto:` (fallback) with the tour name pre-filled; no form, no payment, no navigation away from the site. |

Data-validation rules map to enforcement as follows:

| Rule | Enforced by |
|---|---|
| Search term length and trimming | `services/tour` rune-count + trim; typed 400 |
| Destination single value / known slug | service single-value check + `DestinationDAO.SlugExists`; ignored |
| Category enum | Go constant set in `services/tour`; ignored |
| Price bounds | `strconv.ParseInt`, `>= 0`, min ≤ max; ignored or typed 400 |
| Duration bounds | `strconv.Atoi`, `>= 1`, min ≤ max; ignored or typed 400 |
| Sort enum | Go constant set; fallback `recommended` |
| Page | `strconv.Atoi`, `>= 1`, clamp to `total_pages` |
| Slug format | service-layer `^[a-z0-9-]+$` check; 404 |
| Tour content (authored outside the site) | DB `CHECK` constraints for name length, category, duration, price and the published/description/departure-date rule; the at-least-one-image rule is enforced where content is authored, and the read API tolerates an empty gallery |

## Non-functional concerns

- **Read-only surface** — no writes, no CSRF, no idempotency, no payment
  or PII handling. This is the strongest available simplification.
- **Input validation** — every query parameter is parsed and bounded in
  the service layer before SQL; the body is irrelevant (GET only) and is
  capped at 1 MiB at the router anyway.
- **SQL injection** — all statements are parameterized; no string
  concatenation of caller input.
- **XSS** — the API returns JSON with `Content-Type: application/json`;
  React renders all catalog text as text, never `dangerouslySetInnerHTML`.
- **Secrets** — configuration comes from environment variables; the
  repository ships `.env.example`/`sample.env` with placeholders only. No
  key, token or DSN is logged.
- **Transport and headers** — HTTPS in production; the API sets CORS
  `*` (safe here because there are no cookies or credentials); nginx sets
  a restrictive CSP for the SPA.
- **Dependencies** — versions pinned in `go.mod`/`package-lock.json`; the
  ecosystem audit (`go vet`, `govulncheck`, `npm audit`) is part of
  `/go-dev`/`/fe-dev` close-out.
- **Timeouts and shutdown** — explicit `http.Server` read/write/idle
  timeouts, a 1 MiB body cap, DB pool limits, and graceful shutdown on
  SIGTERM/SIGINT with a 10s drain. The HTTP client in the frontend sets a
  timeout and aborts superseded requests.
- **Error handling** — expected/business errors are typed sentinels;
  unexpected errors are logged with `.Caller().Err(err)` at the origin and
  returned as a generic 500. No error is swallowed, and the response never
  contains internal detail.
- **Rate limiting** — deliberately not added: the surface is read-only,
  page size is fixed at 12, and page numbers are bounded by the real
  catalog. Add ingress-level rate limiting if abuse appears.
- **Seed data** — `sql_migrations/seed` carries the test fixtures (F1–F8)
  so `/go-dev`'s live tests and `/fe-dev`'s mock are built from the same
  data.

## Observability

- **Current state** — greenfield: there is no existing instrumentation,
  no `/metrics` route and no pinned nexcommon version in the target
  repository. The service will pin `nexcommon v0.3.68-swagger`, whose
  library middleware still has a nil-route dereference and an unbounded
  `r.URL.Path` fallback label.
- **Decision** — **wire once.** Construct `metrics.NewMetrics()` exactly
  once in the composition root, install the project's status-aware
  middleware over the mux router, and serve `promhttp.Handler()` at
  `GET /metrics` outside token validation. Do not also enable the library
  middleware (double observation) and do not construct `NewMetrics` twice
  (the second registration is silently ignored).
- **Implementation boundary** — one `middleware/metrics.go` that wraps
  the `http.ResponseWriter`, records the real status via `WriteHeader` /
  implicit-200 `Write`, exposes `Unwrap()` for `http.ResponseController`,
  uses the matched route template (or the fixed label `unmatched`) and
  skips `/metrics` and `OPTIONS`. Labels: `path` (template), `method`,
  `status`. No IDs, query strings, slugs or other high-cardinality values.
- **Feature-specific metrics** — none needed. The standard request
  histogram answers "is the catalog API healthy and how slow is the
  listing"; a separate business counter would be invented, not required.
- **Verification** — an `httptest` test scrapes `/metrics` after one 200
  and one 404 request and asserts two distinct `status` labels, a route
  template label rather than a raw path, and that `/metrics` itself is not
  counted. `/go-dev` reports the scrape output as evidence.

## Planned breaking changes

None. This is the first feature of a new service and no existing consumer
depends on any endpoint.

## Implementation Plan

- PART-1: Data model and migrations — create the three tables, constraints
  and indexes in one `sql_migrations/main` batch, plus the F1–F8 seed
  fixtures; deliverable: a fresh PostgreSQL applies cleanly and the seed
  reproduces the fixtures.
- PART-2: Backend read model — config, DAOs, query parsing/fallback,
  typed business errors and i18n bundles; deliverable: unit-testable
  service layer that turns query parameters into one correct SQL read.
- PART-3: Backend HTTP API — the five public routes, `WhitelistValidator`,
  swagger generation, health endpoint and status-aware metrics;
  deliverable: a running API whose responses match this document and whose
  generated `openapi.yaml` matches the route table.
- PART-4: Backend verification — DB, service and endpoint tests, the live
  Postgres smoke run, and the metrics scrape evidence; deliverable: a
  green `go test ./...` and a verified live stack.

PART-2 depends on PART-1, PART-3 on PART-2, and PART-4 closes the backend.
There is no frontend PART ID: `/go-release` maps every PART here to a
merged `/go-dev` PR in `vacasky-svc-code`, and `/fe-dev` records no PART
in its results, so a frontend-only PART could never satisfy that gate.

**Frontend delivery (no PART ID)** is sequenced by `/fe-dev` from this
document's `## Frontend` section, after PART-3's contract exists. In
order: (1) Vite scaffold, tokens, Ant Design theme, router, API
client/adapters/services, PWA shell and offline page; (2) Home — hero
search, featured tours and featured destinations with independent
loading/empty/error states, matching the approved composition at 1440×900
and 360px; (3) tour listing and detail — URL-backed search, filters,
sort and page with debounce/abort, skeletons, empty/error states, detail
page and enquiry action; (4) cross-stack verification — contract check
against the generated OpenAPI, Playwright flows at 360px and 1440px,
accessibility and PWA checks, and screenshots.

## Open decisions and gaps

- **`nexcomponent-ui` is unavailable** in this environment. The frontend
  uses Ant Design + local components as the documented fallback; this is
  recorded as a known gap, not an invented import.
- **Brand assets** — the wordmark is set in Anton and the PWA icons are
  produced from a simple text mark until the real logo is supplied
  (`UIMap.md` records the same gap).
- **Enquiry values** — `VITE_WHATSAPP_NUMBER` and `VITE_CONTACT_EMAIL`
  ship as placeholders; real values must be supplied before launch.
- **Photography** — tour and destination images are URLs on the record;
  development uses neutral placeholders until real licensed images are
  authored.
- **Screenshot sections outside scope** — About, Gallery, Testimonial,
  Values, Blog, Sign In and date search are not built; `spec.md` excludes
  them and `UIMap.md` resolved the Home structure without them. This is a
  deliberate scope decision, stated so it cannot be mistaken for an
  oversight.

## Guard results

- stack_or_integration: covered — `go` stack decided with reason; the
  store, framework and response envelope were verified against the real
  nexcommon source; no dependency is assumed to exist.
- components: covered — routes, screens, services, DAOs, tables and
  operational endpoints enumerated; public authorization decided
  explicitly; the destination filter-options endpoint is named and scoped
  to the consuming page.
- data_design: covered — `database.md` records the draft ERD, the
  normalization review and the batched migration plan.
- spec_traceability: covered — one line per REQ-001..REQ-028, with the
  data-validation enforcement table.
- non_functional_concerns: covered — read-only surface, validation,
  injection/XSS/secrets/headers, timeouts/shutdown, error handling,
  observability decision and verification described above.
