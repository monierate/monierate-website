import { persistentCookieStore } from './persistentStore';
import { COUNTRY_COOKIE } from '$lib/utils/userCountry';

export const userCountry = persistentCookieStore(COUNTRY_COOKIE);
