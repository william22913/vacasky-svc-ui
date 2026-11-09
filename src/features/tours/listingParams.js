import { isValidSlug } from '../../core/utils/slug';

export const PAGE_SIZE = 12;
export const MAX_SEARCH_LENGTH = 100;
export const MAX_MULTI = 10;

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'duration_asc', label: 'Duration: shortest first' },
  { value: 'duration_desc', label: 'Duration: longest first' },
];

const SORT_VALUES = new Set(SORT_OPTIONS.map((option) => option.value));

function toInt(value, minimum = 0) {
  if (value == null || value === '') return null;
  if (!/^\d+$/.test(String(value))) return null;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < minimum) return null;
  return number;
}

function slugsOf(values, seen = new Set()) {
  return values.filter((value) => {
    if (!isValidSlug(value) || seen.has(value)) return false;
    seen.add(value);
    return true;
  }).slice(0, MAX_MULTI);
}

export function parseListingParams(searchParams) {
  const rawQ = (searchParams.get('q') || '').trim();
  const sortParam = searchParams.get('sort');
  const priceMin = toInt(searchParams.get('priceMin'), 0);
  const priceMax = toInt(searchParams.get('priceMax'), 0);
  const durationMin = toInt(searchParams.get('durationMin'), 1);
  const durationMax = toInt(searchParams.get('durationMax'), 1);

  const priceError = priceMin != null && priceMax != null && priceMin > priceMax;
  const durationError = durationMin != null && durationMax != null && durationMin > durationMax;

  return {
    q: rawQ.slice(0, MAX_SEARCH_LENGTH),
    destination: slugsOf(searchParams.getAll('destination')),
    category: slugsOf(searchParams.getAll('category')),
    priceMin,
    priceMax,
    durationMin,
    durationMax,
    sort: SORT_VALUES.has(sortParam) ? sortParam : 'recommended',
    page: Math.max(1, toInt(searchParams.get('page'), 1) ?? 1),
    searchTooLong: rawQ.length > MAX_SEARCH_LENGTH,
    invalidRange: priceError || durationError,
    priceError,
    durationError,
  };
}

export function buildListingSearch(params) {
  const search = new URLSearchParams();

  if (params.q) search.set('q', String(params.q).trim().slice(0, MAX_SEARCH_LENGTH));
  for (const slug of params.destination || []) search.append('destination', slug);
  for (const slug of params.category || []) search.append('category', slug);
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
    (params.destination.length ? 1 : 0) +
    (params.category.length ? 1 : 0) +
    (params.priceMin != null || params.priceMax != null ? 1 : 0) +
    (params.durationMin != null || params.durationMax != null ? 1 : 0)
  );
}

export function hasActiveQuery(params) {
  return Boolean(params.q) || params.sort !== 'recommended' || countActiveFilters(params) > 0;
}
