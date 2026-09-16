import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Retired route. The provider rates page duplicated the exchange profile at
 * `/exchanges/:code` — same changer, same code space, same live rates — so it
 * was removed rather than kept in sync. This 301 exists only to carry the
 * inbound links and any indexed URLs over to the surviving page; it is not a
 * page and has no `+page.svelte`.
 *
 * The old `?pair=` selection is dropped: the exchange profile lists every pair
 * the changer supports, so there is nothing to preselect.
 */
export const load: PageServerLoad = async ({ params }) => {
	throw redirect(301, `/exchanges/${params.code}`);
};
