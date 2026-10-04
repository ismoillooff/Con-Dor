import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '../lib/api';

interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Generic data-fetching hook.
 * Fetches immediately on mount (if path is truthy) and provides refetch.
 *
 * @param path  API path, e.g. '/content/faq'. Pass null/empty to skip.
 */
export function useApi<T>(path: string | null): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!!path);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(() => {
        if (!path) return;

        // Cancel any in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        api.get<T>(path)
            .then((result) => {
                if (!controller.signal.aborted) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!controller.signal.aborted) {
                    setError(err instanceof ApiError ? err.message : "Ma'lumotlarni yuklashda xatolik");
                    setLoading(false);
                }
            });
    }, [path]);

    useEffect(() => {
        fetchData();
        return () => { abortRef.current?.abort(); };
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
