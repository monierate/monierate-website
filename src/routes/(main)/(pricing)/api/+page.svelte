<script lang="ts">
	import FAQ from '$lib/components/FAQ.svelte';
	import Pricing from '$lib/components/Pricing.svelte';

	export let data: any;

	let faqItems = [
		{
			question: 'What services does Monierate API offer?',
			answer: 'We offer real-time and historical currency  data for premium FX data.'
		},
		{
			question: 'Do you have a free plan?',
			answer: 'Yes, we offer a free plan for you. You will need to setup an account to access it.'
		},
		{
			question: 'What currencies data type do you support?',
			answer: 'We support official, Midmarket and Black market rates data.'
		},
		{
			question: 'How do I get started using the Monierate API?',
			answer:
				'{link:{account:Setup an account}} on, and choose a plan that suit your need, then you can access the api documentation for integration.'
		},
		{
			question: 'Does Monierate offer any support for API developers?',
			answer: 'Yes, we offer standard support for developers and startups.'
		},
		{
			question: 'What data can I access through the Monierate API?',
			answer: 'You can access real-time currency and historical data through our API.'
		},
		{
			question: 'How do I format my API requests and responses?',
			answer: 'Visit our {link:{docs:documentation guide}} on how to integrate and setup this.'
		},
		{
			question: 'Are there any rate limits for using the Monierate API?',
			answer: 'Rate limiting is dependant on the plan you decide to opt into. See plans'
		},
		{
			question: 'How do I troubleshoot common API issues?',
			answer:
				'Read {link:{docs:API documentation}} and if it persist, you can send us an email at {link:{contact:hello@monierate.com}} '
		}
	];
	let faqLinks = [
		{
			key: 'docs',
			url: 'https://monierate.apidog.io'
		},
		{
			key: 'account',
			url: 'https://account.monierate.com'
		},
		{
			key: 'contact',
			url: 'mailto:hello@monierate.com'
		}
	];
</script>

<svelte:head>
  <title>Monierate API</title>
	<meta name="description" content="Monierate API provides reliable exchange rates for all your applications. Easy to integrate and use.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Monierate API | Exchange Rates Made Easy" />
	<meta property="og:description" content="Monierate API provides reliable exchange rates for all your applications. Easy to integrate and use." />	
	<meta property="og:url" content="monierate.com/api" />
   <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<!-- <div class="bg-white dark:bg-gray-800">
	<div class="container">
		<div class="cedar-money">
			<a href="https://bit.ly/3MDsvBi" target="_blank">
				<picture>
					<source srcset="/media/banners/cedar-homepage.webp?v=1" type="image/avif" />
					<source srcset="/media/banners/cedar-homepage.png?v=1" type="image/gif" />

					<img
						src="/media/banners/cedar-homepage.webp?v=1"
						alt="Cedar Money"
						width="800px"
						height="114px"
						class="mx-auto max-w-full md:w-[800px] md:h-[114px]"
					/>
				</picture>
			</a>
		</div>
	</div>
</div> -->

<div class="container mt-8">
	<div class="mb-16 text-center">
		<h2 class="text-3xl font-bold mb-6">Access our API: Power your solutions with Monierate</h2>
		<div>
			For custom pricing, please contact the team: <a
				href="mailto:hello@monierate.com"
				class="underline text-blue-500 hover:text-blue-700">hello@monierate.com</a
			>
		</div>
	</div>

	<Pricing {data} />
</div>

<div class="py-2 mb-16">
	<div class="container">
		<div class="mb-5 md:mb-0">
			<span class="block text-2xl font-bold mb-3">
				Want a Free Trial?
			</span>
			<p class="text-gray-700 dark:text-gray-300">
				Start for free with our
				<a
					href="https://account.monierate.com/signup"
					class="text-blue-600 dark:text-blue-400 font-medium hover:underline"
				>
					free plan
				</a> today!
			</p>
		</div>
	</div>
</div>

<div class="bg-gray-50 dark:bg-gray-900/60 py-2 mb-16">
	<div class="container flex flex-col md:flex-row md:items-center justify-between">
		<div class="mb-5 md:mb-0">
			<span class="block text-xl font-bold mb-4">Not sure which plan suit your needs?</span>
			<p class="text-gray-600 dark:text-gray-400">
				Reach out to us and our expert, we will revert back between 24hours
			</p>
		</div>
		<div>
			<a
				href="https://calendly.com/monierate/api-intros"
				class="button bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded"
				>Call Us</a
			>
		</div>
	</div>
</div>

<FAQ {faqItems} links={faqLinks} coverPage={false} />

<div class="bg-gray-50 dark:bg-gray-900/60 py-2 mt-16">
	<div class="container flex flex-col md:flex-row md:items-center justify-between">
		<div class="mb-5 md:mb-0">
			<span class="block text-xl font-bold mb-4">Already have a plan?</span>
			<p class="text-gray-600 dark:text-gray-400">Read our API documentation</p>
		</div>
		<div>
			<a
				href="https://monierate.apidog.io"
				target="_blank"
				class="button bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded"
				>Get API Documentation</a
			>
		</div>
	</div>
</div>
