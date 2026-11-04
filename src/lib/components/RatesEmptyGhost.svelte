<script lang="ts">
	export let base: string;
	export let quote: string;
</script>

<div class="container px-0">
	<div class="relative rounded-xl overflow-hidden" style="background: var(--page-bg);">
		<!-- Ghost rows -->
		<div class="pointer-events-none select-none" aria-hidden="true">
			<div
				class="flex gap-4 px-5 py-3 border-b"
				style="background: var(--table-header-bg); border-color: var(--card-border);"
			>
				{#each [16, 96, 60, 60, 80] as w}
					<div class="h-2.5 rounded" style="width:{w}px; background: var(--card-border);"></div>
				{/each}
			</div>
			{#each { length: 5 } as _}
				<div class="flex items-center gap-4 px-5 py-4 border-b" style="border-color: var(--card-border);">
					<div class="h-3 w-4 rounded" style="background: var(--table-header-bg);"></div>
					<div class="h-6 w-6 rounded-full" style="background: var(--table-header-bg);"></div>
					<div class="h-3 w-24 rounded" style="background: var(--table-header-bg);"></div>
					<div class="h-3 w-14 rounded ml-auto" style="background: var(--table-header-bg);"></div>
					<div class="h-3 w-14 rounded" style="background: var(--table-header-bg);"></div>
					<div class="h-3 w-16 rounded" style="background: var(--table-header-bg);"></div>
				</div>
			{/each}
		</div>

		<!-- Fade the ghost rows out and centre the message over them -->
		<div
			class="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
			style="background: linear-gradient(to bottom, color-mix(in srgb, var(--page-bg) 40%, transparent), var(--page-bg) 85%);"
		>
			<p class="font-head font-semibold" style="color: var(--text-primary);">
				No data is available for {base} to {quote}
			</p>
			<p class="text-sm mt-1" style="color: var(--text-secondary);">
				Try another currency from the selector above.
			</p>
		</div>
	</div>
</div>
