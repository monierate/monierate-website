<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center px-6 py-12">
	<!-- Left Section (Text) -->
	<div class="lg:w-1/2">
		<div class="space-y-4 mb-8">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Whoops....</h1>
			<h2 class="text-xl font-medium text-gray-700 dark:text-gray-300 flex items-center">
				Something went wrong
				<span class="ml-2">😎</span>
			</h2>
			<p class="text-gray-500 max-w-md dark:text-gray-400">
				A force is trying to stop you from accessing Monierate. Wait a little or refresh this page
				but if it fails...
			</p>
		</div>

		<a href="/" class="button inline-flex items-center gap-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="size-4"
			>
				<path
					fill-rule="evenodd"
					d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>Back to home</span>
		</a>
	</div>

	<!-- Right Section (Image) -->
	<div class="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
		<img src="/error-illustration.svg" alt="Error Illustration" class="max-w-sm w-full" />
	</div>
</div>
