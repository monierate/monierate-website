<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';

	export let data;

	let leftSection!: HTMLDivElement;
	let observer: IntersectionObserver;

	onMount(() => {
		const footer = document.querySelector('footer');
		if (!footer) return;

		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Footer is visible — stop sticking
					leftSection.classList.remove('sticky', 'top-16');
					leftSection.classList.add('absolute', 'bottom-0');
				} else {
					// Normal scroll — stay sticky
					leftSection.classList.add('sticky', 'top-16');
					leftSection.classList.remove('absolute', 'bottom-0');
				}
			},
			{
				root: null,
				threshold: 0,
				rootMargin: '0px 0px -15% 0px' // stop slightly before touching
			}
		);

		observer.observe(footer);
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});
</script>

<div class="bg-white dark:bg-gray-800">
	<div class="top-landscape mb-8">
		<AdBanner name="bank_codes" isMobile={data.isMobile} />
	</div>
</div>

<div class="container relative">
	<div class="flex flex-col md:flex-row gap-4 justify-center items-start">
		<!-- Left sticky section -->
		<div
			bind:this={leftSection}
			class="hidden md:block md:w-1/4 relative sticky top-4 transition-all duration-300"
		>
			<div class="bg-white dark:bg-gray-800">
				<AdBanner name="bank_codes_side" />
			</div>
		</div>

		<div class="md:w-3/4">
			<slot />
		</div>
	</div>
</div>
