import { basicAuth  } from "$lib/helper";
import type { PageServerLoad } from './$types'
import { bearer } from '$lib/functions';
import { getEndpointV1 } from "$lib/server/utilities";

export const load: PageServerLoad = async ({ url, cookies }) => {
    const params = url.searchParams
    const auth_token = params.get('auth') || cookies.get('auth') || ''
    const confirm_token = params.get('confirm') || ''

    let auth: any = null
    let confirm: any = null

    let alerts: any

    // if the user is currently logged
    const savedToken = cookies.get('auth') || ''
    if (savedToken.length > 0) {
        console.log(savedToken)
        auth = { status: "success" }
        alerts = await getAlerts(savedToken)
    }
    else if (auth_token != '') {
        const result: any = await getAuth(auth_token)
        console.log(result)
    
        auth = result
        if (result.status == "success") {
            cookies.set("auth", result.data.token, {
                path: "/",
                maxAge: 60 * 60,
            })

            alerts = await getAlerts(result.data.token)
        }
    }

    if (confirm_token != '') {
        const result: any = await confirmAlert(confirm_token)
        console.log(result)
    
        confirm = result
    }

	return {
        confirm,
        auth,
        alerts,
    }
}

async function getAlerts(token: string) {
    const endpoint = getEndpointV1("/auth/alerting");
    const res = await fetch(endpoint, bearer('GET', token, {}));
    const result = await res.json();

    if (result.status == "error") {
        return []
    }

    return result.data
}

async function getAuth(token: string) {
    const payload = {
        token,
    };
    const endpoint = getEndpointV1("/public/alerting/auth");
    const res = await fetch(endpoint, basicAuth('POST', payload, 'system'));
    const result = await res.json();

    return result
}

async function confirmAlert(token: string) {
    const payload = {
        token,
    };
    const endpoint = getEndpointV1("/public/alerting/confirm");
    const res = await fetch(endpoint, basicAuth('POST', payload, 'system'));
    const result = await res.json();

    return result
}