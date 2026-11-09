import {
  getDestinationOptions,
  getFeaturedDestinations,
  getFeaturedTours,
  getTour,
  searchTours,
} from '../api/catalogApi';
import {
  toDestinationCard,
  toDestinationOption,
  toTour,
  toTourDetail,
  toTourPage,
} from '../api/adapters/catalogAdapter';

// Every catalogue response uses the contract's success envelope. Anything
// else is a contract violation, not a renderable empty state.
export function payloadOf(envelope) {
  if (!envelope || envelope.success !== true || !envelope.payload) {
    throw {
      code: 'INTERNAL_ERROR',
      status: 0,
      message: 'Something went wrong on our side. Please try again.',
    };
  }
  return envelope.payload;
}

export async function fetchFeaturedTours(signal) {
  const payload = payloadOf(await getFeaturedTours(signal));
  return (payload.tours || []).slice(0, 6).map(toTour);
}

export async function fetchFeaturedDestinations(signal) {
  const payload = payloadOf(await getFeaturedDestinations(signal));
  return (payload.destinations || []).slice(0, 6).map(toDestinationCard);
}

export async function fetchDestinationOptions(signal) {
  const payload = payloadOf(await getDestinationOptions(signal));
  return (payload.destinations || []).map(toDestinationOption);
}

export async function fetchTours(params, signal) {
  return toTourPage(payloadOf(await searchTours(params, signal)));
}

export async function fetchTour(slug, signal) {
  return toTourDetail(payloadOf(await getTour(slug, signal)));
}
