<script>
    import { browser } from "$app/environment";
	import { onMount } from 'svelte';

    /** @type {import('./$types').PageServerData} */
    let fieldBank;
    let accountNumber = '';
    let accountName = '';
    let bankCode = '';
    let bankName = '';
    let accountType = '';

    const validateAccount = () => {
        console.log(fieldBank);

        if (accountNumber.length !== 10) {
            alert('Invalid account number');
            return;
        }

        alert('Valid account number');
    } 
</script>

<svelte:head>
	<title>Simple Nuban Validation | Monierate</title>
	<meta name="description" content="Use this tool to validate your nuban. Verify any 10-digit Nigeria bank account number. Learn what NUBAN is and how to get your own 10-digit NUBAN.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Simple Nuban Validation | Monierate" />
	<meta property="og:description" content="Use this tool to validate your nuban. Verify any 10-digit Nigeria bank account number. Learn what NUBAN is and how to get your own 10-digit NUBAN." />
	<meta property="og:url" content="monierate.com/tools/banking/nuban-validation" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">

    <!-- Choices js -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
</svelte:head>

<div>
    <div class="container text-left md:text-center">
        <h1 class="text-3xl md:text-5xl mb-4">
            Simple Nuban Validation
        </h1>
        <p class="mb-4 text-sm md:text-base md:w-[800px] md:mx-auto">
            Use this free Nuban validation form to validate your NUBAN. Verify any 10-digit Nigeria bank account number. Learn what NUBAN is and how to get your own 10-digit NUBAN <a href="https://monierate.com/blog/nuban-what-it-is-and-how-to-get-yours">here</a>.
        </p>
    </div>
</div>

<main>
    <div class="w-[100%] md:w-[400px] mx-auto dark:bg-gray-900 p-6">
        <div class="mb-4">
            <label for="field-account-number" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Account Number</label>
            <input type="text" id="field-account-number" name="accountNumber" required pattern="\d{10}" class="input" bind:value={accountNumber}>
        </div>
        <div class="mb-4">
            <label for="field-bank" class="block text-sm font-medium text-gray-700 dark:text-gray-200">Bank</label>
            <select id="field-bank" name="bank" class="select" bind:value={fieldBank}>
                <option value="banka" selected>Bank A</option>
                <option value="bankb">Bank B</option>
                <option value="bankc">Bank C</option>
                <!-- Add more banks as needed -->
            </select>
        </div>
        <div class="py-8">
            <button type="submit" class="button w-full" on:click={validateAccount}>Check Account</button>
        </div>
    </div>
</main>

<style>

</style>