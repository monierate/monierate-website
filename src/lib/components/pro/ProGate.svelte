<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import ProUpsell from './ProUpsell.svelte';
	import { PRO_FEATURES } from '$lib/utils/pro';

	/**
	 * One gate for every Pro-only affordance on the public site.
	 *
	 * There is no logged-in or paid concept here, so a gate is always closed —
	 * anonymous visitors see the teaser and click through to Pro signup. Nothing
	 * premium is ever computed or downloaded behind it.
	 *
	 *   variant="button"  a locked affordance (Export, Download…) that opens the upsell
	 *   variant="overlay" wraps content and teases it behind a blur or a fade
	 *   variant="inline"  the bare upsell card, for slots that are already positioned
	 */
	let {
		feature,
		source,
		variant = 'button',
		reveal = 'blur',
		title = 'This is a Monierate Pro feature',
		description = '',
		features = PRO_FEATURES,
		campaign,
		label = 'Export',
		size = 'md',
		disabled = false,
		compact = false,
		children,
	}: {
		/** The gated affordance, e.g. 'export-index-history'. Feeds CTA attribution. */
		feature: string;
		/** The page the gate lives on, e.g. 'markets-history'. Feeds CTA attribution. */
		source: string;
		variant?: 'button' | 'overlay' | 'inline';
		/** Overlay only: obscure the content, or let it fade out under the CTA. */
		reveal?: 'blur' | 'fade';
		title?: string;
		description?: string;
		features?: readonly string[];
		campaign?: string;
		/** Button only. */
		label?: string;
		size?: 'sm' | 'md';
		disabled?: boolean;
		/** Overlay/inline: drop the bullets for tight spaces. */
		compact?: boolean;
		/** Overlay only: the teased content. */
		children?: Snippet;
	} = $props();

	let open = $state(false);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if variant === 'button'}
	<button
		type="button"
		{disabled}
		onclick={() => (open = true)}
		aria-haspopup="dialog"
		class="inline-flex items-center gap-1.5 rounded-lg font-semibold cursor-pointer border transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
			{size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-3 py-2 text-[12px]'}"
		style="background: var(--accent); border-color: var(--accent); color: #fff;"
	>
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</svg>
		{label}
	</button>
{:else if variant === 'overlay'}
	<div class="relative">
		<!-- aria-hidden + inert: the teaser is decoration, never reachable by keyboard
		     or screen readers, so the CTA is the only thing in the tab order. -->
		<div
			aria-hidden="true"
			inert
			class="select-none"
			style={reveal === 'blur' ? 'filter: blur(5px); opacity: 0.55;' : ''}
		>
			{@render children?.()}
		</div>

		<div
			class="absolute inset-x-0 flex flex-col items-center justify-end px-5 text-center
				{reveal === 'blur' ? 'inset-y-0 justify-center' : 'bottom-0 pt-24 pb-6'}"
			style={reveal === 'fade'
				? 'background: linear-gradient(to bottom, transparent 0%, var(--page-bg) 55%);'
				: ''}
		>
			<ProUpsell {feature} {source} {campaign} {title} {description} {features} {compact} />
		</div>
	</div>
{:else}
	<ProUpsell {feature} {source} {campaign} {title} {description} {features} {compact} />
{/if}

{#if variant === 'button'}
	{#if open}
		<div
			class="fixed inset-0 z-40"
			style="background: rgba(0,0,0,0.5); backdrop-filter: blur(3px);"
			onclick={() => (open = false)}
			role="presentation"
			transition:fade={{ duration: 150 }}
		></div>

		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
			<div
				class="rounded-2xl border shadow-2xl w-full max-w-md overflow-hidden relative pointer-events-auto"
				style="border-color: var(--card-border); background: var(--card-bg);"
				role="dialog"
				aria-modal="true"
				aria-label={title}
				transition:fly={{ y: 14, duration: 200 }}
			>
				<button
					type="button"
					onclick={() => (open = false)}
					aria-label="Close"
					class="absolute top-4 right-4 rounded-lg p-1 cursor-pointer z-10"
					style="background: transparent; color: var(--text-secondary);"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
				</button>

				<div class="px-7 pt-7 pb-6">
					<ProUpsell {feature} {source} {campaign} {title} {description} {features} />
				</div>
			</div>
		</div>
	{/if}
{/if}
