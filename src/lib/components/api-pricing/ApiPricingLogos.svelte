<script lang="ts">
	const providers = [
		{ name: 'Binance P2P', icon: 'binance_p2p.svg' },
		{ name: 'Bybit', icon: 'bybit.svg' },
		{ name: 'Quidax', icon: 'quidax.svg' },
		{ name: 'Luno', icon: 'luno.svg' },
		{ name: 'Busha', icon: 'busha.svg' },
		{ name: 'KuCoin', icon: 'kucoin.svg' },
		{ name: 'Yellow Card', icon: 'yellowcard.svg' },
		{ name: 'Chipper Cash', icon: 'chippercash.svg' },
		{ name: 'Grey', icon: 'grey.svg' },
		{ name: 'Cleva', icon: 'cleva.svg' },
		{ name: 'Remitano', icon: 'remitano.svg' },
		{ name: 'NoOnes', icon: 'noones.svg' },
		{ name: 'Gate', icon: 'gate.svg' },
		{ name: 'HTX', icon: 'htx_huobi.svg' },
		{ name: 'CoinEx', icon: 'coinex.svg' },
		{ name: 'Nala', icon: 'nala.svg' },
		{ name: 'Remitly', icon: 'remitly.svg' },
		{ name: 'WorldRemit', icon: 'worldremit.svg' },
		{ name: 'Sendwave', icon: 'sendwave.svg' },
		{ name: 'Western Union', icon: 'westernunion.svg' },
		{ name: 'MoneyGram', icon: 'moneygram.svg' },
		{ name: 'Payoneer', icon: 'payoneer.svg' },
		{ name: 'Bitnob', icon: 'bitnob.svg' },
		{ name: 'Breet', icon: 'breet.svg' }
	];
</script>

<section class="py-12" style="border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border);">
	<div class="container">
		<p class="text-center text-sm mb-8" style="color: var(--text-secondary);">
			Live rates aggregated from the providers Nigerians actually use, and 90+ more.
		</p>

		<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6 max-w-5xl mx-auto">
			{#each providers as p}
				<div class="flex items-center justify-center gap-2 min-w-0" title={p.name}>
					<img src="/icons/svg/{p.icon}" alt={p.name} width="24" height="24" loading="lazy" class="w-6 h-6 rounded object-contain shrink-0" />
					<span class="font-head text-[12px] font-semibold truncate" style="color: var(--text-primary);">{p.name}</span>
				</div>
			{/each}
		</div>
	</div>
</section>
