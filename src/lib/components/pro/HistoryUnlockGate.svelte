<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { login_uri } from '$lib/functions';
  import { ACCOUNT_URL } from '$lib/config';
  import { proSignupUrl, proLearnMoreUrl } from '$lib/utils/pro';
  import { getDayPass, buyDayPass, type DayPassStatus } from '$lib/services/billing.service';

  /**
   * The row-limit gate for OHLC/index history tables. Session and wallet are
   * shared with the dashboard (same `user_token` cookie, same account API), so
   * a signed-in visitor can unlock today's full history straight from their
   * wallet — no separate account needed. Signed-out visitors are sent to sign
   * in on pro.monierate.com first.
   */
  let {
    label,
    onUnlock,
    source,
    learnMoreHref,
  }: {
    /** Whose history is withheld, e.g. "Bybit" or "index" — named in the headline. */
    label: string;
    /** Called once a day pass purchase succeeds, so the caller can lift its lock. */
    onUnlock: () => void;
    /** Feeds the "Get Pro" CTA's attribution. */
    source: string;
    learnMoreHref?: string;
  } = $props();

  const isLoggedIn = $derived($page.data?.auth?.isLoggedIn === true);
  const linkParams = $derived({ feature: 'ohlc-full-history', source });
  const signupHref = $derived(proSignupUrl(linkParams));
  const learnHref = $derived(learnMoreHref ?? proLearnMoreUrl(linkParams));
  const signInHref = $derived(login_uri($page.url.pathname + $page.url.search));

  let pass = $state<DayPassStatus | null>(null);
  let passLoading = $state(false);
  let buying = $state(false);
  let unlocked = $state(false);
  let error = $state('');

  // Day-pass status (and the wallet balance it carries) is only worth fetching
  // once we know there's a session to check it against.
  onMount(async () => {
    if (!isLoggedIn) return;
    passLoading = true;
    try {
      pass = await getDayPass();
    } finally {
      passLoading = false;
    }
  });

  const canAfford = $derived(!!pass && pass.wallet_balance >= pass.price);
  const sym = $derived(pass?.currency === 'USD' ? '$' : '₦');
  const priceLabel = $derived(pass ? `${sym}${pass.price.toLocaleString('en-NG')}` : '');
  const walletHref = `${ACCOUNT_URL}/wallet`;

  async function unlock() {
    if (buying) return;
    buying = true;
    error = '';
    try {
      await buyDayPass();
      unlocked = true;
      onUnlock();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Could not unlock. Please try again.';
    } finally {
      buying = false;
    }
  }
</script>

{#if !unlocked}
  <div class="space-y-1.5 text-center">
    <span
      class="inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
      style="background: var(--accent-light, rgba(56,97,251,0.1)); color: var(--accent);"
    >Monierate Pro</span>

    <h3
      class="text-[14px] font-bold leading-snug"
      style="font-family: var(--font-head); color: var(--text-primary);"
    >Unlock more days of {label} historical data</h3>

    <p class="text-[12.5px] max-w-sm mx-auto" style="color: var(--text-secondary);">
      {#if !isLoggedIn}
        Sign in with your Monierate account to unlock today's full history from your wallet, or get Pro for unlimited access.
      {:else if pass && canAfford}
        Unlock the full history for today from your wallet, or go unlimited with Pro.
      {:else if pass}
        Your wallet balance is too low for today's unlock. Top up, or get Pro for unlimited access.
      {:else}
        Monierate Pro unlocks the full history for this pair, plus CSV export.
      {/if}
    </p>

    <div class="flex items-center justify-center gap-2 flex-wrap pt-0.5">
      {#if !isLoggedIn}
        <a
          href={signInHref}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
          style="background: var(--accent);"
        >Sign in to unlock</a>
        <a
          href={signupHref}
          class="inline-flex items-center px-4 py-2 rounded-lg text-[13px] font-semibold no-underline border transition-colors hover:bg-[var(--table-hover)]"
          style="color: var(--text-secondary); border-color: var(--card-border);"
        >Get Pro</a>
      {:else if !passLoading && pass && canAfford}
        <button
          type="button"
          onclick={unlock}
          disabled={buying}
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
          style="background: var(--accent); border: none;"
        >{buying ? 'Unlocking…' : `Unlock today · ${priceLabel}`}</button>
        <a
          href={signupHref}
          class="inline-flex items-center px-4 py-2 rounded-lg text-[13px] font-semibold no-underline border transition-colors hover:bg-[var(--table-hover)]"
          style="color: var(--text-secondary); border-color: var(--card-border);"
        >Get Pro</a>
      {:else if !passLoading && pass && !canAfford}
        <a
          href={walletHref}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
          style="background: var(--accent);"
        >Top up · {priceLabel}</a>
        <a
          href={signupHref}
          class="inline-flex items-center px-4 py-2 rounded-lg text-[13px] font-semibold no-underline border transition-colors hover:bg-[var(--table-hover)]"
          style="color: var(--text-secondary); border-color: var(--card-border);"
        >Get Pro</a>
      {:else}
        <a
          href={signupHref}
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
          style="background: var(--accent);"
        >Get Pro</a>
        <a
          href={learnHref}
          class="inline-flex items-center px-4 py-2 rounded-lg text-[13px] font-semibold no-underline border transition-colors hover:bg-[var(--table-hover)]"
          style="color: var(--text-secondary); border-color: var(--card-border);"
        >Learn more</a>
      {/if}
    </div>

    {#if error}
      <p class="text-[11.5px] pt-1" style="color: var(--negative);">{error}</p>
    {/if}
  </div>
{/if}
