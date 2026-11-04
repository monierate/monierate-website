<script lang="ts">
	let { center = false }: { center?: boolean } = $props();

	const badges = ['No credit card required', 'Cancel anytime', 'Get free API key'];
</script>

<ul class="flex flex-wrap gap-x-5 gap-y-2 mt-4 {center ? 'justify-center' : ''}">
	{#each badges as b}
		<li class="flex items-center gap-1.5 text-sm font-medium" style="color: var(--text-secondary);">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="shrink-0" aria-hidden="true">
				<circle cx="8" cy="8" r="8" fill="var(--positive)" fill-opacity="0.15" />
				<path d="M4.75 8.25l2 2 4.5-4.5" stroke="var(--positive)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			{b}
		</li>
	{/each}
</ul>
