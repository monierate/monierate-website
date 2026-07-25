<script lang="ts">
	import { onMount } from 'svelte';
	import { getCookie, setCookie } from '$lib/functions';
	import { browser } from '$app/environment';
	import { timezone } from '$lib/functions';
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	// import TopBanner from '$lib/components/banners/TopBanner.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import MarketTicker from '$lib/components/layout/MarketTicker.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	// import PromotionBar from '$lib/components/layout/PromotionBar.svelte';
	import MarketInsightBanner from '$lib/components/layout/MarketInsightBanner.svelte';
	import { ACCOUNT_URL } from '$lib/config';
	import Notification from '$lib/components/layout/Notification.svelte';
	import { getUserCountryClient } from '$lib/utils/userCountry';

	export let data;

	$: top_pairs = data.top_pairs;
	$: defaultCurrency = data.defaultCurrency;

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
<!-- <TopBanner /> -->
<Header bind:defaultCurrency={defaultCurrency} auth={data.auth} />
<MarketTicker top_pairs={top_pairs} />
<Breadcrumb />

<slot />

<div class="w-full h-1 mt-16 dark:border-gray-900"></div>

<div style="background: var(--page-bg);">
	<div class="top-landscape mb-8">
		<AdBanner name="footer" isMobile={data.isMobile} />
	</div>
</div>

<Footer />
<!-- <PromotionBar marketAvgRate={data.market_avg_rate} /> -->
<MarketInsightBanner variant="sticky" link="{ACCOUNT_URL}/auth/signup" />
<Notification />

