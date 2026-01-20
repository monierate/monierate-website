<script lang="ts">
	import '../app.css';
	import { partytownSnippet } from '@builder.io/partytown/integration';
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

<slot />

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
