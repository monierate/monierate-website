<script lang="ts">
	import { friendlyDate } from '$lib/functions';

	type BlogPost = {
		title: string;
		description: string;
		url: string;
	};

	export let posts: BlogPost[] = [];
</script>

<div class="border border-gray-200 dark:border-gray-700/60 rounded-xl">
	<!-- List -->
	<ul class="divide-y divide-gray-200 dark:divide-gray-700/60">
		{#each posts as post}
			<li
				class="px-6 py-4 hover:bg-[var(--table-hover)] transition first:rounded-t-xl last:rounded-b-xl"
			>
				<div class="flex items-start gap-4">
					<!-- Cover / Icon -->
					<div class="shrink-0">
						<div
							class="w-10 h-10 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125V5.25A3.375 3.375 0 0 0 10.125 1.875H8.25m0 8.25h8.25m-8.25 3h8.25m-8.25 3h5.25"
								/>
							</svg>
						</div>
					</div>

					<!-- Content -->
					<div class="flex-1 min-w-0">
						<a
							href={post.url}
							target="_blank"
							rel="noopener noreferrer"
							class="block text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate"
						>
							{post.title}
						</a>

						{#if post.description}
							<p class="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
								{post.description}
							</p>
						{/if}

						<!-- <div class="mt-2 text-xs text-gray-500 dark:text-gray-500">
							{friendlyDate(post.published_at)}
						</div> -->
					</div>

					<!-- Action -->
					<div class="shrink-0">
						<a
							href={post.url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full
								border border-[var(--card-border)]
								text-[var(--text-secondary)]
								hover:bg-[var(--table-hover)] transition"
						>
							Read
						</a>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
