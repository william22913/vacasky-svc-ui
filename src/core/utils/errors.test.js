import { describe, expect, it } from 'vitest';
import { isCanceled, normalizeApiError } from './errors';

describe('normalizeApiError', () => {
  it('maps the contract error envelope', () => {
    const error = normalizeApiError({
      response: {
        status: 400,
        data: {
          error: {
            code: 'INVALID_FILTER_RANGE',
            message: 'maxPrice must be greater than minPrice',
            requestId: 'req-123',
            details: [{ field: 'maxPrice', message: 'too small' }],
          },
        },
      },
    });

    expect(error.code).toBe('INVALID_FILTER_RANGE');
    expect(error.status).toBe(400);
    expect(error.requestId).toBe('req-123');
    expect(error.message).toMatch(/minimum value/i);
    expect(error.fields).toHaveLength(1);
  });

  it('treats a missing response as a network error', () => {
    const error = normalizeApiError(new Error('Network Error'));
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.status).toBe(0);
  });

  it('marks canceled requests', () => {
    expect(isCanceled({ code: 'ERR_CANCELED' })).toBe(true);
    expect(normalizeApiError({ name: 'CanceledError' }).canceled).toBe(true);
    expect(isCanceled(new Error('boom'))).toBe(false);
  });

  it('falls back to a safe message for an unknown failure', () => {
    const error = normalizeApiError({ response: { status: 500, data: null } });
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.message).not.toMatch(/stack|sql/i);
  });
});
