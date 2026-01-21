import { env } from '$env/dynamic/private';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions<B = unknown> {
	method?: HttpMethod;
	body?: B;
	params?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	timeoutMs?: number;
	retries?: number;
	signal?: AbortSignal;
	authLevel?: 'api' | 'system';
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	status: number;
	data?: T;
	error?: string;
	raw?: unknown;
}

const BASE_URL = env.API_URL ?? 'https://monierate-currency-api-production.up.railway.app/core';

const API_FETCH_BASE = '/api';
const DEFAULT_TIMEOUT = 10_000;

/* ---------------------------------- */
/* Auth helpers (server-only usage)    */
/* ---------------------------------- */

function toBase64(str: string) {
	try {
		return btoa(str);
	} catch {
		return Buffer.from(str, 'utf8').toString('base64');
	}
}

function getAuthHeader(level: 'api' | 'system' = 'api') {
	const apiAuth = `changemoney_api:N4&*0C7MubL`;
	const systemAuth = `ikwuje:xaS@Di2Qry19M`;

	const token = toBase64(level === 'system' ? systemAuth : apiAuth);

	return {
		Authorization: `Basic ${token}`
	};
}

/* ---------------------------------- */
/* Server API request (with auth)     */
/* ---------------------------------- */

export async function serverApiRequest<T = unknown, B = unknown>(
	endpoint: string,
	options: ApiOptions<B> = {}
): Promise<ApiResponse<T>> {
	const {
		method = 'GET',
		body,
		params,
		headers,
		timeoutMs = DEFAULT_TIMEOUT,
		retries = 0,
		signal,
		authLevel = 'api'
	} = options;

	let url = `${BASE_URL}${endpoint}`;

	if (params && Object.keys(params).length > 0) {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) search.append(key, String(value));
		}
		url += `?${search.toString()}`;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	const config: RequestInit = {
		method,
		signal: signal ?? controller.signal,
		headers: {
			Accept: 'application/json',
			...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
			...getAuthHeader(authLevel),
			...headers
		}
	};

	if (method !== 'GET' && body !== undefined) {
		config.body = JSON.stringify(body);
	}

	try {
		const response = await fetch(url, config);
		clearTimeout(timeoutId);

		const contentType = response.headers.get('content-type');
		const isJson = contentType?.includes('application/json');

		const raw = isJson ? await response.json() : await response.text();

		if (!response.ok) {
			return {
				success: false,
				status: response.status,
				error: raw?.message ?? raw?.error ?? `Request failed (${response.status})`,
				raw
			};
		}

		return {
			success: true,
			status: response.status,
			data: raw?.data ?? raw,
			raw
		};
	} catch (err: any) {
		clearTimeout(timeoutId);
		console.error('Server API request error:', err);

		if (retries > 0) {
			return serverApiRequest<T, B>(endpoint, {
				...options,
				retries: retries - 1
			});
		}

		return {
			success: false,
			status: 0,
			error: err.name === 'AbortError' ? 'Request timed out' : (err.message ?? 'Network error')
		};
	}
}

/* ---------------------------------- */
/* Client API fetch (no auth)         */
/* ---------------------------------- */

export async function clientApiFetch<T = unknown, B = unknown>(
	endpoint: string,
	options: ApiOptions<B> = {},
	fetch: typeof globalThis.fetch = globalThis.fetch
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
			...(method !== 'GET' && body !== undefined ? { body: JSON.stringify(body) } : {})
		});

		if (!res.ok) return null;

		const json = await res.json().catch(() => null);
		return json?.data ?? json ?? null;
	} catch (e) {
		console.error('Client API fetch error:', e);
		return null;
	}
}
