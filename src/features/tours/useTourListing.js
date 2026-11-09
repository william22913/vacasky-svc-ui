import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTours } from '../../core/services/catalogService';

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

  // The request body is rebuilt from the latest params whenever requestKey
  // changes; the ref keeps the effect free of array identities and lets the
  // key decide when a new request is due.
  const requestRef = useRef(null);
  requestRef.current = { q, destination, category, priceMin, priceMax, durationMin, durationMax, sort, page };
  const invalidRangeRef = useRef(invalidRange);
  invalidRangeRef.current = invalidRange;

  useEffect(() => {
    if (invalidRangeRef.current) return undefined;

    const requestId = ++sequence.current;
    const controller = new AbortController();

    setState((previous) => ({ status: 'loading', data: previous.data, error: null }));

    fetchTours(requestRef.current, controller.signal)
      .then((data) => {
        if (requestId === sequence.current) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (requestId !== sequence.current || error.canceled) return;
        setState({ status: 'error', data: null, error });
      });

    return () => controller.abort();
  }, [requestKey, attempt, invalidRange]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, retry };
}
