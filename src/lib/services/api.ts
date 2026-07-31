export interface Api {
	get: <T = unknown>(path: string) => Promise<T>;
}

/**
 * Maps the dashboard-style paths these copied services build
 * (`/currency/pairs/...`, `/currency/v1/index/history?...`) onto this site's
 * own `/api/...` proxy routes (`/api/pairs/...`, `/api/v1/index/history?...`)
 * — the same currency API, just reached through this project's existing
 * server-side proxy instead of the dashboard's session-based one.
 */
function toLocalPath(path: string): string {
	const stripped = path.startsWith('/currency') ? path.slice('/currency'.length) : path;
	return `/api${stripped}`;
}

function makeApi(fetcher: typeof globalThis.fetch, origin = ''): Api {
	return {
		get: async <T = unknown>(path: string): Promise<T> => {
			const url = `${origin}${toLocalPath(path)}`;
			const res = await fetcher(url, { headers: { Accept: 'application/json' } });
			return res.json() as Promise<T>;
		}
	};
}

// Client-side singleton — relative URLs resolved by the browser.
export const api = makeApi(fetch);

// Isomorphic factory — pass SvelteKit's load-event `fetch` (and `url.origin`
// for SSR) so requests work both server- and client-side.
export function createApi(fetcher: typeof globalThis.fetch, origin?: string): Api {
	return makeApi(fetcher, origin);
}
