<script lang="ts">
	export let data;

	let bankInfo = data.bankInfo;
	let countryName = data.countryName;
	let countryCode = data.countryCode;

	// Type definitions
	interface ImageSources {
		svg: string;
		png: string;
		webp?: string;
	}

	let fallbackStates = new Map<string, boolean>();

	function generateSrcSet(baseUrl: string, sizes: number[]): string {
		return sizes.map((size) => `${baseUrl} ${size}w`).join(', ');
	}

	function handleImageError(event: Event, id: string) {
		const img = event.currentTarget as HTMLImageElement;
		if (!fallbackStates.get(id)) {
			fallbackStates.set(id, true);

			// Clear all srcset attributes from source elements
			const picture = img.closest('picture');
			if (picture) {
				const sources = picture.getElementsByTagName('source');
				Array.from(sources).forEach((source) => {
					source.srcset = '';
					source.removeAttribute('srcset');
				});
			}

			// Clear the img srcset
			img.srcset = '';
			img.removeAttribute('srcset');

			const fallbackSrc = '/icons/default.png';

			// Create a new image to check if fallback exists
			const testImage = new Image();
			testImage.onerror = () => {
				console.error('Fallback image not found:', fallbackSrc);
			};
			testImage.src = fallbackSrc;

			img.src = fallbackSrc;
			// Force a reload of the image
			img.complete && (img.src = img.src);
		}
	}
</script>

<svelte:head>
	<title>{bankInfo.name} {countryName} SWIFT Codes</title>
	<meta name="description" content="Get all {bankInfo.name} Bank SWIFT codes on Monierate." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{bankInfo.name} SWIFT Codes {countryName}" />
	<meta property="og:description" content="Get all {countryName} Bank SWIFT codes." />
	<meta
		property="og:url"
		content="https://monierate.com/{countryCode}/swift-code/{bankInfo.id}"
	/>
</svelte:head>

<div class="mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<div class="flex flex-col items-center justify-center">
			<span class="bank-icon mr-4">
				<picture>
					{#if !fallbackStates.get(bankInfo.id)}
						<source
							srcset={generateSrcSet(`/icons/svg/${bankInfo.id}.svg`, [400, 800, 1200])}
							type="image/svg+xml"
						/>
						<source
							srcset={generateSrcSet(`/icons/png/${bankInfo.id}.png`, [400, 800, 1200])}
							type="image/png"
						/>
					{/if}
					<img
						width="70px"
						height="70px"
						class="rounded-full"
						alt="{bankInfo.name} icon"
						src={`/icons/svg/${bankInfo.id}.svg`}
						srcset={generateSrcSet(`/icons/svg/${bankInfo.id}.svg`, [400, 800, 1200])}
						on:error={(e) => handleImageError(e, bankInfo.id)}
					/>
				</picture>
			</span>
			<h1 class="text-2xl md:text-4xl py-5">
				{bankInfo.name} SWIFT Code
			</h1>
			<div>
				<h2 class="text-xl py-5">SWIFT Code</h2>

				<div>
					<span
						class="inline-flex items-center justify-between space-x-2 border border-gray-200 dark:border-gray-700 px-2 py-2 rounded-md w-full bg-white shadow-md dark:bg-gray-900"
					>
						<input
							type="text"
							placeholder={bankInfo.swift.codes.join(', ')}
							value={bankInfo.swift.codes.join(', ')}
							class="bg-transparent border-none text-gray-800 dark:text-gray-300 focus:outline-none w-full px-5"
						/>
						<button
							class="bg-transparent text-gray-800 dark:text-gray-300 underline px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-700"
							on:click={() => navigator.clipboard.writeText(bankInfo.swift.codes.join(', '))}
						>
							Copy
						</button>
					</span>
				</div>
			</div>
			<p class="py-5">
				Copy the SWIFT code above only when making SWIFT payments to your {bankInfo.name} account in {countryName}.
			</p>
		</div>
	</div>

	<div class="container">
		<div
			class="border rounded-md bg-white py-4 shadow-md dark:bg-gray-900 dark:text-light dark:border-none"
		>
			<div class="container">
				<div class="overflow-x-auto text-center">
					<table class="table-auto inline w-full text-xs md:text-base text-center">
						<tbody>
							{#each bankInfo.swift.details as code}
								<tr class="text-lg md:text-3xl">
									<td class="py-2 px-2 md:px-10">{code.details.bank}</td>
									<td class="py-2 px-2 md:px-10">{code.details.country}</td>
									<td class="py-2 px-2 md:px-10">{code.details.location}</td>
									<td class="py-2 px-2 md:px-10"
										>{code.details.branch ? code.details.branch : 'XXX'}</td
									>
								</tr>
							{/each}
							<tr class="text-gray-800 dark:text-gray-300">
								<td class="p-2 md:p-10"> Bank Code </td>
								<td class="p-2 md:p-10"> Country Code </td>
								<td class="p-2 md:p-10"> Location Code </td>
								<td class="p-2 md:p-10"> Branch Code </td>
							</tr>
						</tbody>
					</table>

					<div class="pt-8">
						<p class="inline-block border border-gray-200 rounded-md dark:border-gray-700 p-5">
							This SWIFT detail <strong>{bankInfo.swift.codes.join(', ')}</strong> is for {bankInfo.name.toUpperCase()}
							{#if !bankInfo.name.includes(countryName)}
							in {countryName.toUpperCase()}
							{/if}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="container">
		<div
			class="bg-white py-4 dark:bg-gray-900 dark:text-light dark:border-none"
		>
			<div class="p-4">
				<div class="flex flex-col md:flex-row md:space-x-8 justify-center items-start">
					<!-- First List (Left) -->
					<div
						class="flex-grow md:basis-1/2 p-6 bg-white border rounded-md shadow-t-md mb-8 md:mb-0 dark:bg-gray-900 dark:text-light dark:border-none"
					>
						<div class="overflow-x-auto">
							<table class="table-auto w-full text-sm md:text-base text-left">
								<thead class="whitespace-nowrap">
									<tr class="text-gray-800 dark:text-gray-300">
										<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl">
											SWIFT code
										</th>
										<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl">
											{bankInfo.swift.codes.join(', ')}
										</th>
									</tr>
								</thead>
								<tbody class="banks">
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">Swift code (8 characters)</td>
										{#each bankInfo.swift.details as code}
											<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
												>{code.details.bank}{code.details.country}{code.details.location}</td
											>
										{/each}
									</tr>
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">Branch name</td>
										<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
											>{bankInfo.branch ? bankInfo.branch : ''}</td
										>
									</tr>
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">Branch address</td>
										<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
											>{bankInfo.address ? bankInfo.address : ''}</td
										>
									</tr>
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">Branch code</td>
										{#each bankInfo.swift.details as code}
											<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
												>{code.details.address ? code.details.address : ''}</td
											>
										{/each}
									</tr>
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">Bank name</td>
										<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
											>{bankInfo.name}</td
										>
									</tr>
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">City</td>
										<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
											>{bankInfo.city ? bankInfo.city : ''}</td
										>
									</tr>
									<tr class="border-t border-gray-100 dark:border-gray-800">
										<td class="py-3 px-2 text-xs md:text-sm">Country</td>
										<td class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400"
											>{countryName}</td
										>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Second List (Right) -->
					<div
						class="flex-grow md:basis-2/3 p-6 bg-white rounded-md shadow-t-md dark:bg-gray-900 dark:text-light dark:border-none px-0 md:px-16"
					>
						<h2 class="text-lg md:text-3xl font-normal mb-4">
							{bankInfo.name.toUpperCase()} 
							{#if !bankInfo.name.includes(countryName)}
							in {countryName.toUpperCase()}
							{/if}
							 SWIFT Code Details
						</h2>
						<p class="text-dark dark:text-gray-300">
							A SWIFT/BIC is an 8-11 character code that identifies your country, city, bank, and
							branch.
						</p>

						<div class="container px-0">
							<div class="overflow-x-auto">
								<table class="table-auto w-full text-xs md:text-base text-left md:flexz">
									<tbody>
										<tr class="text-gray-800 dark:text-gray-300 flex">
											<td class="p-2 pr-5"> → </td>
											<td class="p-2">
												<b>Bank code A-Z</b>
												<p class="text-dark dark:text-gray-400">
													4 letters representing the bank. It usually looks like a shortened version
													of that bank's name.
												</p>
											</td>
										</tr>
										<tr class="text-gray-800 dark:text-gray-300 flex">
											<td class="p-2 pr-5"> → </td>
											<td class="p-2">
												<b>Country code A-Z</b>
												<p class="text-dark dark:text-gray-400">
													2 letters representing the country the bank is in.
												</p>
											</td>
										</tr>
										<tr class="text-gray-800 dark:text-gray-300 flex">
											<td class="p-2 pr-5"> → </td>
											<td class="p-2">
												<b>Location code 0-9 A-Z</b>
												<p class="text-dark dark:text-gray-400">
													2 characters made up of letters or numbers. It says where that bank's head
													office is.
												</p>
											</td>
										</tr>
										<tr class="text-gray-800 dark:text-gray-300 flex">
											<td class="p-2 pr-5"> → </td>
											<td class="p-2">
												<b>Branch Code 0-9 A-Z</b>
												<p class="text-dark dark:text-gray-400">
													3 digits specifying a particular branch. 'XXX' represents the bank's head
													office.
												</p>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
