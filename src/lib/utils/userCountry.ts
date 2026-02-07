import { getCookie, setCookie } from '$lib/functions';

export const COUNTRY_COOKIE = 'ucountry';

const TIMEZONE_MAP: Record<string, string> = {
	'Europe/Berlin': 'DE',
	'Europe/Paris': 'FR',
	'Europe/London': 'GB',
	'Europe/Rome': 'IT',
	'Europe/Madrid': 'ES',
	'Europe/Amsterdam': 'NL',
	'Europe/Brussels': 'BE',
	'Europe/Zurich': 'CH',

	'America/New_York': 'US',
	'America/Los_Angeles': 'US',
	'America/Chicago': 'US',
	'America/Toronto': 'CA',

	'Asia/Tokyo': 'JP',
	'Asia/Seoul': 'KR',
	'Asia/Singapore': 'SG',

	'Africa/Lagos': 'NG',
	'Africa/Accra': 'GH',
	'Africa/Johannesburg': 'ZA',
	'Africa/Nairobi': 'KE'
};

function fromLocale(): string | null {
	const lang = navigator.language || '';
	const match = lang.match(/-([A-Z]{2})$/i);
	return match ? match[1].toUpperCase() : null;
}

function fromTimezone(): string | null {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return TIMEZONE_MAP[tz] ?? null;
}

async function fromIP(): Promise<string | null> {
	try {
		const res = await fetch('https://ipapi.co/json/', {
			headers: { Accept: 'application/json' }
		});
		if (!res.ok) return null;

		const data = await res.json();
		return typeof data.country === 'string' ? data.country : null;
	} catch {
		return null;
	}
}

function chooseCountry(
	cookie: string | null,
	locale: string | null,
	timezone: string | null,
	ip: string | null
): string | null {
	// Priority order (highest → lowest)
	return ip || locale || timezone || cookie || null;
}

export async function getUserCountryClient(): Promise<string | null> {
	const cookie = getCookie(COUNTRY_COOKIE);
	const locale = fromLocale();
	const timezone = fromTimezone();

	// IP lookup happens regardless of cookie
	const ip = await fromIP();

	const country = chooseCountry(cookie, locale, timezone, ip);

	// Persist if changed or missing
	if (country && country !== cookie) {
		setCookie(COUNTRY_COOKIE, country, 30);
	}

	return country;
}
