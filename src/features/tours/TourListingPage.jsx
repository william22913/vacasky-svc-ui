import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { fetchDestinationOptions } from '../../core/services/catalogService';
import { formatCount } from '../../core/utils/format';
import { useApiResource } from '../../helpers/useApiResource';
import { useDebouncedValue } from '../../helpers/useDebouncedValue';
import { FilterFields } from '../../components/FilterFields';
import { Pagination } from '../../components/Pagination';
import { SearchField } from '../../components/SearchField';
import { StateBlock } from '../../components/StateBlock';
import { TourCard, TourCardSkeleton } from '../../components/TourCard';
import {
  PAGE_SIZE,
  MAX_SEARCH_LENGTH,
  buildListingSearch,
  countActiveFilters,
  hasActiveQuery,
  parseListingParams,
} from './listingParams';
import { useTourListing } from './useTourListing';

const EMPTY_DRAFT = {
  destination: null,
  category: null,
  priceMin: null,
  priceMax: null,
  durationMin: null,
  durationMax: null,
  sort: 'recommended',
};

function draftFrom(params) {
  return {
    destination: params.destination,
    category: params.category,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    durationMin: params.durationMin,
    durationMax: params.durationMax,
    sort: params.sort,
  };
}

function isInvalidRange(draft) {
  if (draft.priceMin != null && draft.priceMax != null && draft.priceMin > draft.priceMax) return 'price';
  if (draft.durationMin != null && draft.durationMax != null && draft.durationMin > draft.durationMax) {
    return 'duration';
  }
  return null;
}

export function TourListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => parseListingParams(searchParams), [searchParams]);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const destinations = useApiResource(fetchDestinationOptions, []);
  const listing = useTourListing(params);

  const [keyword, setKeyword] = useState(params.q);
  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const [draft, setDraft] = useState(() => draftFrom(params));
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const [rangeError, setRangeError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDraft, setDrawerDraft] = useState(() => draftFrom(params));
  const drawerDraftRef = useRef(drawerDraft);
  drawerDraftRef.current = drawerDraft;
  const [drawerRangeError, setDrawerRangeError] = useState(null);
  const resultsRef = useRef(null);

  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  // Stable identity: effects that write the URL must not re-run merely because
  // react-router hands back a new setSearchParams after each navigation.
  const updateParams = useCallback((patch, { replace = false } = {}) => {
    const next = { ...paramsRef.current, ...patch };
    if (!Object.prototype.hasOwnProperty.call(patch, 'page')) next.page = 1;
    setSearchParamsRef.current(buildListingSearch(next), { replace });
  }, []);

  useEffect(() => {
    setKeyword(params.q);
  }, [params.q]);

  const { destination, category, priceMin, priceMax, durationMin, durationMax, sort } = params;

  useEffect(() => {
    setDraft({
      destination,
      category,
      priceMin,
      priceMax,
      durationMin,
      durationMax,
      sort,
    });
    setRangeError(null);
  }, [destination, category, priceMin, priceMax, durationMin, durationMax, sort]);

  useEffect(() => {
    const next = debouncedKeyword.trim().slice(0, MAX_SEARCH_LENGTH);
    if (next === paramsRef.current.q) return;
    updateParams({ q: next }, { replace: true });
  }, [debouncedKeyword, updateParams]);

  // A destination that no longer exists drops back to "any destination".
  useEffect(() => {
    if (destinations.status !== 'success' || !destination) return;
    if (!destinations.data.some((item) => item.slug === destination)) {
      updateParams({ destination: null }, { replace: true });
    }
  }, [destinations.status, destinations.data, destination, updateParams]);

  // The server clamps out-of-range pages; mirror that back into the URL.
  useEffect(() => {
    if (listing.status !== 'success' || !listing.data) return;
    const totalPages = listing.data.totalPages;
    if (totalPages > 0 && params.page > totalPages) {
      updateParams({ page: totalPages }, { replace: true });
    }
  }, [listing.status, listing.data, params.page, updateParams]);

  const applyKeyword = (value) => {
    const next = value.trim().slice(0, MAX_SEARCH_LENGTH);
    setKeyword(next);
    updateParams({ q: next }, { replace: true });
  };

  const handleFieldChange = (patch) => {
    setDraft((current) => ({ ...current, ...patch }));
    if ('destination' in patch) {
      updateParams({ destination: patch.destination });
    } else if ('category' in patch) {
      updateParams({ category: patch.category });
    } else if ('sort' in patch) {
      updateParams({ sort: patch.sort });
    }
  };

  const commitRange = (kind) => {
    const current = draftRef.current;
    const min = kind === 'price' ? current.priceMin : current.durationMin;
    const max = kind === 'price' ? current.priceMax : current.durationMax;
    if (min != null && max != null && min > max) {
      setRangeError(kind);
      return;
    }
    setRangeError(null);
    const active = paramsRef.current;
    if (
      (kind === 'price' && min === active.priceMin && max === active.priceMax) ||
      (kind === 'duration' && min === active.durationMin && max === active.durationMax)
    ) {
      return;
    }
    updateParams(
      kind === 'price' ? { priceMin: min, priceMax: max } : { durationMin: min, durationMax: max }
    );
  };

  const clearAll = () => {
    setKeyword('');
    setDraft(EMPTY_DRAFT);
    setRangeError(null);
    setSearchParams(new URLSearchParams());
    window.requestAnimationFrame(() => document.getElementById('listing-search')?.focus());
  };

  const openDrawer = () => {
    setDrawerDraft(draftRef.current);
    setDrawerRangeError(null);
    setDrawerOpen(true);
  };

  const validateDrawerRange = (kind) => {
    const draftNow = drawerDraftRef.current;
    const min = kind === 'price' ? draftNow.priceMin : draftNow.durationMin;
    const max = kind === 'price' ? draftNow.priceMax : draftNow.durationMax;
    setDrawerRangeError(min != null && max != null && min > max ? kind : null);
  };

  const applyDrawer = () => {
    const draftNow = drawerDraftRef.current;
    const invalid = isInvalidRange(draftNow);
    if (invalid) {
      setDrawerRangeError(invalid);
      return;
    }
    setDrawerRangeError(null);
    updateParams({
      destination: draftNow.destination,
      category: draftNow.category,
      priceMin: draftNow.priceMin,
      priceMax: draftNow.priceMax,
      durationMin: draftNow.durationMin,
      durationMax: draftNow.durationMax,
      sort: draftNow.sort,
    });
    setDrawerOpen(false);
  };

  const goToPage = (page) => {
    updateParams({ page });
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ block: 'start' });
      resultsRef.current?.focus({ preventScroll: true });
    });
  };

  const totalItems = listing.data?.total ?? 0;
  const activeFilters = countActiveFilters(params);
  const hasQuery = hasActiveQuery(params);
  const destinationName =
    destination && destinations.status === 'success'
      ? destinations.data.find((item) => item.slug === destination)?.name
      : null;
  const destinationOnly =
    Boolean(destinationName) &&
    !params.q &&
    !category &&
    priceMin == null &&
    priceMax == null &&
    durationMin == null &&
    durationMax == null;

  let countText = 'Loading tours';
  if (listing.status === 'success') countText = formatCount(totalItems, 'tour');
  if (listing.status === 'error') countText = 'Tours are unavailable right now';

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">Every place we sail, trek and walk</p>
          <h1 className="page-head__title">Tours</h1>
          <p className="page-head__intro">
            Browse all published trips, then narrow by destination, category, price or duration.
          </p>
          <div className="page-head__search">
            <SearchField
              id="listing-search"
              label="Search tours"
              placeholder="Search tours by name or destination"
              value={keyword}
              onChange={setKeyword}
              onSubmit={applyKeyword}
            />
          </div>
          {params.searchTooLong ? (
            <p className="filter-bar__hint" role="status">
              Search is limited to 100 characters.
            </p>
          ) : null}
        </div>
      </section>

      <div className="container">
        <div className="filter-bar filter-bar--desktop">
          <FilterFields
            idPrefix="desktop"
            destinations={destinations.data || []}
            value={draft}
            onChange={handleFieldChange}
            onCommitRange={commitRange}
            rangeError={rangeError}
          />
          <div className="filter-bar__actions">
            {hasQuery ? (
              <Button shape="round" onClick={clearAll}>
                Clear all
              </Button>
            ) : null}
            {destinations.status === 'error' ? (
              <Button type="link" onClick={destinations.retry}>
                Reload destinations
              </Button>
            ) : null}
          </div>
          {params.priceError ? (
            <p className="filter-bar__error" role="alert">
              Minimum price must be lower than maximum price.
            </p>
          ) : null}
          {params.durationError ? (
            <p className="filter-bar__error" role="alert">
              Minimum duration must be lower than maximum duration.
            </p>
          ) : null}
        </div>

        <div className="listing__toolbar">
          <h2 className="visually-hidden" id="results-heading" ref={resultsRef} tabIndex={-1}>
            Tour results
          </h2>
          <p className="results-count" aria-live="polite">
            {countText}
          </p>
          <Button
            className="filters-toggle"
            shape="round"
            size="large"
            icon={<FilterOutlined />}
            onClick={openDrawer}
          >
            Filters
            {activeFilters > 0 ? <span className="filter-count">{activeFilters}</span> : null}
          </Button>
        </div>

        <div aria-busy={listing.status === 'loading'}>
          {listing.status === 'loading' ? (
            <div className="card-grid" aria-hidden="true">
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <TourCardSkeleton key={index} />
              ))}
            </div>
          ) : null}

          {listing.status === 'error' ? (
            <StateBlock
              tone="error"
              actions={
                <Button type="primary" shape="round" onClick={listing.retry}>
                  Try again
                </Button>
              }
            >
              We couldn&apos;t load tours. Check your connection and try again.
            </StateBlock>
          ) : null}

          {listing.status === 'success' && totalItems === 0 && destinationOnly ? (
            <StateBlock
              actions={
                <Button type="primary" shape="round" onClick={() => updateParams({ destination: null })}>
                  See all tours
                </Button>
              }
            >
              No tours in {destinationName} yet.
            </StateBlock>
          ) : null}

          {listing.status === 'success' && totalItems === 0 && !destinationOnly ? (
            <StateBlock
              actions={
                <Button type="primary" shape="round" onClick={clearAll}>
                  Clear search and filters
                </Button>
              }
            >
              No tours match your search.
            </StateBlock>
          ) : null}

          {listing.status === 'success' && totalItems > 0 ? (
            <div className="card-grid">
              {listing.data.tours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} />
              ))}
            </div>
          ) : null}
        </div>

        {listing.status === 'success' ? (
          <Pagination meta={listing.data} onPage={goToPage} />
        ) : null}
      </div>

      <Drawer
        title="Filters"
        placement="bottom"
        height="88%"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="drawer-fields">
          <FilterFields
            idPrefix="drawer"
            destinations={destinations.data || []}
            value={drawerDraft}
            onChange={(patch) => setDrawerDraft((current) => ({ ...current, ...patch }))}
            onCommitRange={validateDrawerRange}
            rangeError={drawerRangeError}
          />
        </div>
        <div className="drawer-actions">
          <Button type="primary" size="large" shape="round" onClick={applyDrawer}>
            Apply filters
          </Button>
          <Button
            size="large"
            shape="round"
            onClick={() => {
              setDrawerOpen(false);
              clearAll();
            }}
          >
            Clear all
          </Button>
        </div>
      </Drawer>
    </>
  );
}
