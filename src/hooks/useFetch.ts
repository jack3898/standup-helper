import { useCallback, useState } from 'react';

export function useFetch<T>(): [(url: string, init?: RequestInit) => void, T | undefined, boolean] {
	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState(true);

	const runFetch = useCallback((url: string, init?: RequestInit) => {
		const abortController = new AbortController();

		fetch(url, { ...(init ?? {}), signal: abortController.signal })
			.then((response) => response.json())
			.then((data: T) => {
				setData(data);
				setLoading(false);
			})
			.catch((error) => {
				if (error.name === 'AbortError') {
					console.log('Fetch aborted');
				} else {
					console.error('Error fetching data: ', error);
				}
			});

		// If the component unmounts, abort the fetch.
		return () => abortController.abort();
	}, []);

	return [runFetch, data, loading];
}
