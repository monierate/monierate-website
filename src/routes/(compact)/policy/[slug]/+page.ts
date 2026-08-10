import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../../data/${params.slug}.md`)

		return {
			slug: params.slug,
			metadata: post.metadata,
			content: post.default
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}