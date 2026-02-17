export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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
