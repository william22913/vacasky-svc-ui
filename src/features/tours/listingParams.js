import { isValidSlug } from '../../core/utils/slug';

export const PAGE_SIZE = 12;
export const MAX_SEARCH_LENGTH = 100;

export const CATEGORY_OPTIONS = [
  { value: 'Beach', label: 'Beach' },
  { value: 'Mountain', label: 'Mountain' },
  { value: 'City', label: 'City' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Adventure', label: 'Adventure' },
];

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration-asc', label: 'Duration: shortest first' },
];

const SORT_VALUES = new Set(SORT_OPTIONS.map((option) => option.value));
const CATEGORY_VALUES = new Set(CATEGORY_OPTIONS.map((option) => option.value));

function wholeNumber(value, minimum = 0) {
  if (value == null || value === '') return null;
  if (!/^\d+$/.test(String(value))) return null;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < minimum) return null;
  return number;
}

// The contract accepts a single destination/category value. A repeated or
// malformed value drops that control back to its unfiltered state (REQ-021).
function singleOf(searchParams, key, allowed) {
  const values = searchParams.getAll(key);
  if (values.length !== 1) return null;
  const value = values[0];
  if (allowed === 'slug') return isValidSlug(value) ? value : null;
  return allowed.has(value) ? value : null;
}

export function parseListingParams(searchParams) {
  const rawQ = (searchParams.get('q') || '').trim();
  const priceMin = wholeNumber(searchParams.get('priceMin'), 0);
  const priceMax = wholeNumber(searchParams.get('priceMax'), 0);
  const durationMin = wholeNumber(searchParams.get('durationMin'), 1);
  const durationMax = wholeNumber(searchParams.get('durationMax'), 1);
  const sortParam = searchParams.get('sort');

  const priceError = priceMin != null && priceMax != null && priceMin > priceMax;
  const durationError = durationMin != null && durationMax != null && durationMin > durationMax;

  return {
    q: rawQ.slice(0, MAX_SEARCH_LENGTH),
    destination: singleOf(searchParams, 'destination', 'slug'),
    category: singleOf(searchParams, 'category', CATEGORY_VALUES),
    priceMin,
    priceMax,
    durationMin,
    durationMax,
    sort: SORT_VALUES.has(sortParam) ? sortParam : 'recommended',
    page: Math.max(1, wholeNumber(searchParams.get('page'), 1) ?? 1),
    searchTooLong: rawQ.length > MAX_SEARCH_LENGTH,
    invalidRange: priceError || durationError,
    priceError,
    durationError,
  };
}

export function buildListingSearch(params) {
  const search = new URLSearchParams();

  if (params.q) search.set('q', String(params.q).trim().slice(0, MAX_SEARCH_LENGTH));
  if (params.destination) search.set('destination', params.destination);
  if (params.category) search.set('category', params.category);
  if (params.priceMin != null) search.set('priceMin', String(params.priceMin));
  if (params.priceMax != null) search.set('priceMax', String(params.priceMax));
  if (params.durationMin != null) search.set('durationMin', String(params.durationMin));
  if (params.durationMax != null) search.set('durationMax', String(params.durationMax));
  if (params.sort && params.sort !== 'recommended') search.set('sort', params.sort);
  if (params.page != null && params.page > 1) search.set('page', String(params.page));

  return search;
}

export function countActiveFilters(params) {
  return (
    (params.destination ? 1 : 0) +
    (params.category ? 1 : 0) +
    (params.priceMin != null || params.priceMax != null ? 1 : 0) +
    (params.durationMin != null || params.durationMax != null ? 1 : 0)
  );
}

export function hasActiveQuery(params) {
  return Boolean(params.q) || params.sort !== 'recommended' || countActiveFilters(params) > 0;
}
