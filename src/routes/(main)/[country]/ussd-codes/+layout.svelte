<script lang="ts">
	import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
</script>

<!-- partner -->
{#if hasActiveAd('bank_codes')}
	<div class="bg-white dark:bg-gray-800">
		<AdBanner name="bank_codes" />
	</div>
{:else}
	<div class="pt-4"></div>
{/if}

<slot />

