---
feature_code: FEAT-001
service: vacasky-svc
locked_version: 1
last_updated: 2026-11-09
---

# FEAT-001 — Technical Requirements Document

> Overview summary only — see `architecture.md` for the full design and
> its rationale.

## Overview

A public, read-only tour & travel catalogue behind a React SPA. The Go
service exposes five anonymous `GET` endpoints — two Home featured lists,
the filtered/sorted/paginated tour listing, one tour by slug, and the
destination filter options — over three PostgreSQL tables
(`destinations`, `tours`, `tour_images`). The React app renders Home, the
tour listing, the tour detail page and an offline page, keeps all browse
state in the URL, and starts an enquiry as an outbound WhatsApp or email
link. No writes, no accounts, no payments, no external integrations and no
admin surface.

## Technical Goals

- Serve every screen from five read endpoints, with the response envelope,
  request-id header and error shape produced by nexcommon rather than
  re-invented per route.
- Keep the whole API anonymous. There is no token, no session, no cookie
  and no role, so every route uses `WhitelistValidator` and the service
  needs no Redis and no authorization API.
- Push filter fallback into the service layer: an unknown or malformed
  destination, category, price bound, duration bound or sort is dropped
  and the request falls back to the broader view; only an over-long search
  term and an inverted numeric range are client errors (`400`), and an
  unknown or unpublished slug is `404`.
- Return the listing as one page of at most 12 tours plus
  `total`/`total_pages`, with the **effective** page after clamping, so the
  client can keep the URL honest without a second request.
- Keep search a case-insensitive substring over tour and destination names
  using `strpos(lower(...))` — literal `%` and `_` need no escaping, and no
  full-text index is justified for a catalogue of dozens of rows.
- Model publication and deletion separately: `is_published` is a business
  flag, soft delete is `is_deleted`/`deleted_at`/`deleted_by`, and every
  public query filters both.
- Address rows externally by `slug` (unique, `^[a-z0-9-]+$`) and keep the
  `BIGSERIAL id` internal.
- Treat the URL as the frontend's source of truth for `q`, the four filter
  pairs, `sort` and `page`; debounce typing, abort superseded requests and
  let only the newest response update state.
- Ship one build that is the PWA: manifest, service worker, app-shell
  cache and an `/offline` navigation fallback, installable and responsive
  from 360px.
- Wire request metrics **once**, with a real status label and a bounded
  route template, because the pinned nexcommon middleware reports `200`
  for every response and falls back to the raw path.

## Technology Stack

| Area | Tool | Purpose |
|---|---|---|
| Language/runtime | Go 1.27 | Organisation default; greenfield repos, so the standard stack applies unchanged. |
| Shared library | `nexcommon v0.3.68-swagger` | Response envelope, `WrapService`, `WhitelistValidator`, typed error sentinels, i18n bundles, health, migrations. |
| HTTP router | `gorilla/mux` via nexcommon | `/v1` prefix, CORS, explicit server timeouts, 1 MiB body cap. |
| Persistence | PostgreSQL 15+ (`database/sql` + pgx) | Three tables; parameterized reads only. |
| Migrations | `sql-migrate` | Four batches: destinations, tours, tour_images, seed. |
| API docs | nexcommon swagger generator | `openapi.yaml` generated after route registration; `/inspect` UI. |
| Observability | Prometheus + `promhttp` | `/metrics` outside token validation, status-aware middleware, no feature-specific collector. |
| Frontend | React 18.2 + Vite 5 + JSX | House frontend stack; no TypeScript. |
| UI layer | Ant Design 4.24 + local components | `nexcomponent-ui` is unavailable in this environment — documented fallback, swap points named. |
| Routing / HTTP | `react-router-dom` 6, `axios` 1.7 | Four routes; one configured API client, adapters → services → hooks → pages. |
| PWA | `vite-plugin-pwa` (Workbox) | Manifest, precached app shell, `/offline` fallback. |
| Fonts | `@fontsource/anton`, `@fontsource/inter` | Self-hosted display and body type from the approved design. |
| Tests | Go table-driven + httptest; vitest + Testing Library; Playwright | API contract, frontend logic, and desktop/mobile flows. |
