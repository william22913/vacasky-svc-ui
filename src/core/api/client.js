import axios from 'axios';
import { normalizeApiError } from '../utils/errors';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

// The only place the API origin is configured. Empty means same-origin, which
// is what the nginx deployment proxies to the Go service.
export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: { Accept: 'application/json' },
});

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export default client;
