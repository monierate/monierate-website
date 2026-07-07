<script lang="ts">
	export let name: string;
	export let status: string | undefined = undefined;

	const messages: Record<string, string> = {
		suspended: 'is currently suspended. Trading and services may be unavailable.',
		closed: 'has closed and is no longer operating.',
		flagged: 'has been flagged. Exercise caution before transacting.'
	};

	$: message = status ? messages[status] : undefined;
	$: isClosed = status === 'closed';
</script>

{#if message}
	<div
		class="flex items-start gap-3 rounded-xl border p-4 text-sm {isClosed
			? 'border-red-300 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-200'
			: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200'}"
		role="alert"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			class="w-5 h-5 shrink-0 mt-0.5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
			/>
		</svg>
		<p><span class="font-semibold">{name}</span> {message}</p>
	</div>
{/if}
