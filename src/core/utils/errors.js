export function isCanceled(error) {
  return Boolean(
    error &&
      (error.canceled ||
        error.code === 'ERR_CANCELED' ||
        error.name === 'CanceledError' ||
        error.name === 'AbortError')
  );
}

// The contract's stable codes, mapped to copy the visitor can act on. The
// server supplied message is never rendered for an unknown code.
const FRIENDLY_MESSAGES = {
  SEARCH_TERM_TOO_LONG: 'Search is limited to 100 characters.',
  INVALID_PRICE_RANGE: 'Minimum price must be lower than maximum price.',
  INVALID_DURATION_RANGE: 'Minimum duration must be lower than maximum duration.',
  TOUR_NOT_FOUND: 'This tour may have been removed or is no longer available.',
  'E-5-VAC-SRV-001': 'Something went wrong on our side. Please try again.',
  NETWORK_ERROR: 'We could not reach the server. Check your connection and try again.',
};

export const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

export function friendlyMessage(error, fallback = GENERIC_MESSAGE) {
  if (!error) return fallback;
  return FRIENDLY_MESSAGES[error.code] || fallback;
}

// Normalises the contract envelope:
//   {success: false, header: {request_id}, payload: {status, code, message}}
export function normalizeApiError(error) {
  if (isCanceled(error)) {
    return { canceled: true, code: 'CANCELED', message: 'Request canceled.' };
  }

  const response = error?.response;

  if (!response) {
    return {
      canceled: false,
      code: 'NETWORK_ERROR',
      status: 0,
      requestId: null,
      message: FRIENDLY_MESSAGES.NETWORK_ERROR,
      detail: error?.message,
    };
  }

  const payload = response.data?.payload;
  const requestId = response.data?.header?.request_id || null;

  if (payload?.code) {
    return {
      canceled: false,
      code: payload.code,
      status: response.status,
      requestId,
      message: FRIENDLY_MESSAGES[payload.code] || GENERIC_MESSAGE,
      detail: payload.message,
    };
  }

  return {
    canceled: false,
    code: response.status === 404 ? 'TOUR_NOT_FOUND' : 'E-5-VAC-SRV-001',
    status: response.status,
    requestId,
    message:
      response.status === 404
        ? FRIENDLY_MESSAGES.TOUR_NOT_FOUND
        : FRIENDLY_MESSAGES['E-5-VAC-SRV-001'],
  };
}
