---
feature_code: FEAT-001
service: vacasky-svc
locked_version: 1
last_updated: 2026-11-09
---

# FEAT-001 — Implementation Plan Overview

> Summary only — see `architecture.md`'s `## Implementation Plan` section
> for full detail.

## Overview

Four ordered backend parts (order of work only — no timeline or estimate),
followed by a separately sequenced frontend delivery. The feature has UI
scope, but the frontend is deliberately not a PART ID: `/go-release` maps
every PART here to a merged `/go-dev` PR in `vacasky-svc-code`, and
`/fe-dev` records no PART in its results, so a frontend-only PART could
never satisfy that gate.

## Goals

Ship a public read-only catalogue API — Home featured tours and
destinations, the filtered/sorted/paginated tour listing, one tour by slug
and the destination options — on the organisation's Go + nexcommon +
PostgreSQL stack; then build the React/Vite app that renders Home, the
listing, the detail page and the offline page against that contract, with
URL-backed browse state and a WhatsApp/email enquiry action. No release
step is planned in this pass.

## Implementation Plan

| Part | What gets built | Key deliverable |
|---|---|---|
| PART-1 | Schema and seed | `sql_migrations/main/001`–`003` (destinations, tours, tour_images with checks, FKs and indexes) plus `sql_migrations/seed/001` reproducing the F1–F8 fixtures; a fresh PostgreSQL applies cleanly and the seed is re-runnable. |
| PART-2 | Backend read model | config, `DestinationDAO`/`TourDAO` interfaces and implementations, service-layer query parsing and fallback, the four typed business errors with their i18n bundle entries, and unit tests for every fallback and error path (including `q` lengths, inverted ranges, equal bounds, unknown filters, page clamping and the recommended ordering). |
| PART-3 | HTTP API and contract | the five `WrapService` routes with `WhitelistValidator`, swagger generation after route registration, `/v1/health` on the DB checker and the status-aware metrics middleware; endpoint tests for each payload, each 400/404 envelope, the empty list case and the `/metrics` 200-vs-404 scrape. |
| PART-4 | Backend verification | the throwaway-Postgres DB tests, the live smoke run against the seeded database, and the metrics scrape evidence; a green `go test ./...` and a verified live stack reported on the PR. |

PART-2 depends on PART-1, PART-3 on PART-2, and PART-4 closes the backend.
The frontend work in `vacasky-svc-ui` (Vite scaffold, tokens and Ant Design
theme, router, API client/adapters/services, PWA shell and offline page;
Home; the listing and detail pages; cross-stack verification with
Playwright at 360px and 1440px) is sequenced by `/fe-dev` from
`architecture.md`'s `## Frontend` section after PART-3's contract exists.
