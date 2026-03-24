import { redirect } from '@sveltejs/kit';

export const load = () => {
    throw redirect(302, '/buy/usd-with-ngn-best-buying-rate');
};