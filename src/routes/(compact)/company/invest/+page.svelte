<script lang="ts">
	import { BOOKING_URL } from '$lib/config';

	const CONTACT_EMAIL = 'hello@monierate.com';
</script>

<svelte:head>
	<title>Invest in Monierate | Building the source of truth for African exchange rates</title>
	<meta
		name="description"
		content="Monierate is building the trusted source of truth for exchange rates across Africa. Learn our story, the problem we're solving, and how to invest."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Invest in Monierate" />
	<meta
		property="og:description"
		content="Monierate is building the trusted source of truth for exchange rates across Africa. Learn our story, the problem we're solving, and how to invest."
	/>
	<meta property="og:url" content="monierate.com/company/invest" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<div class="container mt-8">
	<!-- Hero -->
	<div class="max-w-3xl mb-16">
		<span class="block text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3">
			Invest in us
		</span>
		<h1 class="text-3xl md:text-5xl font-bold mb-6 leading-tight">
			We're building the source of truth for exchange rates in Africa.
		</h1>
		<p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
			Every day, millions of people and businesses ask the same question: <em>what's the real
			rate?</em> Monierate answers it. We aggregate live rates from banks, fintechs, exchanges and
			P2P markets into one trusted place — and we're just getting started.
		</p>
		<div class="flex flex-col sm:flex-row gap-4">
			<a
				href={BOOKING_URL}
				target="_blank"
				rel="noopener"
				class="button bg-blue-500 hover:bg-blue-600 text-white py-3.5 px-6"
			>
				Schedule a call
			</a>
			<a
				href="mailto:{CONTACT_EMAIL}?subject=Investing%20in%20Monierate"
				class="button bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 py-3.5 px-6"
			>
				Email us
			</a>
		</div>
	</div>

	<!-- Who we are -->
	<section class="mb-14 max-w-3xl">
		<h2 class="text-2xl font-bold mb-4">Who we are</h2>
		<p class="text-gray-600 dark:text-gray-300 mb-4">
			Monierate is a currency data company. We track and publish exchange rates across official,
			mid-market and parallel markets — powering a website used by hundreds of thousands of people
			and an API that developers build on top of. What started as a simple rate checker has grown
			into critical infrastructure for anyone who moves money in and out of Africa.
		</p>
	</section>

	<!-- Our story -->
	<section class="mb-14 max-w-3xl">
		<h2 class="text-2xl font-bold mb-4">Our story</h2>
		<p class="text-gray-600 dark:text-gray-300 mb-4">
			We didn't set out to build a company — we set out to solve a problem we lived with. Sending
			and receiving money across borders meant guessing at rates, getting quotes that never matched
			reality, and losing value on every transaction. The information existed, but it was scattered,
			inconsistent, and often deliberately opaque.
		</p>
		<p class="text-gray-600 dark:text-gray-300 mb-4">
			So we started collecting the rates ourselves, comparing providers side by side, and publishing
			the truth for anyone to see. People kept coming back. Then businesses asked for the data. Then
			developers wanted an API. Monierate grew because the need was real and the trust was earned,
			one honest number at a time.
		</p>
	</section>

	<!-- The idea -->
	<section class="mb-14 max-w-3xl">
		<h2 class="text-2xl font-bold mb-4">The idea that birthed us</h2>
		<p class="text-gray-600 dark:text-gray-300 mb-4">
			A simple conviction: <strong>everyone deserves to know the real rate before they transact.</strong>
			Currency markets in emerging economies are fragmented and fast-moving, and the people with the
			least information usually pay the most. We believed transparency itself could be a product — that
			if you make the true price visible, better decisions, fairer markets and new products follow.
		</p>
	</section>

	<!-- The problem -->
	<section class="mb-14 max-w-3xl">
		<h2 class="text-2xl font-bold mb-4">The problem we're solving</h2>
		<ul class="space-y-4 text-gray-600 dark:text-gray-300">
			<li class="flex gap-3">
				<span class="text-blue-500 font-bold">→</span>
				<span
					><strong class="text-gray-900 dark:text-gray-100">Opaque pricing.</strong> Rates differ wildly
					between providers, and there's no neutral place to compare them. People and businesses lose
					money to spreads they can't even see.</span
				>
			</li>
			<li class="flex gap-3">
				<span class="text-blue-500 font-bold">→</span>
				<span
					><strong class="text-gray-900 dark:text-gray-100">Fragmented data.</strong> Official,
					mid-market and parallel rates live in different silos. Getting a complete picture means
					checking a dozen sources by hand.</span
				>
			</li>
			<li class="flex gap-3">
				<span class="text-blue-500 font-bold">→</span>
				<span
					><strong class="text-gray-900 dark:text-gray-100">No reliable infrastructure.</strong>
					Fintechs, marketplaces and developers building for Africa need dependable rate data — and
					have had nowhere trustworthy to get it. Until now.</span
				>
			</li>
		</ul>
	</section>

	<!-- Why now / traction framing -->
	<section class="mb-16 max-w-3xl">
		<h2 class="text-2xl font-bold mb-4">Where we're going</h2>
		<p class="text-gray-600 dark:text-gray-300 mb-4">
			We're turning exchange-rate transparency into the default across Africa — deeper coverage, more
			markets, and the data layer that the next generation of financial products will be built on.
			If that's a future you want to back, we'd love to talk.
		</p>
	</section>

	<!-- CTA -->
	<section class="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-8 md:p-10 mb-16">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold mb-3">Let's talk</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Whether you're an angel, a fund, or a strategic partner — book a call and let's walk you
				through the numbers, the roadmap, and where you fit in.
			</p>
			<div class="flex flex-col sm:flex-row gap-4">
				<a
					href={BOOKING_URL}
					target="_blank"
					rel="noopener"
					class="button bg-blue-500 hover:bg-blue-600 text-white py-3.5 px-6"
				>
					Schedule a call
				</a>
				<a
					href="mailto:{CONTACT_EMAIL}?subject=Investing%20in%20Monierate"
					class="button bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 py-3.5 px-6"
				>
					{CONTACT_EMAIL}
				</a>
			</div>
		</div>
	</section>
</div>
