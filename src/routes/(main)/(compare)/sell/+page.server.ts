import { redirect } from '@sveltejs/kit';

export const load = () => {
    throw redirect(302, '/sell/usd-get-ngn-best-selling-rate');
};