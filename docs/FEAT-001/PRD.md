---
feature_code: FEAT-001
service: vacasky-svc
spec_version: 1
last_updated: 2026-11-09
---

# FEAT-001 — Tour & Travel Agency Website (PRD)

## Overview

vacasky has no public website today, so prospective travelers cannot see
what tours the agency offers, compare them, or find one for the destination
they want to visit. This feature adds a public browsing site: a homepage of
featured tours and destinations, a searchable and filterable tour listing,
and a tour detail page with an enquiry link. No booking, account, or payment
is included in this pass. See [spec.md](spec.md) for the full requirement
detail.

## Product Goal

Let an anonymous visitor discover vacasky's tours, narrow them down to the
ones that fit their destination, category, price, and duration, and open a
tour's detail page with enough information to start an enquiry — with a
simple, fast, phone-friendly site and no purchase flow yet.

## Features

| Feature | Description | Expected behavior |
|---|---|---|
| Homepage | Featured tours and destinations, plus a way into the full catalog | Up to 6 featured tours and 6 featured destinations in the agency's order; selecting one opens its detail page or that destination's filtered listing (REQ-001, REQ-002, REQ-003) |
| Tour listing | Every published tour, paginated | All published tours by default, 12 per page; page numbers past the end clamp to the last page (REQ-004, REQ-025) |
| Keyword search | Free-text search box | Case-insensitive match on tour name or destination; empty/whitespace means no keyword; trimmed and limited to 100 characters, with a human-readable message when exceeded (REQ-005, REQ-018, REQ-019) |
| Filters | Destination, category, price range, duration range | Combined filters return only tours satisfying all of them; invalid min/max ranges are explained, unknown values fall back to the default view, and clear-all restores the full list (REQ-006, REQ-020, REQ-021) |
| Live results | Results update as the visitor edits search/filters | No full page reload, and a slow earlier response never overwrites a newer one (REQ-007) |
| Tour detail | Full tour information | Name, destination, duration, price per person in IDR, description, highlights, inclusions, images, and departure dates (REQ-009) |
| Enquiry action | Conversion path on the detail page | An "Enquire about this tour" action opens email or WhatsApp with the tour name filled in; no form submission and no payment (REQ-028) |
| Shareable listing | URL carries the listing state | Search, filters, sort, and page are in the URL, so a copied link reopens the same results and back/forward works (REQ-010) |
| Data states | Loading, empty, and error behaviour | Loading shows a skeleton/spinner; no matches shows a plain empty state with a clear action; failures show a plain message and a retry, never raw errors (REQ-011, REQ-012, REQ-013) |
| Tour not found | Missing or unpublished tour | A clear "tour not found" page with a link back to the listing, HTTP 404, and the same state if the tour is unpublished while being viewed (REQ-023, REQ-024) |
| Public access | No login | Every browsing action is available to anonymous visitors; there is no restricted content (REQ-014) |
| Phone, accessibility, PWA | House standards | Works from 360px to desktop without horizontal scroll, 44px touch targets, semantic/labelled/keyboard-operable UI with contrast and alt text, and an installable PWA shell with an offline page (REQ-015, REQ-016, REQ-017, REQ-026) |

Deferred to a later pass: booking, payment, accounts, contact-form
submission, reviews, multi-language/currency, admin content management, and
date-based availability search/filtering.
