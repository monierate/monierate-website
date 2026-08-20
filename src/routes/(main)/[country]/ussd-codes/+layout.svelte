<script lang="ts">
	import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
</script>

<!-- partner -->
{#if hasActiveAd('bank_codes')}
	<div>
		<AdBanner name="bank_codes" />
	</div>
{:else}
	<div class="pt-4"></div>
{/if}

<slot />

