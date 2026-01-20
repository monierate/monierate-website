import type { PageServerLoad } from './$types'
import { get_all_alerts } from '$lib/price_alert/alert.service';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, parent }) => {
    let alerts: any = [];
    const { user } = await parent()
    if(!user?.isLoggedIn) {
        throw redirect(302, '/alerts/price-alert/periodic');
    }
    try {
        let getAlerts = await get_all_alerts(fetch);
        alerts = getAlerts.data;
    } catch(error: any) {
        console.log(error.message)
    }

    if(alerts.length === 0) {
        throw redirect(302, '/alerts/price-alert/periodic');
    }
    
    return {
        alerts,
    }
    
}
