import type { PageServerLoad } from './$types';
import { get_all_alerts } from '$lib/services/alert.service';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, parent, depends }) => {
	const { auth } = await parent();

	depends('app:data');

	if (!auth.isLoggedIn) {
		throw redirect(302, '/alerts/price-alert/periodic');
	}

	const result = await get_all_alerts(fetch);

	// Handle API failure or unexpected shape
	if (!result) {
		throw redirect(302, '/alerts/price-alert/periodic');
	}

	const alerts = result as any;

	if (alerts.length === 0) {
		throw redirect(302, '/alerts/price-alert/periodic');
	}

	return {
		alerts
	};
};
