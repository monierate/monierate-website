
import type { Post } from '$lib/blog/types'
import { im } from 'mathjs'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, url }) => {
    const urlParams = url.searchParams
    const tag = urlParams.get("tag") || ''

    const response = await fetch(`/api/blog?tag=${tag}`)
    const posts: Post[] = await response.json()

    return {
        posts: posts
    }
}