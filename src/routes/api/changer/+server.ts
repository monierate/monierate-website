import { getEndpoint, basicAuth  } from "$lib/helper";
import { json, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */

export async function GET({ url })
{
    let urlParams = url.searchParams;
    const code = urlParams.get('code') || null;
    
    let endpoint = getEndpoint(`/changers/get_all_changers?page=1`);
    if (code != null) {
        endpoint = getEndpoint(`/changers/get_changer?code=${code}`);
    }

    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );
    const changer = (await res.json()).data || {};

    if (changer.changers) {
        return json(changer.changers);
    }

    return json(changer);
}