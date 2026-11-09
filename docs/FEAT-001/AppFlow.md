---
feature_code: FEAT-001
service: vacasky-svc
spec_version: 1
last_updated: 2026-11-09
---

# FEAT-001 — App Flow

<!-- BEGIN:DOCPREP -->
## Overview

An anonymous visitor lands on vacasky's homepage, discovers tours through
the featured sections or the searchable listing, and opens a tour's detail
page to read about it and start an enquiry. There is no account, booking, or
payment step — every browsing action is public.

## Key User Journeys

- **Discover from the homepage (REQ-001, REQ-002):** Visitor opens the
  homepage → sees up to six featured tours and six featured destinations →
  selects a featured tour → that tour's detail page opens.
- **Browse a destination (REQ-003):** Visitor selects a featured
  destination → the tour listing opens already filtered to that destination
  → visitor narrows further or opens a tour (REQ-006, REQ-008).
- **Search for a tour (REQ-005):** Visitor types a keyword into the search
  box → the listing updates without a full reload to tours whose name or
  destination matches → a slow earlier response never replaces newer
  results (REQ-007).
- **Filter a long list (REQ-006):** Visitor combines destination, category
  (Beach, Mountain, City, Culture, Adventure), price range, and/or duration
  range → only tours satisfying every applied filter remain → visitor
  clears the filters to see the full list again (REQ-021).
- **Open and read a tour (REQ-008, REQ-009):** Visitor selects a tour from
  the listing → the detail page shows name, destination, duration, price
  per person in IDR, description, highlights, inclusions, images, and
  departure dates.
- **Start an enquiry (REQ-028):** Visitor reads a tour and selects
  "Enquire about this tour" → their email app or WhatsApp opens with the
  tour name filled in; no form is submitted and no payment is taken.
- **Share a listing (REQ-010):** Visitor copies the listing URL after
  searching/filtering → the recipient opens the same results, and the
  sender's browser back/forward restores prior views.
- **Hit a dead end (REQ-012, REQ-013):** A search or filter matches nothing
  → the visitor sees a plain empty state with a one-click clear action; if
  data fails to load → a plain message and a retry, never a raw error.
- **Open a missing tour (REQ-023, REQ-024):** Visitor follows a link to a
  tour that doesn't exist or is no longer published → a "tour not found"
  page with a link back to the listing, HTTP 404; the same state appears if
  the tour is unpublished while it is being viewed.
- **Use a phone or go offline (REQ-015, REQ-017, REQ-026):** Visitor opens
  the site from a 360px phone → no horizontal scrolling and 44px touch
  targets; the site is installable as a PWA, and when offline it serves the
  app shell and an offline page rather than a browser network error.

## Main Pages / Actions

- **Home** — featured tours, featured destinations, and the entry point to
  the tour listing and search.
- **Tour listing** — all published tours with search, destination/category/
  price/duration filters, sort, pagination, empty state, and error state;
  state is kept in the URL.
- **Tour detail** — full tour information and the "Enquire about this tour"
  action.
- **Tour not found** — shown for a missing or unpublished tour, with a link
  back to the listing.
- **Offline page** — served by the PWA service worker when the device has
  no connection.
<!-- END:DOCPREP -->

<!-- BEGIN:CODEPREP -->
## Frontend routes

| Route | Screen | Data source | Notes |
|---|---|---|---|
| `/` | Home | `GET /v1/home/featured-tours`, `GET /v1/home/featured-destinations` | Hero search submits to `/tours?q=…`. |
| `/tours` | Tour listing | `GET /v1/tours`, `GET /v1/destinations` | URL query keys: `q`, `destination`, `category`, `priceMin`, `priceMax`, `durationMin`, `durationMax`, `sort`, `page`. |
| `/tours/:slug` | Tour detail | `GET /v1/tours/{slug}` | Enquiry action is an outbound `wa.me`/`mailto:` link. |
| `/offline` | Offline page | none | Service-worker navigation fallback. |
| `*` | Not found | none | Link back to `/tours`. |

The not-found screen for a missing or unpublished tour is rendered by
`/tours/:slug` when the API answers `404 TOUR_NOT_FOUND`; it is not a
separate route.

## Backend endpoints called

| Method | Path | Called from | Purpose |
|---|---|---|---|
| GET | `/v1/home/featured-tours` | Home | Up to six featured tours. |
| GET | `/v1/home/featured-destinations` | Home | Up to six featured destinations. |
| GET | `/v1/tours` | Tour listing | Filtered, sorted, paginated published tours. |
| GET | `/v1/tours/{slug}` | Tour detail | One published tour. |
| GET | `/v1/destinations` | Tour listing | Destination filter options. |

All five are public (`WhitelistValidator`); none requires a token,
session or account.

## Key components

`SiteHeader`, `SiteFooter`, `Hero`, `SearchField`, `TourCard`,
`DestinationCard`, `FilterBar`, `FilterDrawer` (mobile), `SortSelect`,
`RangeInputs`, `Pagination`, `SkeletonCard`, `EmptyState`, `ErrorState`,
`ImageGallery`, `EnquiryButton`. Data flows adapter → service → hook →
page; pages never call axios directly.

## Journey → route mapping

- **Discover from the homepage (REQ-001, REQ-002):** `/` → `TourCard` →
  `/tours/:slug`.
- **Browse a destination (REQ-003):** `/` → `DestinationCard` →
  `/tours?destination=<slug>`.
- **Search / filter / sort / paginate (REQ-005, REQ-006, REQ-007,
  REQ-010, REQ-021, REQ-025):** all happen inside `/tours` by rewriting
  the URL query string; the page component never navigates away.
- **Read a tour and enquire (REQ-009, REQ-028):** `/tours/:slug` →
  `EnquiryButton` → external WhatsApp/email destination.
- **Dead end (REQ-012, REQ-013, REQ-023, REQ-024):** empty and error
  states render inside `/tours` and `/tours/:slug`; the missing-tour state
  links back to `/tours`.
- **Phone or offline (REQ-015, REQ-017, REQ-026):** every route is
  responsive from 360px; the service worker serves `/offline` when the
  network is unavailable.
<!-- END:CODEPREP -->
