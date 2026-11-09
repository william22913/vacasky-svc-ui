import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTours } from '../../core/services/catalogService';
import { PAGE_SIZE } from './listingParams';

export function useTourListing(params) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const sequence = useRef(0);

  const { q, destination, category, priceMin, priceMax, durationMin, durationMax, sort, page, invalidRange } =
    params;
  const requestKey = JSON.stringify([
    q,
    destination,
    category,
    priceMin,
    priceMax,
    durationMin,
    durationMax,
    sort,
    page,
  ]);

  useEffect(() => {
    if (invalidRange) return undefined;

    const requestId = ++sequence.current;
    const controller = new AbortController();

    setState((previous) => ({ status: 'loading', data: previous.data, error: null }));

    fetchTours(
      { q, destination, category, priceMin, priceMax, durationMin, durationMax, sort, page, pageSize: PAGE_SIZE },
      controller.signal
    )
      .then((data) => {
        if (requestId === sequence.current) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (requestId !== sequence.current || error.canceled) return;
        setState({ status: 'error', data: null, error });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, retry };
}
