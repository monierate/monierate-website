import type { LayoutServerLoad } from './$types';
import { loadFooter } from '$lib/server/footerProviders';

export const load: LayoutServerLoad = async ({ fetch, url, cookies, locals }) => ({
	footer: await loadFooter({ fetch, url, cookies, locals })
});
