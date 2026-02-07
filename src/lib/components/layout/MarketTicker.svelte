<script lang="ts">
    import Money from "$lib/money";

	export let top_pairs: Record<
		string,
		{
			from: string;
			to: string;
			name: string;
			price: number;
			price_change_percent_24hr: number;
		}
	>;
</script>

<div
	class="bg-white w-full py-2 whitespace-nowrap overflow-x-auto no-scrollbar dark:bg-gray-800 dark:border-gray-600 border-b border-gray-100"
>
	<div class="w-[95%] md:max-w-[1500px] mx-auto px-4">
		{#each Object.entries(top_pairs) as [code, value], i}
			<a
				data-sveltekit-reload
				href="/converter/?From={value.from}&To={value.to}&Amount=1"
				class="text-gray-900 dark:text-gray-300 mr-6 text-[90%] md:text-base"
			>
				<span class="font-medium mr-[2px]">{value.name}</span>
				<span class="font-thin mr-[2px]">{Money.format(value.price, 2)}</span>
				<!-- display 24hr price change in green or red -->
				{#if value.price_change_percent_24hr > 0}
					<span class="inline-block text-green-500 font-thin">
						<svg
							viewBox="0 0 320 512"
							width="16"
							height="16"
							class="inline-block bg-transparent text-2xl"
							fill="green"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"
							/>
						</svg>
						{Money.format(value.price_change_percent_24hr, 2)}%
					</span>
				{:else}
					<span class="inline-block text-red-500 font-thin">
						<svg
							viewBox="0 0 320 512"
							width="16"
							height="16"
							class="inline-block bg-transparent text-2xl"
							fill="red"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
							/>
						</svg>
						{Money.format(value.price_change_percent_24hr, 2)}%
					</span>
				{/if}
			</a>
		{/each}
	</div>
</div>
