import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * Handles "List your platform" listing requests.
 *
 * Forwards the submission to the account-api's listing endpoint
 * (POST /core/listing/submit), which emails the growth team via the existing
 * Mailgun mailing integration and sets Reply-To to the submitter.
 *
 * Security:
 *  - This runs on the server; the account-api URL is never seen by the browser.
 *  - The account-api endpoint is service-to-service and requires the shared
 *    SERVICE_TOKEN, sent here as `x-service-token`. It is never exposed to the
 *    client, so the endpoint cannot be called directly from the network tab.
 *  - A honeypot field (`company`) silently drops obvious bot submissions.
 *  - A Cloudflare Turnstile token is verified server-side when TURNSTILE_SECRET_KEY
 *    is configured, blocking automated submissions.
 */

const API_ACCOUNT_URL =
	env.API_ACCOUNT_URL ?? 'https://monierate-account-api.onrender.com/core';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, getClientAddress }) {
	const { platform, name, email, website, volume, message, company, turnstile } =
		await request.json();

	// Honeypot: real users never see or fill `company`. If it's set, it's a bot.
	// Pretend success so the bot gets no signal, but don't forward anything.
	if (company) {
		return json({ status: 'success', message: 'Listing request received.' });
	}

	// Cloudflare Turnstile — enforced only when a secret key is configured.
	if (env.TURNSTILE_SECRET_KEY) {
		const form = new URLSearchParams();
		form.append('secret', env.TURNSTILE_SECRET_KEY);
		form.append('response', turnstile ?? '');
		try {
			const ip = getClientAddress();
			if (ip) form.append('remoteip', ip);
		} catch {
			// getClientAddress can throw if the address is unavailable; remoteip is optional.
		}

		try {
			const verifyRes = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
			const outcome = await verifyRes.json();
			if (!outcome.success) {
				return json({
					status: 'error',
					message: 'Verification failed. Please complete the challenge and try again.'
				});
			}
		} catch (e) {
			console.error('Turnstile verification error:', e);
			return json({
				status: 'error',
				message: 'We could not verify your request right now. Please try again.'
			});
		}
	}

	// Basic server-side validation.
	if (!platform || !name || !email || !String(email).includes('@')) {
		return json({
			status: 'error',
			message: 'Please provide your platform name, your name and a valid email.'
		});
	}

	if (!env.SERVICE_TOKEN) {
		console.error('SERVICE_TOKEN is not set — listing request cannot be delivered.');
		return json({
			status: 'error',
			message: 'We could not submit your request right now. Please email hello@monierate.com.'
		});
	}

	try {
		const res = await fetch(`${API_ACCOUNT_URL}/listing/submit`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-service-token': env.SERVICE_TOKEN
			},
			body: JSON.stringify({ platform, name, email, website, volume, message })
		});

		const result = await res.json();

		if (!res.ok || result.status === 'error') {
			console.error('Listing request failed:', res.status, result);
			return json({
				status: 'error',
				message: 'We could not submit your request right now. Please email hello@monierate.com.'
			});
		}

		return json({ status: 'success', message: 'Listing request received.' });
	} catch (e) {
		console.error('Listing request error:', e);
		return json({
			status: 'error',
			message: 'We could not submit your request right now. Please email hello@monierate.com.'
		});
	}
}
