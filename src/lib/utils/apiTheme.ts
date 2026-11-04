// The API landing page (api-pricing) ignores the OS theme. It defaults to light and
// lets visitors switch with the header toggle. The choice lives in a cookie so the
// server can render the right <html> class on the first paint (see hooks.server.ts).

export type ApiTheme = 'light' | 'dark';

export const API_THEME_COOKIE = 'api_theme';

export const themeClass = (theme: ApiTheme) => (theme === 'dark' ? 'dark-only' : 'light-only');

export function parseApiTheme(value: string | null | undefined): ApiTheme {
	return value === 'dark' ? 'dark' : 'light';
}

function readCookie(): ApiTheme {
	const match = document.cookie.match(new RegExp(`(?:^|; )${API_THEME_COOKIE}=([^;]*)`));
	return parseApiTheme(match?.[1]);
}

/** Tag <html> with the saved theme on API pages, or clear the tag elsewhere. */
export function applyApiTheme(enabled: boolean, theme: ApiTheme = readCookie()) {
	const root = document.documentElement;
	root.classList.remove('light-only', 'dark-only');
	if (enabled) root.classList.add(themeClass(theme));
}

export function currentApiTheme(): ApiTheme {
	return document.documentElement.classList.contains('dark-only') ? 'dark' : 'light';
}

export function setApiTheme(theme: ApiTheme) {
	document.cookie = `${API_THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
	applyApiTheme(true, theme);
}
