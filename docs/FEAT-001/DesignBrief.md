---
feature_code: FEAT-001
service: vacasky-svc
spec_version: 1
source: UIMap.md
last_updated: 2026-11-09
---

# FEAT-001 — Design Brief (vacasky-svc)

## Overview

A public tour and travel browsing site with five screens: Home (featured
tours and destinations, plus a search entry), Tour listing (keyword, four
filters, sort, 12 per page, URL-held state), Tour detail (full tour record
and an enquiry action), Tour not found (HTTP 404 with a way back), and an
Offline page served by the PWA. There is no login, booking, payment or
account anywhere (`REQ-014`, `REQ-027`). Home is drawn; the other screens
are adapted from it and are recorded as screen specs in `UIMap.md`.

Screens: Home `/`, Tour listing `/tours`, Tour detail `/tours/:slug`, Tour
not found (same route, 404 state), Offline (service-worker fallback).

## Brand Identity

Bold editorial travel: large Anton display type over a clean white canvas,
photography-led cards, a single ocean-blue accent (`#2C7BA8`) and dark
`#111214` cards for destinations and the footer. The tone is confident and
plain, not luxury-quiet: the type does the work, the photography carries the
place, and the only saturated colour is the action colour. The design is
light-only; no dark mode is in scope.

## Color Palette

| Token | Value | Where used |
|---|---|---|
| `color/primary` | `#2C7BA8` | Primary buttons, links, active filter, focus ring, search submit |
| `color/primary-dark` | `#1F5F85` | Hover/pressed primary, link hover |
| `color/background` | `#FFFFFF` | Page background |
| `color/surface` | `#F2F4F6` | Section bands, filter panel, skeletons |
| `color/text` | `#111111` | Headings and body on white and on surface |
| `color/text-muted` | `#6B7280` | Secondary text on white only (4.84:1) |
| `color/inverse` | `#FFFFFF` | Text on primary and dark cards |
| `color/dark-card` | `#111214` | Featured destination cards, footer |
| `color/text-muted-on-surface` | `#4B5563` | Secondary text on `surface`; 6.86:1 (the lighter muted is 4.35:1 there and fails AA) |
| `color/hairline` | `#E5E7EB` | Card and input borders, dividers |
| `color/scrim` | `rgba(17, 18, 20, 0.45)` | Text over photographs, drawer backdrop |
| `color/error` | `#B42318` | Inline validation and error messages (6.48:1 on white) |
| `color/error-surface` | `#FEF3F2` | Error block background |
| `color/focus` | `#2C7BA8` | 2px focus ring with a 2px white offset |

One accent only. Error red is a status colour, never decoration. Contrast
figures are recorded in `UIMap.md` under `## Design tokens`.

## Typography

| Role | Value |
|---|---|
| Display font | Anton 400 |
| Body / UI font | Inter 400 / 500 / 600 |
| Hero H1 | Anton 400, 64/60px desktop, 40/38px phone, line-height 0.98, two lines maximum |
| Page title | Anton 400, 48/44px desktop, 34/32px phone |
| Section title | Anton 400, 32/30px desktop, 26/24px phone |
| Body | Inter 400, 16-17px, line-height 1.6 |
| Body small | Inter 400, 14px, line-height 1.5 |
| Field label | Inter 500, 14px |
| Button | Inter 600, 15px |
| Caption | Inter 400, 12px |

Anton has one weight; do not synthesise bold. Both fonts are self-hosted
with `font-display: swap`. Inter is never used for display headings.

## Spacing and Shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 (4px base).
- Container: max-width 1280px; gutters 24px phone, 32px tablet, 48px
  desktop.
- Radius lock: buttons and tags are full pill; cards and gallery are 16px;
  inputs and the search field are 12px; small chips and thumbnails are 8px.
- Elevation: `0 8px 24px rgba(17, 18, 20, 0.08)` at rest, `0 12px 32px
  rgba(17, 18, 20, 0.12)` on hover, `0 24px 64px rgba(17, 18, 20, 0.20)`
  for the mobile drawer.
- Breakpoints: 360, 640, 768, 1024, 1280, 1440. Only 1440 is drawn; the
  smaller layouts are derived.
- Focus: 2px `#2C7BA8` ring with a 2px white offset on every interactive
  element.

## Components

The design source is a screenshot with no Figma `Code` properties, and no
nexcomponent-ui package is present in this environment. Exports are
therefore **unresolved**, not invented; `/fe-dev` resolves them against the
house library or the Ant Design fallback.

| Component | Resolution status | Used on |
|---|---|---|
| Site header | unresolved | All pages |
| Wordmark ("vacasky" in Anton until the SVG arrives) | unresolved (asset missing) | Header, footer |
| Button (primary / secondary / ghost) | unresolved | All pages |
| Search field | unresolved | Home, Tour listing |
| Select (destination, category, sort) | unresolved | Tour listing |
| Number range input (price, duration) | unresolved | Tour listing |
| Tour card | unresolved (composed) | Home, Tour listing |
| Destination card | unresolved (composed dark card) | Home |
| Category tag | unresolved | Cards, detail |
| Filter bar / mobile drawer | unresolved | Tour listing |
| Pagination | unresolved | Tour listing |
| Result count live region | compose (`aria-live="polite"`) | Tour listing |
| Skeleton card | compose (CSS) | Home, Tour listing, Tour detail |
| Empty state | unresolved (`StatePage` if available) | Home sections, Tour listing |
| Error state | compose (inline block + button) | Home sections, Tour listing, Tour detail |
| Not-found / offline state | unresolved (`StatePage` if available) | Tour not found, Offline |
| Image gallery | compose (lead image + thumbnails, scroll-snap on phone) | Tour detail |
| Enquiry action | unresolved (button as an external link) | Tour detail |
| Mobile menu / drawer | unresolved | All pages under 1024px |
| Toast | not needed; feedback is inline | - |

## States and Motion

Per screen, from `UIMap.md`:

- **Home:** default, section-level loading skeletons, section-level empty
  with a "Browse all tours" link, section-level error with Retry, partial
  failure, no-permission not applicable (`REQ-011`, `REQ-013`, `REQ-027`).
- **Tour listing:** default, 12-card loading skeleton, no-match empty with
  "Clear search and filters", destination empty with "See all tours",
  error with Retry, invalid-range message, over-length search message, page
  clamp; no-permission not applicable (`REQ-004`-`REQ-013`, `REQ-020`-
  `REQ-022`, `REQ-025`, `REQ-027`).
- **Tour detail:** default, loading skeleton, error with Retry, not found
  (404), unpublished-while-viewing (`REQ-009`, `REQ-011`, `REQ-013`,
  `REQ-023`, `REQ-024`).
- **Tour not found:** 404 state with "Back to all tours" (`REQ-023`,
  `REQ-024`).
- **Offline:** cached shell plus "You're offline" and "Try again"
  (`REQ-026`).

Motion values recorded in the map:

| Motion | Duration | Easing |
|---|---|---|
| Card hover/focus lift | 160ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Button press | 120ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Focus ring | 120ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Skeleton shimmer | 1200ms | linear, loop |
| Filter drawer open | 260ms (scrim 200ms) | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Filter drawer close | 200ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Header menu open/close | 160ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Results change | instant; count announced with `aria-live="polite"` | - |
| Route change | instant; scroll to the new page top | - |

All transform and position motion is removed under
`prefers-reduced-motion: reduce`; colour and opacity transitions may stay
at 120ms. Hover motion is gated to `@media (hover: hover) and (pointer:
fine)`. There is no auto-playing carousel, scroll-jacking or parallax.

## Open design gaps

Confirmed by the designer on 2026-11-09:

- The Home section spec below the token level (arrangement and copy) is
  confirmed. The confirmation is against `UIMap.md`, not against pixels,
  because the screenshot was not available in the session; a later
  PNG/Figma check can still correct spacing.
- Tour listing, Tour detail, Tour not found and Offline are confirmed as
  adapted from Home.
- Enquiry (`REQ-028`) is WhatsApp primary with a `mailto:` fallback;
  placeholder number and address at build time, real values before launch.
- Wordmark set in Anton until an SVG is supplied; the footer reuses the
  enquiry channel; no social links.
- Photography is neutral placeholders until tour and destination records
  carry real images.

Still deferred:

- Component exports are unresolved: no Figma `Code` values and no
  nexcomponent-ui package in this environment. `/fe-dev` resolves them.
- The design reports 50 component instances on Home but does not enumerate
  them; this map groups them into component families.
