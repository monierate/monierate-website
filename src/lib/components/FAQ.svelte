<!-- 
This <FAQ> component renders a Frequently Asked Questions (FAQ) section. 
It receives three props:
  - faqItems: An array of question-answer objects.
  - links: An array of key-value pairs for external links.
  - coverPage: A boolean indicating whether to display a cover page (false in this case).

Example Usage:

const faqItems = [
    {
        question: "What is the Monierate API?",
        answer: "The Monierate API provides seamless..."
    },
    {
        question: "Where can I find API documentation?",
        answer: "Visit our {link: {docs: API Docs}} for detailed endpoints, request formats, and response examples."
    }
];

const faqLinks = [
    {
        key: "docs",
        url: "https://docs.monierate.com"
    }
];

<FAQ faqItems={faqItems} links={faqLinks} coverPage={false} />

Explanation of `{link: {docs: API Docs}}`:
- This is a dynamic placeholder in the FAQ's answer text. The `link` (`_link` for target blank) object references a URL (in this case, for API documentation).
- The `docs` key corresponds to a link key defined in the `faqLinks` array, where the value of `docs` is the URL: `https://docs.monierate.com`.
- The text `API Docs` is the display text that will appear as a clickable link to the user.
-->

<script lang="ts">
	export let faqItems: Array<{ question: string; answer: string }>;
	export let links: Array<{ key: string; url: string }> = [];
	export let coverPage: boolean = true;
	export let useContainer: boolean = true;
	let openQuestion: any = null;
	faqItems = faqItems.map((faq) => {
		let updatedAnswer = faq.answer;

		updatedAnswer = updatedAnswer.replace(
			/\{(_?)link:\s*\{\s*(\w+)\s*:\s*([^}]+)\s*\}\}/gi,
			(_, underscore, key, text) => {
				const linkObj = links.find((l) => l.key === key);
				if (!linkObj) return `{${underscore}link: {${key}: ${text}}}`;

				const targetAttr = underscore ? ' target="_blank"' : '';
				return `<a href="${linkObj.url}"${targetAttr}>${text}</a>`;
			}
		);

		return { ...faq, answer: updatedAnswer };
	});
	function toggleQuestion(index: any) {
		openQuestion = openQuestion === index ? null : index;
	}
</script>

<div class="{useContainer ? "container": ""} py-10 px-5">
	<div class={coverPage ? '' : 'max-w-3xl m-auto'}>
		<h3 class="text-2xl font-bold mb-10 {coverPage ? '' : 'text-center'}">
			Frequently asked questions
		</h3>

		{#each faqItems as { question, answer }, index}
			<div class="border-b border-gray-300 dark:border-gray-600">
				<button
					on:click={() => toggleQuestion(index)}
					class="w-full text-left py-4 flex justify-between items-center"
				>
					<span
						class="text-xl font-medium {openQuestion === index
							? 'text-gray-900 dark:text-gray-100'
							: 'text-gray-700 dark:text-gray-300'}">{question}</span
					>

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
</div>
