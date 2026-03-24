import { array_to_key_object } from '$lib/helper'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { getChanger } from '$lib/services/changer.service'

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        let slug = params.slug.split('-');
        let changer_code = slug[0];

        if (slug.length > 3) {
            changer_code = slug[0] + '-' + slug[1];
        }

        if (changer_code.length == 0) {
            throw error(404, `Provider not found`);
        }

        const changer = await getChanger(fetch, changer_code);

        return {
            changer,
        }
    }
    catch(e: any) {
        throw error(500, `Unable to fetch provider data`);
    }
}