import type { PageServerLoad } from './$types';
import { get_alert } from '$lib/price_alert/alert.service';

export const load: PageServerLoad = async ({ fetch, url }) => {
    try {
        const alert_id: string = url.searchParams.get('edit_alert') || '';

        if(alert_id && alert_id !== '') {
            const alert: any = await get_alert(alert_id, fetch);
    
            return {
                alert: alert.data,
            };
        }
    } catch (error: any) {
        console.log(error.message);
    }
    return {};
};
