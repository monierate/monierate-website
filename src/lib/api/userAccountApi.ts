import { env } from '$env/dynamic/private';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface UserApiOptions<B = unknown> {
	method?: HttpMethod;
	body?: B;
	params?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	timeoutMs?: number;
	signal?: AbortSignal;

	/** Required user token (JWT / session token) */
	userToken: string;
}

export interface UserApiResponse<T = unknown> {
	success: boolean;
	status: number;
	data?: T;
	error?: string;
	raw?: unknown;
}

const API_ACCOUNT_URL = env.API_ACCOUNT_URL ?? 'https://monierate-account-api.onrender.com/core';

const DEFAULT_TIMEOUT = 10_000;

/* ---------------------------------- */
/* User Account API request helper    */
/* ---------------------------------- */

export async function userAccountRequest<T = unknown, B = unknown>(
	endpoint: string,
	options: UserApiOptions<B>
): Promise<UserApiResponse<T>> {
	const {
		method = 'GET',
		body,
		params,
		headers,
		timeoutMs = DEFAULT_TIMEOUT,
		signal,
		userToken
	} = options;

	let url = `${API_ACCOUNT_URL}${endpoint}`;

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
			user_token: userToken,
			...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
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

		return {
			success: false,
			status: 0,
			error: err?.name === 'AbortError' ? 'Request timed out' : (err?.message ?? 'Network error')
		};
	}
}
