<script lang="ts">
	import { proSignupUrl, proLearnMoreUrl, PRO_FEATURES } from '$lib/utils/pro';

	let {
		feature,
		source,
		campaign,
		title = 'This is a Monierate Pro feature',
		description = '',
		features = PRO_FEATURES,
		showFeatures = true,
		compact = false,
	}: {
		/** The gated affordance — flows into the CTA's utm_content. */
		feature: string;
		/** The page the gate lives on — flows into the CTA's utm_term. */
		source: string;
		campaign?: string;
		title?: string;
		description?: string;
		features?: readonly string[];
		showFeatures?: boolean;
		/** Drops the bullets and tightens spacing, for overlays with little room. */
		compact?: boolean;
	} = $props();

	const linkParams = $derived({ feature, source, campaign });
	const signupHref = $derived(proSignupUrl(linkParams));
	const learnMoreHref = $derived(proLearnMoreUrl(linkParams));
	const bullets = $derived(showFeatures && !compact ? features : []);
</script>

<div class="text-center {compact ? 'space-y-1.5' : 'space-y-3'}">
	<span
		class="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
		style="background: var(--accent-light, rgba(56,97,251,0.1)); color: var(--accent);"
	>Monierate Pro</span>

	<h3
		class="{compact ? 'text-[14px]' : 'text-[19px]'} font-bold leading-snug"
		style="font-family: var(--font-head); color: var(--text-primary);"
	>{title}</h3>

	{#if description}
		<p class="text-[12.5px] max-w-sm mx-auto" style="color: var(--text-secondary);">{description}</p>
	{/if}

	{#if bullets.length}
		<ul class="space-y-2 text-left inline-block pt-1">
			{#each bullets as label}
				<li class="flex items-center gap-2.5">
					<span
						class="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
						style="background: var(--accent-light, rgba(56,97,251,0.1)); color: var(--accent);"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
					</span>
					<span class="text-[13px]" style="color: var(--text-primary);">{label}</span>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="flex items-center justify-center gap-2 flex-wrap {compact ? 'pt-0.5' : 'pt-2'}">
		<!-- Leaves the site for the Pro app; rel keeps referrer intact for attribution. -->
		<a
			href={signupHref}
			class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
			style="background: var(--accent);"
		>
			Get Pro
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M7 17 17 7" /><path d="M7 7h10v10" />
			</svg>
		</a>
		<a
			href={learnMoreHref}
			class="inline-flex items-center px-4 py-2 rounded-lg text-[13px] font-semibold no-underline border transition-colors hover:bg-[var(--table-hover)]"
			style="color: var(--text-secondary); border-color: var(--card-border);"
		>Learn more</a>
	</div>
</div>
