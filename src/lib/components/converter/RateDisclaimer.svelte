<script lang="ts">
	import { ACCOUNT_URL } from '$lib/config';
	import { MARKET_DISCLAIMER, type MarketName } from '$lib/services/globalRate.service';

	/**
	 * The standing disclaimer under the headline rate.
	 *
	 * Says which rate the number is and, plainly, that it is not the rate the visitor
	 * will transact at. The wording follows the market badge rather than being fixed:
	 * claiming "we use the mid-market rate" on a parallel-market page would describe a
	 * different number from the one displayed directly above it.
	 *
	 * The call to action changes with sign-in state, because "Login" is noise for
	 * somebody already signed in — they go straight to the keys.
	 */

	let {
		market,
		isLoggedIn = false
	}: {
		market: MarketName | null;
		isLoggedIn?: boolean;
	} = $props();
</script>

{#if market}
	<p
		class="mt-4 text-[12px] leading-relaxed max-w-2xl"
		style="color: var(--text-muted);"
	>
		{MARKET_DISCLAIMER[market]}
		<a
			href={isLoggedIn ? `${ACCOUNT_URL}/api-keys` : `${ACCOUNT_URL}/auth/login`}
			class="font-semibold whitespace-nowrap"
			style="color: var(--accent);"
			rel="noopener"
		>
			{isLoggedIn ? 'Get your API keys' : 'Login to get your API keys'}
			<span aria-hidden="true">→</span>
		</a>
	</p>
{/if}
