import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { getAllChangers } from '$lib/services/changer.service';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const changers = await getAllChangers(fetch);

        return {
            changers
        }

    } catch (e) {
        throw error(500, `Could not find providers data`)
    }
}