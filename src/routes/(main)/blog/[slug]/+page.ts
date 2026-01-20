import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import superjson from 'superjson'
import Adverts from '$data/adverts.json';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../blog/${params.slug}.md`)
		
		return {
			slug: params.slug,
			metadata: post.metadata,
			content: post.default,
			adverts: Adverts.blog
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}