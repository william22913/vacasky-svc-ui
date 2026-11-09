import { useCallback, useEffect, useRef, useState } from 'react';
import { isCanceled } from '../core/utils/errors';

export function useApiResource(loader, deps) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setState((previous) => ({ ...previous, status: 'loading', error: null }));

    loaderRef.current(controller.signal)
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (active && !isCanceled(error)) setState({ status: 'error', data: null, error });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [depsKey, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, retry };
}
