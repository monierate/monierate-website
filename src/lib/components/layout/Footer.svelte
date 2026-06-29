<script lang="ts">
	let year = new Date().getFullYear();
</script>

<footer class="pt-16 pb-8 mt-8 text-gray-500 dark:text-gray-300">
	<div class="container mx-auto block md:flex justify-between item-center">
		<div class="w-full md:w-[30%]">
			<h3 class="font-bold">Currency converter</h3>
			<ul class="py-4 converter-list">
				<li>
					<a data-sveltekit-reload href="/converter/bybit?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Bybit</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/bitnob?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Bitnob</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/chippercash?Amount=1&From=USD&To=NGN"
						>Convert USD on Chipper Cash</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/eversend?Amount=1&From=USD&To=NGN"
						>Convert USD on Eversend</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/boundlesspay?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Boundlesspay</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/noones?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Noones</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/quidax?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Quidax</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/luno?Amount=1&From=USDC&To=NGN"
						>Convert USDC on Luno</a
					>
				</li>
				<li>
					<a data-sveltekit-reload href="/converter/gate?Amount=1&From=USDT&To=NGN"
						>Convert USDT on Gate.com</a
					>
				</li>
			</ul>
		</div>
		<div class="w-full md:w-[30%]">
			<h3 class="font-bold">Tools</h3>
			<ul class="py-4 converter-list">
				<li><a href="/api">Currency API</a></li>
				<!-- <li><a href="/alerts">Price Alerts</a></li> -->
				<li><a href="/converter">Currency Converter</a></li>
				<li><a href="/ng/ussd-codes">Bank USSD Codes</a></li>
				<li><a href="/ng/swift-codes">SWIFT Codes</a></li>
			</ul>
		</div>
		<div class="w-full md:w-[40%]">
			<span class="block mb-8">
				<h3 class="font-bold block mb-2 text-gray-800 dark:text-gray-300">Contacts</h3>
				<span class="font-bold text-xl block mb-2 text-gray-800 dark:text-gray-300"
					>hello@monierate.com</span
				>
			</span>

			<span class="block mb-8">
				<ul class="flex justify-left mt-5 space-x-5">
					<li>
						<a
							href="https://x.com/monierate"
							title="x.com"
							class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
						>
							<!-- X -->
							<span class="[&>svg]:h-5 [&>svg]:w-5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
									<path
										d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
									/>
								</svg>
							</span>
						</a>
					</li>

					<li>
						<a
							href="https://www.tiktok.com/@monierate"
							title="tiktok.com"
							class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
						>
							<!-- X -->
							<span class="[&>svg]:h-5 [&>svg]:w-5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
									<path
										d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"
									/>
								</svg>
							</span>
						</a>
					</li>

					<li>
						<a
							href="https://linkedin.com/company/monierate"
							title="linkedin.com"
							class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400"
						>
							<!-- Linkedin -->
							<span class="[&>svg]:h-5 [&>svg]:w-5">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
									<path
										d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"
									/>
								</svg>
							</span>
						</a>
					</li>
				</ul>
			</span>

			<span class="block text-sm">
				&copy; {year}, Monierate.com.
			</span>

			<div class="mt-4">
				<p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
					We aggregate the exchange rates from multiple market providers. This is for informational
					purposes only.
				</p>
				<p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
					References made to third party names, logos and trademarks on this website are to identify
					corresponding goods and services that Monierate visitor can themselves exchange
					currencies. Unless otherwise specified, the trademark holders are not affiliated with
					Monierate, our products or website, and they do not sponsor or endorse Monierate services.
					Such references are included strictly as nominative fair use under applicable trademark
					law and remain fully the property of their respective trademark holders.
				</p>
				<p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
					If you subscribe for our exchange rate <a href="/alert" class="underline">alert</a>, you
					understand and accept the
					<a href="/policy/data" class="underline">Monierate data policy</a>.
				</p>
			</div>
		</div>
	</div>
</footer>

<style>
	footer .converter-list {
		@apply py-4;
	}
	footer .converter-list li {
		@apply mb-4;
	}
	footer .converter-list a {
		@apply block text-sm text-gray-500 font-semibold dark:text-gray-300;
	}
</style>
