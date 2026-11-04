<script lang="ts">
	// Companies that use the Monierate API. Logos live in static/logos/clients/;
	// `height` evens out wordmarks with different proportions.
	const companies: { name: string; logo: string; height?: number }[] = [
		{ name: 'Bitnob', logo: '/logos/clients/bitnob.webp', height: 26 },
		{ name: 'Spenda', logo: '/logos/clients/spenda.png', height: 24 },
		{ name: 'Shiga', logo: '/logos/clients/shiga.svg', height: 26 },
		{ name: 'BovaRefill', logo: '/logos/clients/bovarefill.png', height: 26 },
		{ name: 'Upesa', logo: '/logos/clients/upesa.png', height: 28 },
		{ name: 'Cedar Money', logo: '/logos/clients/cedar-money.svg', height: 30 }
	];
</script>

<!-- The band stays light in both themes so every logo shows in its own colours -->
<section class="band">
	<div class="container flex flex-col xl:flex-row items-center justify-center gap-x-12 gap-y-5 py-7">
		<p class="label shrink-0">You are in good company:</p>

		<ul class="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-10 gap-y-5">
			{#each companies as c}
				<li class="shrink-0">
					<img
						src={c.logo}
						alt={c.name}
						title={c.name}
						loading="lazy"
						class="w-auto object-contain"
						style="height: {c.height ?? 26}px;"
					/>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.band {
		background: #e8edf3;
		border-top: 1px solid #d9e0e8;
		border-bottom: 1px solid #d9e0e8;
	}
	.label {
		font-family: var(--font-mono);
		font-size: 14px;
		color: #1f2937;
	}
</style>
