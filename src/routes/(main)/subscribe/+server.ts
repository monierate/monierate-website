import { basicAuth, getEndpoint  } from "$lib/helper";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, fetch })
{
    const { email } = await request.json();
    const payload = {
        email,
    };
    const endpoint = getEndpoint("/public/account/signup");
    const res = await fetch(endpoint, basicAuth('PUT', payload, 'api'));

    const result = await res.json();
    console.log(result);

    return json(result);
}