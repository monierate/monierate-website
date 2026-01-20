<script lang="ts">
	import '../app.css';
	import { partytownSnippet } from '@builder.io/partytown/integration';
	import { onMount } from 'svelte';
	import { getCookie, setCookie } from '$lib/functions';
	import { browser } from '$app/environment';
	import { timezone } from '$lib/functions';
	import AdBanner from '$lib/components/banners/AdBanner.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import TopBanner from '$lib/components/banners/TopBanner.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import MarketTicker from '$lib/components/layout/MarketTicker.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import PromotionBar from '$lib/components/layout/PromotionBar.svelte';
	import Notification from '$lib/components/layout/Notification.svelte';

	export let data;

	// toggle navbar collapse menu on mobile
	onMount(() => {
		if (browser) {
			const getTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (getCookie('timezone') !== getTimezone) {
				setCookie('timezone', getTimezone, 1);
			}
			setCookie('timezone', getTimezone, 1);
			timezone.set(getTimezone);
		}
	});

	try {
		if (data.user?.isLoggedIn) {
			timezone.set(data.user.userData.data.timezone);
		}
	} catch (error) {
		console.log(error);
	}
</script>

<svelte:head>
	<script>
		// Forward the necessary functions to the web worker layer
		partytown = {
			forward: ['dataLayer.push', 'gtag']
		};
	</script>

	{@html '<script>' + partytownSnippet() + '</script>'}

	<script
		type="text/partytown"
		src="https://www.googletagmanager.com/gtag/js?id=G-59H6DBC82L"
	></script>
	<script type="text/partytown">
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			dataLayer.push(arguments);
		};
		gtag('js', new Date());
		gtag('config', 'G-59H6DBC82L');
	</script>
</svelte:head>

<LoadingIndicator />
<TopBanner />
<Header defaultCurrency={data.defaultCurrency} />
<MarketTicker top_pairs={data.top_pairs} />
<Breadcrumb />

<slot />

<div class="w-full h-1 mt-16 dark:border-gray-900"></div>

<div class="bg-white dark:bg-gray-800">
	<div class="top-landscape mb-8">
		<AdBanner name="footer" isMobile={data.isMobile} />
	</div>
</div>

<Footer />
<PromotionBar marketAvgRate={data.market_avg_rate} />
<Notification />


<!-- Landscape Top/Bottom -->
<!-- <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9886145381404391"
     data-ad-slot="3727635247"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script> -->
