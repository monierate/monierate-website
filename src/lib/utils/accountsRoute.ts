import { isCryptoBase } from '$lib/constants/currency';

/**
 * Account providers issue accounts in several fiat currencies, so each fiat base gets
 * its own page (`/usd-accounts-rates`, `/eur-accounts-rates`). Crypto bases have no
 * "USDT account", so they share `/virtual-accounts-rates` and keep the base in the query.
 */
export const ACCOUNT_FIAT_BASES = ['USD', 'EUR', 'GBP', 'CAD', 'GHS', 'KES', 'ZAR'];

export const VIRTUAL_ACCOUNTS_SLUG = 'virtual';

export const DEFAULT_VIRTUAL_ACCOUNT_BASE = 'USDT';

export const isAccountSlug = (slug: string): boolean =>
	slug === VIRTUAL_ACCOUNTS_SLUG || ACCOUNT_FIAT_BASES.includes(slug.toUpperCase());

export const accountsLabel = (base: string): string =>
	base && !isCryptoBase(base) ? `${base.toUpperCase()} Accounts` : 'Virtual Accounts';

/**
 * Canonical URL for a base's accounts page. `search` carries any other params
 * (quote, page) across; `base` is only kept for the shared virtual page.
 */
export function accountsHref(base: string, search: string | URLSearchParams = ''): string {
	const params = new URLSearchParams(search);
	params.delete('base');

	let path: string;
	if (base && !isCryptoBase(base)) {
		path = `/${base.toLowerCase()}-accounts-rates`;
	} else {
		path = `/${VIRTUAL_ACCOUNTS_SLUG}-accounts-rates`;
		if (base && base.toUpperCase() !== DEFAULT_VIRTUAL_ACCOUNT_BASE) {
			params.set('base', base.toUpperCase());
		}
	}

	const query = params.toString();
	return query ? `${path}?${query}` : path;
}
