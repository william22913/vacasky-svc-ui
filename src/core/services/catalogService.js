import {
  getHome as apiGetHome,
  getTour as apiGetTour,
  getTourFilters as apiGetTourFilters,
  searchTours as apiSearchTours,
} from '../api/catalogApi';

export function fetchHome(signal) {
  return apiGetHome(signal);
}

export function fetchTourFilters(signal) {
  return apiGetTourFilters(signal);
}

export function fetchTours(params, signal) {
  return apiSearchTours(params, signal);
}

export function fetchTour(slug, signal) {
  return apiGetTour(slug, signal);
}
