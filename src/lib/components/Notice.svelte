<div
	role="alert"
	class="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-xl p-5 shadow-sm text-yellow-800 dark:text-yellow-100 mb-8"
>
	<div class="flex flex-1 gap-4">
		<div class="flex-shrink-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6 text-2xl text-yellow-500 dark:text-yellow-400"
			>
				<path
					fill-rule="evenodd"
					d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<div class="flex flex-col gap-1">
			<p class="text-sm md:text-base leading-relaxed">
				<slot />
			</p>
		</div>
	</div>
</div>
