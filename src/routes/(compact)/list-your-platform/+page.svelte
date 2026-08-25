<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { toggleButtonLoad, toggleMessage } from '$lib/functions';
	import { BOOKING_URL } from '$lib/config';

	// Cloudflare Turnstile is enabled only when a public site key is configured.
	const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY;

	let platform = '';
	let name = '';
	let email = '';
	let website = '';
	let volume = '';
	let message = '';
	let company = ''; // honeypot — must stay empty
	let turnstileToken = '';
	let turnstileWidgetId: string | undefined;
	let submitted = false;

	function renderTurnstile() {
		const turnstile = (window as any).turnstile;
		if (!turnstileSiteKey || !turnstile) return;
		turnstileWidgetId = turnstile.render('#turnstile-widget', {
			sitekey: turnstileSiteKey,
			callback: (token: string) => (turnstileToken = token),
			'expired-callback': () => (turnstileToken = ''),
			'error-callback': () => (turnstileToken = '')
		});
	}

	function resetTurnstile() {
		const turnstile = (window as any).turnstile;
		turnstileToken = '';
		if (turnstile && turnstileWidgetId !== undefined) turnstile.reset(turnstileWidgetId);
	}

	onMount(() => {
		if (!turnstileSiteKey) return; // Turnstile disabled
		if ((window as any).turnstile) {
			renderTurnstile();
			return;
		}
		(window as any).onloadTurnstileCallback = renderTurnstile;
		if (!document.querySelector('script[data-turnstile]')) {
			const s = document.createElement('script');
			s.src =
				'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
			s.async = true;
			s.defer = true;
			s.setAttribute('data-turnstile', '');
			document.head.appendChild(s);
		}
	});

	const submit = async () => {
		if (platform.trim().length === 0) {
			toggleMessage('Please enter your platform name.');
			return;
		}
		if (name.trim().length === 0) {
			toggleMessage('Please enter your name.');
			return;
		}
		if (!email.includes('@')) {
			toggleMessage('Please enter a valid work email.');
			return;
		}
		if (turnstileSiteKey && !turnstileToken) {
			toggleMessage('Please complete the verification below.');
			return;
		}

		toggleButtonLoad('#btn-list');

		try {
			const response = await fetch('/list-your-platform', {
				method: 'POST',
				body: JSON.stringify({
					platform,
					name,
					email,
					website,
					volume,
					message,
					company,
					turnstile: turnstileToken
				})
			});
			const json = await response.json();

			if (json.status === 'error') {
				resetTurnstile(); // tokens are single-use; get a fresh one for retry
				toggleMessage(json.message || 'Something went wrong. Please try again.');
				return;
			}

			submitted = true;
		} catch (e) {
			resetTurnstile();
			toggleMessage('Something went wrong. Please try again.');
		}
	};
</script>

<svelte:head>
	<title>List your platform on Monierate</title>
	<meta
		name="description"
		content="Get your exchange, fintech or P2P platform listed on Monierate and reach thousands of people comparing exchange rates every day. Submit a listing request."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="List your platform on Monierate" />
	<meta
		property="og:description"
		content="Get your exchange, fintech or P2P platform listed on Monierate and reach thousands of people comparing exchange rates every day."
	/>
	<meta property="og:url" content="monierate.com/list-your-platform" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<div class="container mt-8">
	<div class="grid md:grid-cols-2 gap-12 items-start">
		<!-- Left: pitch -->
		<div class="max-w-xl">
			<span
				class="block text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3"
			>
				List your platform
			</span>
			<h1 class="text-3xl md:text-4xl font-bold mb-6 leading-tight">
				Get in front of people ready to transact.
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
				Thousands of people compare exchange rates on Monierate every day to decide where to buy,
				sell and swap. List your exchange, fintech or P2P platform and put your rates in front of
				them at the moment they're making a decision.
			</p>

			<div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 mb-8">
				<span class="block text-3xl font-bold text-blue-600 dark:text-blue-400">10M+</span>
				<span class="text-sm text-gray-600 dark:text-gray-300">
					page views within 3 years of launch — and growing.
				</span>
			</div>

			<ul class="space-y-4 text-gray-600 dark:text-gray-300 mb-8">
				<li class="flex gap-3">
					<span class="text-blue-500 font-bold">✓</span>
					<span>Reach high-intent users actively comparing rates and providers.</span>
				</li>
				<li class="flex gap-3">
					<span class="text-blue-500 font-bold">✓</span>
					<span>Feature your live rates across relevant currency pairs and markets.</span>
				</li>
				<li class="flex gap-3">
					<span class="text-blue-500 font-bold">✓</span>
					<span>We review every request and follow up personally to get you set up.</span>
				</li>
			</ul>

			<p class="text-gray-600 dark:text-gray-300">
				Prefer to talk first?
				<a
					href={BOOKING_URL}
					target="_blank"
					rel="noopener"
					class="text-blue-600 dark:text-blue-400 font-medium hover:underline">Book a call</a
				>
				and we'll walk you through it.
			</p>
		</div>

		<!-- Right: form -->
		<div class="border border-[var(--card-border)] rounded-2xl p-6 md:p-8">
			{#if submitted}
				<div class="text-center py-10">
					<div class="text-4xl mb-4">🎉</div>
					<h2 class="text-2xl font-bold mb-3">Request received</h2>
					<p class="text-gray-600 dark:text-gray-300 mb-6">
						Thanks — we've got your listing request. Our team will review it and reach out to you at
						<strong>{email}</strong> to follow up and book a call.
					</p>
					<a
						href={BOOKING_URL}
						target="_blank"
						rel="noopener"
						class="button bg-blue-500 hover:bg-blue-600 text-white py-3 px-6"
					>
						Book a call now
					</a>
				</div>
			{:else}
				<h2 class="text-xl font-bold mb-1">Submit a listing request</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
					Tell us about your platform and we'll be in touch.
				</p>

				<label for="field-platform" class="label">Platform name *</label>
				<input
					id="field-platform"
					type="text"
					class="input"
					placeholder="e.g. Acme Exchange"
					bind:value={platform}
				/>

				<label for="field-name" class="label">Your name *</label>
				<input
					id="field-name"
					type="text"
					class="input"
					placeholder="Full name"
					bind:value={name}
				/>

				<label for="field-email" class="label">Work email *</label>
				<input
					id="field-email"
					type="email"
					class="input"
					placeholder="you@company.com"
					bind:value={email}
				/>

				<label for="field-website" class="label">Website</label>
				<input
					id="field-website"
					type="url"
					class="input"
					placeholder="https://"
					bind:value={website}
				/>

				<label for="field-volume" class="label">Approx. monthly volume</label>
				<input
					id="field-volume"
					type="text"
					class="input"
					placeholder="e.g. $500k / month"
					bind:value={volume}
				/>

				<!-- Honeypot: hidden from users, only bots fill it. Server drops if set. -->
				<div class="hidden" aria-hidden="true">
					<label for="field-company">Company (leave blank)</label>
					<input
						id="field-company"
						type="text"
						tabindex="-1"
						autocomplete="off"
						bind:value={company}
					/>
				</div>

				<label for="field-message" class="label">Anything else?</label>
				<textarea
					id="field-message"
					class="input"
					rows="3"
					placeholder="Tell us about your platform, the pairs you support, etc."
					bind:value={message}
				></textarea>

				{#if turnstileSiteKey}
					<div id="turnstile-widget" class="mb-4"></div>
				{/if}

				<span id="alert" class="block hidden py-2"></span>

				<button
					id="btn-list"
					class="button bg-black text-white w-full py-3.5 mt-2"
					on:click={submit}
				>
					Submit listing request
				</button>
			{/if}
		</div>
	</div>
</div>
