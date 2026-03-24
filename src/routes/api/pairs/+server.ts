import { getEndpoint, basicAuth  } from "$lib/helper";
import { json, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */

export async function GET({ url })
{
    let urlParams = url.searchParams
    const currenypair = urlParams.get('pair') || ''
    const split = urlParams.get('split') || 'no'
    
    let endpoint = getEndpoint(`/public/pairs/${currenypair}?split=${split}`);

    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );
    const pairRates = (await res.json()).data || {}

    return json(pairRates);
}