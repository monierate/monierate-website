import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Adverts from '$data/adverts.json';

/**
 * `GET /api/banners`: public read of `src/data/adverts.json` (the same file `AdBanner` renders
 * from), so the mobile app can fetch every slot and show the active adverts.
 * Returned as-is: slot name → advert (or list of adverts); clients skip
 * entries without an image or with `disabled: true`, as `AdBanner` does.
 * Image paths are the site's static paths (`/media/banners/…`).
 */
export const GET: RequestHandler = () =>
	json(Adverts, {
		headers: {
			// The app refreshes once a day; the CDN may serve it for an hour.
			'cache-control': 'public, max-age=3600, s-maxage=3600',
			'access-control-allow-origin': '*'
		}
	});
