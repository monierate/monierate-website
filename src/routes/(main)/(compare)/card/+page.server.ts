import { redirect } from '@sveltejs/kit';

export const load = () => {
    throw redirect(302, '/card/usd-ngn-best-funding-rate');
};