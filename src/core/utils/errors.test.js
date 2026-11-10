import { describe, expect, it } from 'vitest';
import { isCanceled, normalizeApiError } from './errors';

function errorEnvelope(status, code, requestId = 'req_01JB7Z9K4Q8X2M6T3R5V1W0P') {
  return {
    response: {
      status,
      data: {
        success: false,
        header: { request_id: requestId, version: '1.0.0', timestamp: '2026-11-09T00:00:00Z' },
        payload: { status, code, message: 'server wording' },
      },
    },
  };
}

describe('normalizeApiError', () => {
  it('reads the code and request id from the contract error envelope', () => {
    const error = normalizeApiError(errorEnvelope(400, 'INVALID_PRICE_RANGE'));

    expect(error.code).toBe('INVALID_PRICE_RANGE');
    expect(error.status).toBe(400);
    expect(error.requestId).toBe('req_01JB7Z9K4Q8X2M6T3R5V1W0P');
    expect(error.message).toMatch(/minimum price/i);
  });

  it('never renders an unknown server message', () => {
    const error = normalizeApiError(errorEnvelope(500, 'SOMETHING_NEW'));
    expect(error.code).toBe('SOMETHING_NEW');
    expect(error.message).not.toMatch(/server wording/);
  });

  it('treats a missing response as a network error', () => {
    const error = normalizeApiError(new Error('Network Error'));
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.status).toBe(0);
  });

  it('uses the not-found code when a 404 has no envelope', () => {
    const error = normalizeApiError({ response: { status: 404, data: null } });
    expect(error.code).toBe('TOUR_NOT_FOUND');
    expect(error.message).toMatch(/removed|no longer available/i);
  });

  it('falls back to the generic service code for an unknown failure', () => {
    const error = normalizeApiError({ response: { status: 500, data: null } });
    expect(error.code).toBe('E-5-VAC-SRV-001');
    expect(error.message).not.toMatch(/stack|sql/i);
  });

  it('marks canceled requests', () => {
    expect(isCanceled({ code: 'ERR_CANCELED' })).toBe(true);
    expect(normalizeApiError({ name: 'CanceledError' }).canceled).toBe(true);
    expect(isCanceled(new Error('boom'))).toBe(false);
  });
});
