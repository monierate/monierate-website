<script lang="ts">
	import { onMount } from 'svelte';
	import { getCookie, setCookie } from '$lib/functions';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { timezone } from '$lib/functions';
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import TopBanner from '$lib/components/banners/TopBanner.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import ApiHeader from '$lib/components/layout/ApiHeader.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import MarketTicker from '$lib/components/layout/MarketTicker.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	// import PromotionBar from '$lib/components/layout/PromotionBar.svelte';
	import MarketInsightBanner from '$lib/components/layout/MarketInsightBanner.svelte';
	import { ACCOUNT_URL } from '$lib/config';
	import Notification from '$lib/components/layout/Notification.svelte';
	import { getUserCountryClient } from '$lib/utils/userCountry';
	import { syncDefaultCurrency } from '$lib/stores/defaultCurrency';
	import { applyApiTheme } from '$lib/utils/apiTheme';

	export let data;

	$: top_pairs = data.top_pairs;
	$: defaultCurrency = data.defaultCurrency;
	// Browser only: the store is a module singleton, so on the server it would
	// leak one request's currency into the next.
	$: if (browser) syncDefaultCurrency(data.defaultCurrency);

	// API marketing pages: swap the default header and ticker for the API header
	const marketingPages = ['/api-pricing'];
	$: isMarketingPage = marketingPages.includes($page.url.pathname);

	// Marketing pages ignore the OS theme and use the header toggle (light by default).
	// hooks.server.ts tags <html> on the first render; this keeps it right on navigation.
	$: if (browser) applyApiTheme(isMarketingPage);

	// toggle navbar collapse menu on mobile
	onMount(() => {
		try {
			if (browser) {
				const getTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				if (getCookie('timezone') !== getTimezone) {
					setCookie('timezone', getTimezone, 1);
				}
				setCookie('timezone', getTimezone, 1);
				timezone.set(getTimezone);
	
				getUserCountryClient();
			}
		} catch(e: any) {
			console.error(e);
		}
	});

	try {
		if (data.auth.isLoggedIn) {
			timezone.set(data.auth.user.timezone);
		}
	} catch (error) {
		console.log(error);
	}
</script>

<LoadingIndicator />
{#if isMarketingPage}
	<ApiHeader />
{:else}
	<TopBanner currency={defaultCurrency} />
	<Header bind:defaultCurrency={defaultCurrency} auth={data.auth} />
	<MarketTicker top_pairs={top_pairs} />
	<Breadcrumb />
{/if}

<slot />

<div class="w-full h-1 mt-16 dark:border-gray-900"></div>

<div style="background: var(--page-bg);">
	<div class="top-landscape mb-8">
		<AdBanner name="footer" isMobile={data.isMobile} />
	</div>
</div>

<Footer providers={data.footer.providers} country={data.footer.country} />
<!-- <PromotionBar marketAvgRate={data.market_avg_rate} /> -->
<MarketInsightBanner variant="sticky" link="{ACCOUNT_URL}/auth/signup" />
<Notification />

