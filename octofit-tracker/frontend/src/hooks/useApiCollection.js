import { useEffect, useState } from 'react';

export function useApiCollection(loadRecords) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const result = await loadRecords(controller.signal);
        if (active) {
          setRecords(result);
        }
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load records');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [loadRecords]);

  return { records, loading, error };
}
