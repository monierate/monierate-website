<script lang="ts">
	import { navigating } from '$app/stores';

	let isNavigating = false;

	$: isNavigating = $navigating !== null;
</script>

{#if isNavigating}
	<div class="fixed top-0 left-0 w-full h-1 z-[1000]">
		<div class="h-full bg-primary origin-left animate-progress-bar"> </div>
	</div>
{/if}

<style>
	@keyframes progress-bar {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	.animate-progress-bar {
		animation: progress-bar 3s linear forwards;
		transform-origin: left;
	}
</style>
