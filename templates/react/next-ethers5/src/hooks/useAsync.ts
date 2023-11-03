import { useState, useCallback } from 'react';

type AsyncFunction<T extends any[], U> = (...args: T) => Promise<U>;

export function useAsync<T extends any[], U>(asyncFunction: AsyncFunction<T, U>) {
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<U | null>(null);

  const execute = useCallback(async (...args: T): Promise<U | void> => {
    setInProgress(true);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setResult(response);
      return response;
    } catch (e) {
      setError(e instanceof Error ? e : new Error("An unexpected error occurred."));
    } finally {
      setInProgress(false);
    }
  }, [asyncFunction]);

  return {
    result,
    inProgress,
    error,
    execute,
  };
}
