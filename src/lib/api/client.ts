import type { ApiOptions } from './types';

const API_FETCH_BASE = '/api';

export async function clientApiFetch<T = unknown, B = unknown>(
	endpoint: string,
	options: ApiOptions<B> = {},
	fetch: typeof globalThis.fetch
): Promise<T | null> {
	const { method = 'GET', body, params, headers, signal } = options;

	let url = `${API_FETCH_BASE}${endpoint}`;

	if (params && Object.keys(params).length > 0) {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) search.append(key, String(value));
		}
		url += `?${search.toString()}`;
	}

	try {
		const res = await fetch(url, {
			method,
			signal,
			headers: {
				Accept: 'application/json',
				...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
				...headers
			},
			...(method !== 'GET' && body !== undefined
				? { body: JSON.stringify(body) }
				: {})
		});

		if (!res.ok) return null;

		const json = await res.json().catch(() => null);
		return json?.data ?? json ?? null;
	} catch (e) {
		console.error('Client API fetch error:', e);
		return null;
	}
}
