---
feature_code: FEAT-001
service: vacasky-svc
locked_version: 1
last_updated: 2026-11-09
---

# FEAT-001 — Backend Schema Overview

> Summary only — see `database.md` for the full schema-designer record
> and `architecture.md`'s data-access section for the query rationale.

## Overview

This feature creates the service's entire schema: `destinations`,
`tours` and `tour_images`, in that order of dependency, plus the F1–F8
seed fixtures from `testcase.md`. It is a read-only catalogue — the API
never writes — so the schema exists to make five reads correct and cheap,
not to support a workflow.

## Data Model

- **`destinations`** — `id` (BIGSERIAL), `slug` (UNIQUE, public
  identifier), `name`, `image_url`, `image_alt`, `is_featured`,
  `featured_order` (NULL = unordered, sorted `NULLS LAST`), standard audit
  and split soft-delete columns. One image column, because a destination
  card shows exactly one image; no gallery table.
- **`tours`** — `id`, `slug` (UNIQUE), `name`, `destination_id` FK →
  `destinations.id` `ON DELETE RESTRICT`, `category`
  (`CHECK` in `Beach|Mountain|City|Culture|Adventure`),
  `duration_days` (`CHECK >= 1`), `price_per_person` (`BIGINT`, whole
  IDR, `CHECK >= 0`), `description`, `highlights TEXT[]`,
  `included TEXT[]`, `departure_dates DATE[]`, `is_published`,
  `is_featured`, `featured_order`, audit and soft delete.
  A `CHECK` enforces publishability: a published tour must have a
  non-blank description and at least one departure date. An unpublished
  row may be incomplete.
- **`tour_images`** — `id`, `tour_id` FK → `tours.id` `ON DELETE CASCADE`,
  `url`, `alt`, `sort_order` (`CHECK >= 0`,
  `UNIQUE (tour_id, sort_order)` partial on live rows), audit and soft
  delete.
- **Read predicates** — every public query filters `is_deleted = FALSE`;
  every tour query also filters `is_published = TRUE`. Search is
  `strpos(lower(t.name), lower($q)) > 0 OR strpos(lower(d.name), lower($q)) > 0`,
  so no `LIKE` escaping exists. The listing runs one `COUNT(*)` and one
  `LIMIT 12 OFFSET …` inside a single read-committed transaction.
- **Indexes** — `UNIQUE (slug)` on both addressable tables; a partial
  unique index on `(tour_id, sort_order)`; `(is_published, is_deleted,
  price_per_person)` for the listing and price sort; `(destination_id,
  is_published, is_deleted)` for the destination filter and the FK check;
  two partial featured indexes for the Home queries.
- **Deliberate denormalization, stated** — `highlights`, `included` and
  `departure_dates` are arrays on `tours` rather than child tables: pure
  scalars, always read with their tour, never filtered independently. No
  `tour_count` on `destinations` (derivable, would drift). Upgrade path
  named in `database.md`: a real `tour_departure_dates` table with its own
  index if date filtering is ever added.
- **Unchanged:** nothing — the schema is new. No existing table is
  altered, so no backfill or data migration is required.

## Access Control

- **Everything is public.** The five catalogue routes go through
  nexcommon's `WhitelistValidator`, which is a no-op by design: there is
  no token, no session, no cookie and no identity in this service.
- **No roles, no permissions, no ownership.** There is no restricted
  record and no per-user data, so there is no authorization matrix to
  define and no cross-tenant leak to prevent.
- **No write path exists**, so there is no CSRF surface, no idempotency
  key and no write transaction.
- `/metrics` and `/v1/health` are public at the router but are operational
  endpoints: `/metrics` is excluded from the request-count instrumentation
  and is intended to be reachable only through the deployment's internal
  network policy.
- **Input is untrusted even so:** every query parameter is parsed and
  bounded in the service layer before SQL, every statement is
  parameterized, the path slug is checked against `^[a-z0-9-]+$`, and the
  request body is capped at 1 MiB even though no route reads one.
