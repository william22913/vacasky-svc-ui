import client from './client';

function pathFor(segment) {
  return `/api/v1${segment}`;
}

export async function getHome(signal) {
  const { data } = await client.get(pathFor('/home'), { signal });
  return data;
}

export function serializeTourSearch(params = {}) {
  const search = new URLSearchParams();

  if (params.q) search.set('q', params.q);
  for (const value of params.destination || []) search.append('destination', value);
  for (const value of params.category || []) search.append('category', value);
  if (params.badge) search.set('badge', params.badge);
  if (params.priceMin != null) search.set('minPrice', String(params.priceMin));
  if (params.priceMax != null) search.set('maxPrice', String(params.priceMax));
  if (params.durationMin != null) search.set('durationMin', String(params.durationMin));
  if (params.durationMax != null) search.set('durationMax', String(params.durationMax));
  if (params.sort) search.set('sort', params.sort);
  if (params.page != null) search.set('page', String(params.page));
  if (params.pageSize != null) search.set('pageSize', String(params.pageSize));

  return search;
}

export async function searchTours(params, signal) {
  const search = serializeTourSearch(params);
  const query = search.toString();
  const { data } = await client.get(pathFor(`/tours${query ? `?${query}` : ''}`), { signal });
  return data;
}

export async function getTourFilters(signal) {
  const { data } = await client.get(pathFor('/tours/filters'), { signal });
  return data;
}

export async function getTour(slug, signal) {
  const { data } = await client.get(pathFor(`/tours/${encodeURIComponent(slug)}`), { signal });
  return data;
}
