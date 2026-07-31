<script lang="ts">
	// Minimal reusable gate for premium-only affordances (export, alerts, etc).
	// Renders a locked call-to-action instead of the real control until we
	// have an actual subscription/auth check to gate on.
	export let label: string = 'Export data';
	export let description: string = 'Available on Monierate Pro.';
</script>

<div
	class="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/40 px-4 py-3 text-sm"
>
	<div class="flex items-center gap-2 min-w-0 text-gray-600 dark:text-gray-300">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			class="w-4 h-4 shrink-0"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
			/>
		</svg>
		<span class="truncate">
			<span class="font-medium text-gray-800 dark:text-gray-100">{label}</span>
			<span class="text-gray-500 dark:text-gray-400"> — {description}</span>
		</span>
	</div>

	<a
		href="/pricing"
		class="shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
	>
		Upgrade
	</a>
</div>
