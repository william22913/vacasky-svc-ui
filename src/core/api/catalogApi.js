import client from './client';

const encode = encodeURIComponent;

export async function getFeaturedTours(signal) {
  const { data } = await client.get('/v1/home/featured-tours', { signal });
  return data;
}

export async function getFeaturedDestinations(signal) {
  const { data } = await client.get('/v1/home/featured-destinations', { signal });
  return data;
}

export async function getDestinationOptions(signal) {
  const { data } = await client.get('/v1/destinations', { signal });
  return data;
}

// Maps the page's human URL keys onto the contract's snake_case parameters.
// Defaults are omitted; the service applies the documented fallbacks.
export function serializeTourSearch(params = {}) {
  const search = new URLSearchParams();
  const q = String(params.q || '').trim();

  if (q) search.set('q', q);
  if (params.destination) search.set('destination', params.destination);
  if (params.category) search.set('category', params.category);
  if (params.priceMin != null) search.set('price_min', String(params.priceMin));
  if (params.priceMax != null) search.set('price_max', String(params.priceMax));
  if (params.durationMin != null) search.set('duration_min', String(params.durationMin));
  if (params.durationMax != null) search.set('duration_max', String(params.durationMax));
  if (params.sort && params.sort !== 'recommended') search.set('sort', params.sort);
  if (params.page != null && params.page > 1) search.set('page', String(params.page));

  return search;
}

export async function searchTours(params, signal) {
  const query = serializeTourSearch(params).toString();
  const { data } = await client.get(`/v1/tours${query ? `?${query}` : ''}`, { signal });
  return data;
}

export async function getTour(slug, signal) {
  const { data } = await client.get(`/v1/tours/${encode(slug)}`, { signal });
  return data;
}
