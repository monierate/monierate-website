<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import { faqItems } from '../constants';
	import FAQ from '$lib/components/FAQ.svelte';

	export let data;

	let leftSection!: HTMLDivElement;
	let observer: IntersectionObserver;

	onMount(() => {
		const footer = document.querySelector('footer');
		if (!footer) return;

		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					// Footer is visible — stop sticking
					leftSection.classList.remove('sticky', 'top-16');
					leftSection.classList.add('absolute', 'bottom-0');
				} else {
					// Normal scroll — stay sticky
					leftSection.classList.add('sticky', 'top-16');
					leftSection.classList.remove('absolute', 'bottom-0');
				}
			},
			{
				root: null,
				threshold: 0,
				rootMargin: '0px 0px -15% 0px' // stop slightly before touching
			}
		);

		observer.observe(footer);
	});

	onDestroy(() => {
		if (observer) observer.disconnect();
	});

	$: countryName = data.countryName;
</script>

<div class="container relative">
	<div class="flex flex-col md:flex-row gap-4 justify-center items-start">
		<!-- Left sticky section -->
		<div
			bind:this={leftSection}
			class="hidden md:block md:w-1/4 relative sticky top-4 transition-all duration-300"
		>
			<div class="bg-white dark:bg-gray-800">
				<AdBanner name="bank_codes_side" />
			</div>
		</div>

		<div class="md:w-3/4">
			<slot />

			<div>
				<div class="mt-16">
					<div>
						<h3 class="text-2xl font-bold mb-4">
							USSD Banking: Your Guide to Seamless Mobile Transactions in {countryName}
						</h3>
						<p class="text-sm mb-4">
							USSD banking allows you to perform financial transactions directly from your mobile
							phone, even without an internet connection. It's fast, simple, and secure—perfect for
							managing your money on the go.
						</p>
						<p class="text-sm mb-4">
							A USSD <strong>(Unstructured Supplementary Service Data)</strong> code is a protocol used
							by mobile networks to communicate directly with a user's phone via short codes. It provides
							instant, session-based communication, often used for services like balance checks, mobile
							money transactions, and subscriptions.
						</p>
					</div>
				</div>

				<div class="mt-4">
					<h3 class="text-2xl font-bold mb-4">How USSD Banking Works:</h3>
					<ul class="pl-2">
						<li class="text-sm mb-4">
							<strong>Dial a Code:</strong> Each bank has a unique USSD code, like *737# for GTBank or
							*894# for FirstBank.
						</li>
						<li class="text-sm mb-4">
							<strong>Select a Service:</strong> Follow the prompts to perform tasks such as transfers,
							bill payments, airtime top-ups, or balance inquiries.
						</li>
						<li class="text-sm mb-4">
							<strong>Secure Transactions:</strong> You'll often need a PIN or OTP to complete transactions,
							ensuring your account stays safe.
						</li>
					</ul>
				</div>

				<div class="mt-4">
					<h3 class="text-2xl font-bold mb-4">How to Register for USSD Banking:</h3>
					<ul class="pl-2">
						<li class="text-sm mb-4">Dial your bank’s USSD code (e.g., *000#)</li>
						<li class="text-sm mb-4">Follow the prompts to link your account.</li>
						<li class="text-sm mb-4">Set up a PIN for secure transactions.</li>
					</ul>
				</div>

				<FAQ {faqItems} useContainer={false}/>

				<div class="mt-5">
					<h3 class="text-2xl font-bold mb-4">Disclaimer</h3>
					<p class="text-sm mb-4">
						The tools provided on this website are for informational purposes only. While we strive
						for accuracy, we cannot guarantee the correctness of the data. Always verify SWIFT codes
						with your bank, especially for important or time-sensitive transactions.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
