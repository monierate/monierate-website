<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;
	let groupedByAlpha = data.countries;
	let countryCode = data.countryCode;
	let countryName = data.countryName;

	function scrollToHash(event: MouseEvent) {
		event.preventDefault();

		const target = event.target as HTMLAnchorElement;
		const targetId = target?.getAttribute('href')?.substring(1);

		const targetElement = targetId && document.getElementById(targetId);
		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop - 50,
				behavior: 'smooth'
			});
		}
	}

	let selectedCountry = '';
	let selectedBank = '';
	let selectedCity = '';
	let banks: string[] = [];
	let cities: string[] = [];
	let bankData: Record<string, { name: string; city: string; swift: string }> = {};

    async function loadBanks() {
        if (!selectedCountry) return;

        try {
            const Banks = await import(`../../../../data/banks/${selectedCountry.toLowerCase()}-banks.json`);
            bankData = Banks.default || Banks;
            banks = Object.keys(bankData);
            cities = []; 
            selectedBank = '';
            selectedCity = '';
        } catch (error) {
            console.error(`Error loading banks for ${selectedCountry}:`, error);
        }
    }

	function loadCities() {
		if (!selectedBank || !bankData[selectedBank]) {
			console.error('Invalid bank selection or bank data unavailable.');
			return;
		}
		cities = [bankData[selectedBank].city];
		selectedCity = '';
	}

	function findSwiftCode() {
		if (!selectedCountry) {
			alert('Please select a country.');
			return;
		}

		let url = `/${selectedCountry.toLowerCase()}/swift-codes/providers`;

		if (selectedBank) {
			url += `/${selectedBank.toLowerCase()}`;
		}

		if (selectedCity) {
			const bank = bankData[selectedBank];
			if (bank && bank.city !== selectedCity) {
				alert('SWIFT Code not found for selected details.');
				return;
			}
		}

		goto(url);
	}
</script>

<svelte:head>
	<title>SWIFT Codes in Africa: Find Your Bank's BIC Code | Monierate</title>
	<meta
		name="description"
		content="Learn about SWIFT/BIC codes in Africa on Monierate. Quickly find your bank's code for international money transfers. Ensure your funds reach the right destination account."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="SWIFT Codes in Africa: Find Your Bank's BIC Code | Monierate" />
	<meta
		property="og:description"
		content="Learn about SWIFT/BIC codes in Africa. Quickly find your bank's code for international money transfers. Ensure your funds reach the right destination account."
	/>
	<meta property="og:url" content="monierate.com/{countryCode}/bank-codes" />
	<meta property="og:image" content="https://monierate.com/uploads/monierate-swift-code-og-image.png" />
</svelte:head>

<div class="container">
	<h1 class="text-2xl md:text-4xl text-center mb-4 md:mb-8">SWIFT/BANK codes in Africa</h1>
	
	<div class="select-form section flex justify-center items-center mb-32">
		<div class="w-full">
			<span class="block text-xl md:text-2xl font-bold mb-4 text-center">Find a SWIFT code</span>
			<p class="text-sm md:text-base text-gray-500 mb-8 md:mb-8 text-center">Just select the african country and bank below.</p>
			<div class="block md:flex md:justify-between md:items-center">
				<!-- Select Country -->
				<span class="block md:w-[30%]">
					<label class="label" for="field-country">Select Country</label>
					<select
						id="field-country"
						class="select"
						bind:value={selectedCountry}
						on:change={loadBanks}
					>
						<option value="" disabled selected>Select Country</option>
						{#each Object.entries(groupedByAlpha) as [letter, countries]}
							<optgroup label={letter}>
								{#each Object.entries(countries) as [code, name]}
									<option value={code}>{name}</option>
								{/each}
							</optgroup>
						{/each}
					</select>
				</span>
	
				<!-- Select Bank -->
				<span class="block md:w-[30%]">
					<label class="label" for="field-bank">Select Bank</label>
					<select id="field-bank" class="select" bind:value={selectedBank} on:change={loadCities}>
						<option value="" disabled selected>Select Bank</option>
						{#each banks as bank}
							<option value={bank}>{bankData[bank]?.name}</option>
						{/each}
					</select>
				</span>
	
				<!-- Select City -->
				<span class="block md:w-[30%]">
					<label class="label" for="field-city">Select City</label>
					<select id="field-city" class="select" bind:value={selectedCity}>
						<option value="" disabled selected>Select City</option>
						{#each cities as city}
							<option value={city}>{city}</option>
						{/each}
					</select>
				</span>
			</div>
	
			<div class="mt-4 text-center">
				<button class="button w-full md:w-auto py-4" on:click={findSwiftCode}>Find SWIFT Code</button>
			</div>
		</div>
	</div>

	<div id="grouped" class="select-country section">

		<div class="flex justify-center items-center flex-wrap gap-2 mb-16">
			{#each Object.entries(groupedByAlpha) as [letter]}
				<a
					href="#{letter.toUpperCase()}-label"
					class="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-500 hover:text-white"
					on:click={scrollToHash}
				>
					{letter.toUpperCase()}
				</a>
			{/each}
		</div>

		{#each Object.entries(groupedByAlpha) as [letter, countries]}
			<h3 class="text-lg md:text-xl mb-2 py-2" id="{letter.toUpperCase()}-label">{letter}</h3>
			<div class="block md:flex md:items-center md:flex-wrap">
				{#each Object.entries(countries) as [code, name]}
					<a
						href="/{code.toLowerCase()}/swift-codes/providers"
						class="inline-block w-[100%] md:w-[22%] shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black dark:text-white mr-8 last-child:mr-0 p-4 mb-4"
					>
						<span class="flex items-center">
							<span
								class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4"
								style="background-image: url('https://raw.githubusercontent.com/monierate/asset-icons/refs/heads/main/country-flags-4x3-svg/{code.toLowerCase()}.svg');"
							/>
							<span>{name}</span>
						</span>
					</a>
				{/each}
			</div>
		{/each}
		</div>
</div>

<style>
	.select-form {
		@apply bg-white dark:bg-gray-900 shadow-lg rounded-lg px-8 py-12 mx-auto;
	}
</style>
