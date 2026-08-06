<script lang="ts">
	let { quoteCurrency, hasAnyPairs }: { quoteCurrency: string; hasAnyPairs: boolean } = $props();
</script>

<div class="relative space-y-5">
	<!-- Ghost skeleton (faded + blurred) -->
	<div class="opacity-25 pointer-events-none select-none space-y-5" style="filter: blur(1.5px);">
		<!-- Ghost pair selector -->
		<div>
			<div class="flex items-center gap-2 mb-2.5">
				<div class="w-28 h-2.5 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
				<div class="w-5 h-5 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
			</div>
			<div
				class="inline-flex items-center gap-0.5 p-1 rounded-full"
				style="background: var(--table-header-bg); border: 1px solid var(--card-border);"
			>
				{#each { length: 4 } as _, i}
					<div
						class="rounded-full animate-pulse"
						style="width: {[68, 80, 72, 76][i]}px; height: 30px; background: {i === 0
							? 'var(--accent)'
							: 'var(--card-border)'}; opacity: {i === 0 ? 0.6 : 0.4};"
					></div>
				{/each}
			</div>
		</div>

		<!-- Ghost stat cards -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
			{#each { length: 4 } as _}
				<div class="rounded-xl border p-4" style="background: var(--page-bg); border-color: var(--card-border);">
					<div class="flex justify-between items-start mb-3">
						<div class="w-14 h-2 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
						<div class="w-6 h-6 rounded-lg animate-pulse" style="background: var(--table-header-bg);"></div>
					</div>
					<div class="w-20 h-5 rounded animate-pulse mb-2" style="background: var(--table-header-bg);"></div>
					<div class="w-14 h-2 rounded-full animate-pulse" style="background: var(--table-header-bg);"></div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Message overlay: top-pinned on mobile, centered on desktop -->
	<div class="absolute inset-0 flex justify-center items-start pt-8 lg:items-center lg:pt-0">
		<div
			class="text-center px-8 py-5 rounded-2xl"
			style="
				background: color-mix(in srgb, var(--card-bg) 80%, transparent);
				border: 1px solid var(--card-border);
				backdrop-filter: blur(12px);
				-webkit-backdrop-filter: blur(12px);
				box-shadow: 0 8px 32px rgba(0,0,0,0.12);
				max-width: 320px;
			"
		>
			<p class="text-[13px] font-semibold mb-1.5" style="color: var(--text-primary); font-family: var(--font-head);">
				No {quoteCurrency} pairs
			</p>
			<p class="text-[12px] leading-relaxed" style="color: var(--text-muted);">
				{#if hasAnyPairs}
					This provider doesn't support {quoteCurrency}. Switch the quote currency above.
				{:else}
					This provider has no active trading pairs at this time.
				{/if}
			</p>
		</div>
	</div>
</div>
