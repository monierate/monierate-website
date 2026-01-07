<script lang="ts">
	import { goto } from '$app/navigation';
	import { faqItems } from './constants';
	import FAQ from '$lib/components/FAQ.svelte';

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
	let bankData: Record<string, { name: string; ussd: string }> = {};

	async function loadBanks() {
		if (!selectedCountry) return;

		try {
			const Banks = await import(
				`../../../../data/banks/${selectedCountry.toLowerCase()}-banks.json`
			);
			bankData = Banks.default || Banks;
			banks = Object.keys(bankData);
			selectedBank = '';
		} catch (error) {
			console.error(`Error loading banks for ${selectedCountry}:`, error);
		}
	}

	function findUssdCode() {
		if (!selectedCountry) {
			alert('Please select a country.');
			return;
		}

		let url = `/${selectedCountry.toLowerCase()}/ussd-codes/banks`;

		if (selectedBank) {
			url += `/${selectedBank.toLowerCase()}`;
		}

		goto(url);
	}

	$: countryName = data.countryName;

	let openQuestion: any = null;

	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
</script>

<svelte:head>
	<title>USSD Codes in Africa: Find Your Bank's USSD Code | Monierate</title>
	<meta
		name="description"
		content="Find your favorite Bank code (USSD) in Africa. Quickly find your bank's code for transfers, top up, and other banking services on Monierate."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Find Bank Codes (USSD) in Africa | Monierate" />
	<meta
		property="og:description"
		content="Find your favorite Bank code (USSD) in Africa. Quickly find your bank's code for transfers, top up, and other banking services."
	/>
	<meta property="og:url" content="monierate.com/{countryCode}/bank-codes" />
	<meta
		property="og:image"
		content="https://monierate.com/uploads/monierate-ussd-code-og-image.png"
	/>
</svelte:head>

<div class="container">
	<h1 class="text-2xl md:text-4xl text-center mb-4 md:mb-8">Bank Codes in Africa</h1>

	<div class="select-form section flex justify-center items-center mb-32">
		<div class="w-full">
			<span class="block text-xl md:text-2xl font-bold mb-4 text-center"
				>Find a Bank Code (USSD) for Transfers and Others</span
			>
			<p class="text-sm md:text-base text-gray-500 mb-8 md:mb-8 text-center">
				Just select the african country and bank below.
			</p>
			<div class="block md:flex md:justify-between md:items-center">
				<!-- Select Country -->
				<span class="block md:w-[49%]">
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
				<span class="block md:w-[49%]">
					<label class="label" for="field-bank">Select Bank</label>
					<select id="field-bank" class="select" bind:value={selectedBank}>
						<option value="" disabled selected>Select Bank</option>
						{#each banks as bank}
							<option value={bank}>{bankData[bank]?.name}</option>
						{/each}
					</select>
				</span>
			</div>

			<div class="mt-4 text-center">
				<button class="button w-full md:w-auto py-4" on:click={findUssdCode}>Find USSD Code</button>
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
						href="/{code.toLowerCase()}/ussd-codes/banks"
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

<div>
	<div class="container mt-8">
		<div>
			<h3 class="text-2xl font-bold mb-4">
				USSD Banking: Your Guide to Seamless Mobile Transactions in Africa
			</h3>
			<p class="text-sm mb-4">
				USSD banking allows you to perform financial transactions directly from your mobile phone,
				even without an internet connection. It's fast, simple, and secure—perfect for managing your
				money on the go.
			</p>
			<p class="text-sm mb-4">
				A USSD <strong>(Unstructured Supplementary Service Data)</strong> code is a protocol used by
				mobile networks to communicate directly with a user's phone via short codes. It provides instant,
				session-based communication, often used for services like balance checks, mobile money transactions,
				and subscriptions.
			</p>
		</div>
	</div>

	<div class="container mt-4">
		<h3 class="text-2xl font-bold mb-4">How USSD Banking Works:</h3>
		<ul class="pl-2">
			<li class="text-sm mb-4">
				<strong>Dial a Code:</strong> Each bank has a unique USSD code, like *737# for GTBank or *894#
				for FirstBank.
			</li>
			<li class="text-sm mb-4">
				<strong>Select a Service:</strong> Follow the prompts to perform tasks such as transfers, bill
				payments, airtime top-ups, or balance inquiries.
			</li>
			<li class="text-sm mb-4">
				<strong>Secure Transactions:</strong> You'll often need a PIN or OTP to complete transactions,
				ensuring your account stays safe.
			</li>
		</ul>
	</div>

	<div class="container mt-4">
		<h3 class="text-2xl font-bold mb-4">How to Register for USSD Banking:</h3>
		<ul class="pl-2">
			<li class="text-sm mb-4">Dial your bank’s USSD code (e.g., *000#)</li>
			<li class="text-sm mb-4">Follow the prompts to link your account.</li>
			<li class="text-sm mb-4">Set up a PIN for secure transactions.</li>
		</ul>
	</div>
</div>

<FAQ {faqItems} />

<div class="container mt-5">
	<h3 class="text-2xl font-bold mb-4">Disclaimer</h3>
	<p class="text-sm mb-4">
		The tools provided on this website are for informational purposes only. While we strive for
		accuracy, we cannot guarantee the correctness of the data. Always verify SWIFT codes with your
		bank, especially for important or time-sensitive transactions.
	</p>
</div>

<style>
	.select-form {
		@apply bg-white dark:bg-gray-900 shadow-lg rounded-lg px-8 py-12 mx-auto;
	}
</style>
