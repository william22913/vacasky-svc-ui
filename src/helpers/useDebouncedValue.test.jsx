import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('only publishes the last value after the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'k' },
    });

    rerender({ value: 'ko' });
    rerender({ value: 'kom' });
    expect(result.current).toBe('k');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('k');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('kom');
  });
});
