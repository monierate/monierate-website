<script lang="ts">
	import { messageStore } from '$lib/notification';
</script>

<!-- Notification Container -->
{#if $messageStore}
	<div
		class="
    fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50
    max-w-[90%] md:max-w-[400px] py-4 px-2 md:p-4
    bg-black/80 dark:bg-black/85 text-white rounded-lg shadow-lg text-center text-[0.9em]
    fade-notification show
    "
	>
		<p>{$messageStore}</p>
	</div>
{/if}
