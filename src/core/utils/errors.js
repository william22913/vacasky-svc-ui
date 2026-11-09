export function isCanceled(error) {
  return Boolean(
    error &&
      (error.canceled ||
        error.code === 'ERR_CANCELED' ||
        error.name === 'CanceledError' ||
        error.name === 'AbortError')
  );
}

const FRIENDLY_MESSAGES = {
  VALIDATION_ERROR: 'Some search options are not valid. Check them and try again.',
  INVALID_FILTER_RANGE: 'The minimum value must be lower than the maximum value.',
  TOUR_NOT_FOUND: 'This tour may have been removed or is no longer available.',
  INTERNAL_ERROR: 'Something went wrong on our side. Please try again.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable. Please try again shortly.',
  NETWORK_ERROR: 'We could not reach the server. Check your connection and try again.',
};

export function friendlyMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  return FRIENDLY_MESSAGES[error.code] || fallback;
}

export function normalizeApiError(error) {
  if (isCanceled(error)) {
    return { canceled: true, code: 'CANCELED', message: 'Request canceled.' };
  }

  const response = error?.response;
  const payload = response?.data?.error;
  const requestId = payload?.requestId || error?.config?.headers?.['X-Request-Id'] || null;

  if (!response) {
    return {
      canceled: false,
      code: 'NETWORK_ERROR',
      status: 0,
      requestId,
      message: FRIENDLY_MESSAGES.NETWORK_ERROR,
      detail: error?.message,
    };
  }

  if (payload?.code) {
    return {
      canceled: false,
      code: payload.code,
      status: response.status,
      requestId,
      message: FRIENDLY_MESSAGES[payload.code] || 'Request failed. Please try again.',
      detail: payload.message,
      fields: payload.details || [],
    };
  }

  if (response.status === 404) {
    return {
      canceled: false,
      code: 'NOT_FOUND',
      status: 404,
      requestId,
      message: 'We could not find what you were looking for.',
    };
  }

  if (response.status === 503) {
    return {
      canceled: false,
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
      requestId,
      message: FRIENDLY_MESSAGES.SERVICE_UNAVAILABLE,
    };
  }

  return {
    canceled: false,
    code: 'INTERNAL_ERROR',
    status: response.status,
    requestId,
    message: FRIENDLY_MESSAGES.INTERNAL_ERROR,
  };
}
