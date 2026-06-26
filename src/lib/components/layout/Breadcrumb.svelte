<script lang="ts">
	import { page } from '$app/stores';

	// get the current page path
	$: paths = $page.url.pathname.split('/');
	$: paths.shift();
	$: path = paths[0] ?? 'home';
	$: currentPath = paths[paths.length - 1];
	$: paths.pop();

	function breadcrumbs(paths: any, current: any) {
		let url = '';
		for (let i = 0; i < paths.length; i++) {
			if (i > current) continue;
			url += `/${paths[i]}`;
		}

		return url;
	}
</script>

{#if path != ''}
	<div style="background: var(--page-bg); border-bottom: 1px solid var(--card-border);">
		<div class="container">
			<span class="text-sm">
				<a href="/" class="mr-2 underline">Home</a>
				{#each paths as path, index}
					<span class="inline-block mr-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="inline-block w-3 h-3"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
						</svg>
					</span>
					<a href={breadcrumbs(paths, index)} class="mr-2 text-gray-700 dark:text-gray-300"
						>{path}</a
					>
				{/each}
				<span class="inline-block mr-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="inline-block w-3 h-3"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</span>
				<span class="text-gray-700 dark:text-gray-300">{currentPath}</span>
			</span>
		</div>
	</div>
{/if}
