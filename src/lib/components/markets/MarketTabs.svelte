<script lang="ts">
	import { page } from '$app/stores';

	const tabs = [
		{ label: 'Black Market', href: '/markets/parallel' },
		{ label: 'CBN', href: '/markets/official' },
		{ label: 'Global Market', href: '/markets/global' }
	];

	$: pathname = $page.url.pathname;
</script>

<div class="tabs" role="tablist">
	{#each tabs as tab}
		<a
			href={tab.href}
			class="tab"
			class:active={pathname === tab.href}
			role="tab"
			aria-selected={pathname === tab.href}
		>
			{tab.label}
		</a>
	{/each}
</div>

<style>
	.tabs {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.25rem;
		border-radius: 0.875rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
	}
	.tab {
		font-family: var(--font-head);
		font-weight: 600;
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
		border-radius: 0.625rem;
		color: var(--text-secondary);
		white-space: nowrap;
		transition:
			color 0.15s ease,
			background 0.15s ease;
	}
	.tab:hover {
		color: var(--text-primary);
	}
	.tab.active {
		background: var(--accent);
		color: #ffffff;
	}
</style>
