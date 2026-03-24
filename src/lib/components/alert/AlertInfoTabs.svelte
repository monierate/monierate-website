<script lang="ts">
	export let editAlert: any;
</script>

<div class="text-center mb-4">
	<h1 class="text-2xl mb-2 flex items-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="size-10 mr-4"
		>
			<path
				fill-rule="evenodd"
				d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
				clip-rule="evenodd"
			/>
		</svg>

		{editAlert ? 'Update Your Alert' : 'Naira Rate Alerts'}
	</h1>
	<p class="text-gray-500">The NGN rate is disorganized and unstable. Stay ahead always.</p>
</div>
