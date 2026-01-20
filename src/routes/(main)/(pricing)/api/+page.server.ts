import type { PageServerLoad } from './$types';
import currencySymbols from '../../../data/currency-symbols.json';
import { parseJSONSafe } from '$lib/functions';

export const load: PageServerLoad = async ({ fetch }) => {
  let subscriptionPlans: any = [];

  try {
    const response = await fetch(`/api/pricing/get_all_pricing`);
    if (response.ok) {
      subscriptionPlans = await response.json();
      subscriptionPlans = parseJSONSafe(subscriptionPlans);
      subscriptionPlans = subscriptionPlans.data;
    } else {
      console.error(`Failed to fetch subscription plans. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
  }

  return {
    currencySymbols,
    subscriptionPlans,
  };
};
