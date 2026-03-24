import { env } from '$env/dynamic/private';
import type { ApiOptions, ApiResponse } from './types';

const BASE_URL =
	env.API_URL ?? 'https://currency-staging-api-production.up.railway.app/core';

const DEFAULT_TIMEOUT = 10_000;

/* ------------------ */
/* Auth helpers       */
/* ------------------ */

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

/* ------------------ */
/* Server API request */
/* ------------------ */

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

		if (retries > 0) {
			return serverApiRequest<T, B>(endpoint, {
				...options,
				retries: retries - 1
			});
		}

		return {
			success: false,
			status: 0,
			error: err.name === 'AbortError' ? 'Request timed out' : err.message
		};
	}
}
