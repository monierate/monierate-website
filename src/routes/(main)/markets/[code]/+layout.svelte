<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<!--
	Pair pages build their `insight` actions object once (untracked) in the page
	script, so a client-side navigation to another pair/provider on the same route
	would otherwise keep the old pair in the header, chart and converter. Keying on
	the pathname remounts the page subtree on every pair switch.
-->
{#key $page.url.pathname}
	{@render children()}
{/key}
