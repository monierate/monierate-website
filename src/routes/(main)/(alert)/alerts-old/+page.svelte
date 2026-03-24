<script>
	import { goto, invalidateAll } from '$app/navigation';
    import {  clearPopup, toggleButtonLoad, toggleMessage, togglePopup } from '$lib/functions'
	import Money from '$lib/money';
	import { onMount } from 'svelte';

    export let data

    let auth = data.auth
    let confirm = data.confirm
    const market_avg_rate = Number(`${data.market_avg_rate}`);
    
    let authenticated = false

    onMount( ()=> {
        if (confirm != null) {
            togglePopup(confirm)
            goto('/alerts')
        }

        if (auth != null) {
            if (auth.status == "error") {
                togglePopup(auth)
            }
            else if (auth.status == "success") {
                authenticated = true
            }

            console.log(auth)
        }
    })

    let email = ""
    let emailManage = ""
    let interval = "WEEK"

	const subscribe = async () => {
        console.log(interval)

        let emailField = document.querySelector('#field-email')
        let intervalField = document.querySelector('#field-interval')

        if (!interval) {
            intervalField?.classList.add("border-red-600")
            toggleMessage("Select interval")
            return
        }
        
        intervalField?.classList.remove('border-red-600')

        if (email.length == 0) {
            emailField?.classList.add("border-red-600")
            toggleMessage("Input your email, please.")
            return
        }

        emailField?.classList.remove('border-red-600')

        toggleButtonLoad("#btn-subscribe")

        const payload = {
            email,
            interval,
        }
        const response = await fetch('/api/alerting', {
            method: 'PUT',
            body: JSON.stringify(payload)
        })
        const json = await response.json();

        toggleButtonLoad("#btn-subscribe")
        togglePopup(json)

        if (json.status == "error") {
            return
        }

        email = ""
    }

    const deleteAlert = async (id) => {
        
        if (id.length == 0) {
            return
        }

        const payload = {
            id,
        }
        const response = await fetch('/api/alerting', {
            method: 'DELETE',
            body: JSON.stringify(payload)
        })
        const json = await response.json();
        
        togglePopup(json)

        if (json.status == "error") {
            return
        }

        invalidateAll()
    }

    const login = async () => {
        let emailField = document.querySelector('#manage-field-email')

        if (emailManage.length == 0) {
            emailField?.classList.add("border-red-600")
            alert("Input your email, please.")
            return
        }

        emailField?.classList.remove('border-red-600')

        toggleButtonLoad("#btn-login")

        const payload = {
            email: emailManage
        }
        const response = await fetch('/api/alerting', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        const json = await response.json();
        console.log(json);

        toggleButtonLoad("#btn-login")
        togglePopup(json)

        if (json.status == "error") {
            return
        }

        email = ""
    }
</script>

<svelte:head>
	<title>Naira Rate Alerts | Monierate</title>
	<meta name="description" content="Get naira exchange rates straight to your email inbox every day or week.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Naira Rate Alerts | Monierate" />
	<meta property="og:description" content="Get naira exchange rates straight to your email inbox every day or week." />
	<meta property="og:url" content="monierate.com/alerts" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<main class="container md:w-[768px] md:mx-auto">

    <div class="top-landscape mb-8">
        <a href="https://tinyurl.com/cedar-monierate-banner" target="_blank">
            <picture>
                <source srcset="/media/banners/cedar.avif?v=1" type="image/avif" />
                <source srcset="/media/banners/cedar.gif?v=2" type="image/gif" />

                <img
                    src="/media/banners/cedar.gif?v=2"
                    alt="Ceder"
                    width="320px"
                    height="100px"
                    class="mx-auto max-w-full md:w-[320px] md:h-[100px] md:hidden"
                />
            </picture>
        </a>
    </div>

    <section class="w-full mx-auto pb-16 text-center">
        <h1 class="text-2xl md:text-5xl mb-2 dark:text-gray-100">
            Naira Rate Alerts
        </h1>
        <span class="text-lg">
            The NGN rate is disorganized and unstable. Stay ahead every Monday.
        </span>
    </section>

    <section class="w-[95%] md:w-[80%] mx-auto">
        <div class="border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-900 px-6 py-8 mb-8">
            <h2 class="text-xl md:text-2xl mb-6">
                Get rate alerts straight to your email inbox
            </h2>

            <div class="mb-8">
                <label for="field-interval" class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-4">
                    Every
                </label>
                <select bind:value={interval} id="field-interval" class="inline-block border rounded border-gray-400 dark:text-white dark:bg-gray-800 dark:border-gray-900 px-4 py-[0.4em]">
                    <!-- <option value="DAY">Day</option> -->
                    <option value="WEEK" selected>Monday</option>
                </select>
            </div>
    
            <div>
                <label for="field-email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email address</label>
                <input type="email" class="input w-full" id="field-email" placeholder="Email address" bind:value={email}>
            </div>
            
            <span id="alert" class="block hidden py-4"></span>
    
            <div class="text-center mb-8">
                <button class="button py-4" id="btn-subscribe" on:click={subscribe}>
                    Get rate alerts
                </button>
            </div>

            <div class="text-center font-semibold">
                $1 = ₦{Money.format(market_avg_rate)} (market avg)
            </div>
        </div>

        {#if authenticated == true }
            <div class="border border-gray-300 rounded dark:border-gray-800 px-6 py-8 mb-12">
                <h2 class="text-xl md:text-2xl mb-6">
                    My alerts
                </h2>
                
                {#if data.alerts.length > 0 }
                <table class="table-auto overflow-x-scroll w-full text-sm text-left">
                    <tbody class="changers">
                        {#each Object.entries(data.alerts) as [index, alert]}
                        <tr class="mb-4">
                            <td>{alert.market.toUpperCase()}</td>
                            <td>{alert.interval}</td>
                            <td>{alert.currency}</td>
                            <td>{alert.currency_in}</td>
                            <td>
                                <button class='text-red-600' on:click={ () => deleteAlert(alert.id) }>Delete</button>
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {:else }
                    <span>You currently have no alerts</span>
                {/if}
            </div>
        {:else}
            <div class="border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-900 px-6 py-8 mb-8">
                <h2 class="text-xl md:text-2xl mb-6">
                    Delete alerts
                </h2>
                <span class="block mb-8 text-gray-600 dark:text-gray-300">
                    A magic link will be sent to your email to manage existing your alerts.
                </span>
        
                <div>
                    <label for="field-email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email address</label>
                    <input type="email" class="input w-full rounded-lg" id="manage-field-email" placeholder="Email address" bind:value={emailManage}>
                </div>
                
                <span id="alert" class="block hidden py-4"></span>
        
                <div class="text-center mb-8">
                    <button class="button py-4 mt-4" id="btn-login" on:click={login}>
                        Send magic link
                    </button>
                </div>
            </div>
        {/if}

        <div class="mt-12">
            <span class="block text-sm text-gray-600 dark:text-gray-300">
                We source currency data from multiple providers. If you subscribe for our exchange alert, you understand and accept the <a href="/policy/data">Monierate data policy</a>.
            </span>
        </div>
    </section>
</main>

<div id="popup" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden w-full overflow-y-hidden h-[calc(100%)] max-h-full hidden bg-gray-50 dark:bg-gray-300">
    <div class="w-full flex flex-col justify-center h-[100vh]">
        <div class="w-[80%] md:w-[500px] min-h-[240px] mx-auto relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="p-6 text-center">
                <svg class="mx-auto mb-6 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 class="text-lg font-normal text-gray-500 dark:text-gray-100 mb-8" id="popup-message">message here</h3>
                <button on:click={clearPopup} type="button" class="button">
                    Okay
                </button>
            </div>
        </div>
    </div>
</div>