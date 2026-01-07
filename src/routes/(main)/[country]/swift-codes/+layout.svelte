<script context="module">
	export const faqItems = [
		{
			question: 'What are SWIFT codes?',
			answer: `
                A SWIFT code is a set of 8 or 11 digits that represents a bank branch. You'll need to use one when sending money internationally.
                <a href="/ng/swift-codes">Find your SWIFT code here</a>
            `
		},
		{
			question: 'Is a SWIFT code the same for all branches?',
			answer: `Not every bank branch has a SWIFT code, which means you can usually use the code for the bank's head office.`
		},
		{
			question: 'Do I need an IBAN number as well?',
			answer: `
                It depends on the country you're sending money to. In the Eurozone, you'll always need an IBAN and a SWIFT/BIC code. 
                Banks in the USA use SWIFT codes, but they don't use IBANs. It's the same in New Zealand too. 
            `
		}
	];
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import AdBanner from '$lib/components/AdBanner.svelte';
	export let data;

	$: currentPath = $page.url.pathname;
	$: bankName = data.bankName;
	$: countryName = data.countryName;

	let countryCode = data.countryCode;
	let openQuestion: any = null;

	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
</script>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="bank_codes" />
</div>

<slot />

<div>
	<div class="container mt-8">
		<div>
			<h3 class="text-2xl font-bold mb-4">
				SWIFT Codes: Your Guide to International Money Transfers in
				{#if bankName}
					to {bankName}
					{bankName.toLowerCase().includes(countryName.toLowerCase()) ? '' : countryName}
				{:else}
					{currentPath.endsWith('/swift-codes') || currentPath.endsWith('/swift-codes/')
						? 'Africa'
						: countryName}
				{/if}
			</h3>
			<p class="text-sm mb-4">
				Are you sending or receiving money internationally
				{#if bankName}
					to {bankName}
					{bankName.toLowerCase().includes(countryName.toLowerCase()) ? '' : countryName}
				{:else}
					{currentPath.endsWith('/swift-codes') || currentPath.endsWith('/swift-codes/')
						? 'from Africa'
						: 'from ' + countryName}
				{/if}
				? Understanding SWIFT codes is essential for ensuring your transactions are accurate and efficient.
			</p>
			<p class="text-sm mb-4">
				A SWIFT code, also known as a BIC (Bank Identifier Code), is a unique identifier for banks
				and branches worldwide. It's used to route international wire transfers and messages.
			</p>
		</div>
	</div>

	<div class="container mt-4">
		<h3 class="text-2xl font-bold mb-4">How SWIFT Codes Work:</h3>
		<ul class="pl-2">
			<li class="text-sm mb-4">
				<strong>Identification:</strong> SWIFT codes pinpoint specific banks and branches, ensuring your
				funds reach the correct destination.
			</li>
			<li class="text-sm mb-4">
				<strong>International Transfers:</strong> Banks use these codes to process international money
				transfers seamlessly.
			</li>
			<li class="text-sm mb-4">
				<strong>Format:</strong> SWIFT codes consist of 8 or 11 characters. An 11-digit code specifies
				a branch, while an 8-digit code (or one ending in 'XXX') represents the bank's head office.
			</li>
		</ul>
	</div>

	<div class="container mt-4">
		<h3 class="text-2xl font-bold mb-4">SWIFT Code Registration:</h3>
		<p class="text-sm mb-4">
			The Society for Worldwide Interbank Financial Telecommunication (SWIFT) manages SWIFT code
			registrations.
		</p>
	</div>
</div>

<div class="container py-10 px-5">
	<h3 class="text-2xl font-bold mb-4">Your Questions, Answered</h3>

	{#each faqItems as { question, answer }, index}
		<div class="border-b border-gray-700">
			<button
				on:click={() => toggleQuestion(index)}
				class="w-full text-left py-4 flex justify-between items-center"
			>
				<span class="text-xl font-medium">{question}</span>

				<svg
					class={`w-6 h-6 transition-transform duration-300 ease-in-out ${
						openQuestion === index ? 'rotate-180' : ''
					}`}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<div
				class={`overflow-hidden transition-all duration-500 ease-in-out ${
					openQuestion === index ? 'max-h-screen py-4' : 'max-h-0'
				}`}
			>
				<p class="px-4 text-gray-600 dark:text-gray-400">{@html answer}</p>
			</div>
		</div>
	{/each}
</div>

<div class="container mt-5">
	<h3 class="text-2xl font-bold mb-4">Disclaimer</h3>
	<p class="text-sm mb-4">
		The tools provided on this website are for informational purposes only. While we strive for
		accuracy, we cannot guarantee the correctness of the data. Always verify SWIFT codes with your
		bank, especially for important or time-sensitive transactions.
	</p>
</div>
