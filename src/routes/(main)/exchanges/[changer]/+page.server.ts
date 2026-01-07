import type { PageServerLoad } from './$types';
import currencies from '$data/currencies.json';
import currencySymbols from '$data/currency-symbols.json';

export const load: PageServerLoad = ({ params }: { params: { changer: string } }) => {
    const { changer } = params;
    const allCurrencies = {...currencies.fiat, ...currencies.coins} as Record<string, string>;

    return { changer, currencies: allCurrencies, currencySymbols };
};