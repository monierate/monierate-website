<script lang="ts">
	let {
		title = 'No data available',
		description = 'There is no data to display for this selection.',
		compact = false
	}: {
		title?: string;
		description?: string;
		compact?: boolean;
	} = $props();
</script>

<div
	style="
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: {compact ? '28px 20px' : '48px 24px'};
		gap: 14px;
	"
>
	<!-- Illustration -->
	<div style="color: var(--text-muted, var(--text-secondary)); opacity: 0.5;">
		<svg
			width={compact ? '48' : '60'}
			height={compact ? '38' : '48'}
			viewBox="0 0 60 48"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Axis lines -->
			<line x1="4" y1="44" x2="56" y2="44" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<line x1="4" y1="4" x2="4" y2="44" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<!-- Tick marks on y -->
			<line x1="2" y1="34" x2="6" y2="34" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />
			<line x1="2" y1="24" x2="6" y2="24" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />
			<line x1="2" y1="14" x2="6" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.6" />
			<!-- Dashed sparkline suggesting empty/missing data -->
			<path
				d="M4 34 L16 26 L24 30 L34 18 L44 22 L56 12"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-dasharray="3.5 4"
				opacity="0.45"
			/>
			<!-- Ghost data points -->
			<circle cx="16" cy="26" r="2.5" fill="currentColor" opacity="0.22" />
			<circle cx="34" cy="18" r="2.5" fill="currentColor" opacity="0.22" />
			<circle cx="56" cy="12" r="2.5" fill="currentColor" opacity="0.22" />
			<!-- Small X mark near end to indicate "no data" -->
			<line x1="52" y1="5" x2="58" y2="11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55" />
			<line x1="58" y1="5" x2="52" y2="11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55" />
		</svg>
	</div>

	<!-- Text -->
	<div style="text-align: center;">
		<p
			style="
				font-size: {compact ? '12px' : '13px'};
				font-weight: 600;
				font-family: var(--font-head);
				color: var(--text-secondary);
				margin: 0;
			"
		>
			{title}
		</p>
		{#if description}
			<p
				style="
					font-size: {compact ? '11px' : '12px'};
					color: var(--text-muted, var(--text-secondary));
					opacity: 0.7;
					margin: 5px 0 0;
					max-width: 260px;
					line-height: 1.5;
				"
			>
				{description}
			</p>
		{/if}
	</div>
</div>
