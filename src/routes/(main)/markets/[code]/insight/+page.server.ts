import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Retired route. The pair page covers everything this one did, so /insight is gone
 * rather than duplicated — but 16 of these URLs were live, indexed, and submitted in
 * the sitemap, so they redirect instead of 404ing. 301 (not the 307 used elsewhere in
 * this codebase for default-landing hops) because the move is permanent: it passes the
 * accumulated ranking signal up to the pair page and gets the old URL dropped from the
 * index rather than recrawled forever.
 */
export const load: PageServerLoad = async ({ params }) => {
	throw redirect(301, `/markets/${params.code}`);
};
