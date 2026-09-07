import type { Handle, HandleServerError } from '@sveltejs/kit';
import { timezone } from '$lib/functions';

const securityHeaders = {
	//'Cross-Origin-Embedder-Policy': 'require-corp',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'X-XSS-Protection': '1; mode=block',
	'X-Xss-Protection': '1; mode=block',
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Content-Security-Policy': 'upgrade-insecure-requests',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const removeHeaders = ['Public-Key-Pins', 'X-Powered-By', 'X-AspNet-Version'];

export const handle: Handle = async ({ event, resolve }) => {
	// Cloudflare country (ISO-2)
	event.locals.ucountry = event.request.headers.get('cf-ipcountry') ?? '';

	const response = await resolve(event);

	Object.entries(securityHeaders).forEach(([header, value]) => response.headers.set(header, value));

	// remove headers we don't want exposed
	removeHeaders.forEach((name) => {
		response.headers.delete(name);
	});

	const cookieHeader = event.request.headers.get('cookie');
	let getTimezone = 'UTC'; // default value

	if (cookieHeader) {
		const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
		const timezoneCookie = cookies.find((cookie) => cookie.startsWith('timezone='));
		if (timezoneCookie) {
			getTimezone = timezoneCookie.split('=')[1];
		}
	}

	timezone.set(getTimezone);

	return response;
};

/**
 * Without this, an unexpected server error is logged as a bare stack with no URL
 * attached and the page shows nothing at all — so a "the site 500s" report is
 * unmatchable against the Worker logs. Stamp each failure with a short id, print
 * it next to the request that caused it, and hand it to the error page.
 */
export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const id = crypto.randomUUID().slice(0, 8);

	console.error(
		`[${id}] ${status} ${event.request.method} ${event.url.pathname}${event.url.search}`,
		error instanceof Error ? (error.stack ?? error.message) : error
	);

	return { id, message };
};
