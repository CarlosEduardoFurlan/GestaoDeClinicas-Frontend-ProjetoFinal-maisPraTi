import { useCallback, useEffect, useState } from 'react';
import { errorDescription } from '../lib/api-error';

// Carregamento de cadastros; não modifica os contextos da fundação.
export function useApiList<T>(getAll: (signal?: AbortSignal) => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    void getAll(controller.signal).then((data) => {
      if (!controller.signal.aborted) setItems(data);
    }).catch((cause: unknown) => {
      if (!controller.signal.aborted) setLoadError(errorDescription(cause));
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [getAll, revision]);
  return { items, setItems, loading, loadError, retry };
}
