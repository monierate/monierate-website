<script lang="ts">
  import { fmt } from '$lib/utils/format';
  import ProviderLogo from '$lib/components/ui/ProviderLogo.svelte';
  import { MSI_LEVEL_LABEL, TONE_COLOR, classifyTone } from '$lib/constants/msi';
  import { VOL_REGIME_LABEL, volRegimeColor } from '$lib/constants/volatility';
  import type { PremiumLevel } from '$lib/services/currency/v1/spread';
  import type { VolRegime } from '$lib/services/currency/v1/volatility';

  let {
    symbol,
    currentRate,
    delta24h,
    high24h,
    low24h,
    volatility24h,
    spreadRange,
    msiScore = null,
    msiLevel = null,
    volScore = null,
    volRegime = null,
    indexContributors,
    highProvider,
    lowProvider,
    timeRange = '24h',
    pairCode = '',
  }: {
    symbol: string;
    currentRate: number;
    delta24h: number;
    high24h: number;
    low24h: number;
    volatility24h: number;
    spreadRange: number;
    /** Monierate Spread Index (USDT/NGN only) — when set, replaces the Spread card. */
    msiScore?: number | null;
    msiLevel?: string | null;
    /** Volatility engine (USDT/NGN only) — when set, replaces the Volatility card. */
    volScore?: number | null;
    volRegime?: string | null;
    indexContributors: number;
    highProvider: { code: string; name: string; icon: string } | null;
    lowProvider: { code: string; name: string; icon: string } | null;
    timeRange?: string;
    /** Pair the strip belongs to — links the high/low providers to their pair page. */
    pairCode?: string;
  } = $props();

  // Pair-scoped provider page when we know the pair, else the standalone profile.
  const providerHref = (code: string) =>
    pairCode ? `/markets/${pairCode}/${code}` : `/markets/providers/${code}`;

  const msiTone = $derived(msiLevel ? TONE_COLOR[classifyTone(msiLevel as PremiumLevel)] : '#a855f7');
  const volTone = $derived(volRegime ? volRegimeColor(volRegime as VolRegime) : '#f59e0b');

  const ICONS = {
    dollar:    `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
    trendUp:   `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
    trendDown: `<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>`,
    activity:  `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
    zap:       `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    users:     `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  };

  const metrics = $derived([
    {
      label: 'Composite Rate',
      value: `${symbol}${fmt(currentRate)}`,
      sub: 'index average',
      subColor: 'var(--text-muted)',
      icon: ICONS.dollar,
      accent: '#3861fb',
      valueColor: 'var(--text-primary)',
      href: undefined as string | undefined,
    },
    {
      label: `${timeRange.toUpperCase()} High`,
      value: `${symbol}${fmt(high24h)}`,
      sub: 'period peak',
      subColor: 'var(--text-muted)',
      icon: ICONS.trendUp,
      accent: '#22c55e',
      valueColor: '#22c55e',
      href: undefined as string | undefined,
    },
    {
      label: `${timeRange.toUpperCase()} Low`,
      value: `${symbol}${fmt(low24h)}`,
      sub: 'period floor',
      subColor: 'var(--text-muted)',
      icon: ICONS.trendDown,
      accent: '#ef4444',
      valueColor: '#ef4444',
      href: undefined as string | undefined,
    },
    volRegime != null
      ? {
          label: 'Volatility (7d)',
          value: `${fmt(volScore ?? 0)}%`,
          sub: `${VOL_REGIME_LABEL[volRegime as VolRegime] ?? ''} regime`,
          subColor: 'var(--text-muted)',
          icon: ICONS.activity,
          accent: volTone,
          valueColor: volTone,
          href: undefined as string | undefined,
        }
      : {
          label: `${timeRange.toUpperCase()} Volatility`,
          value: `${volatility24h}%`,
          sub: 'high–low range',
          subColor: 'var(--text-muted)',
          icon: ICONS.activity,
          accent: '#f59e0b',
          valueColor: 'var(--text-primary)',
          href: undefined as string | undefined,
        },
    msiScore != null
      ? {
          label: 'Spread Index (MSI)',
          value: `${fmt(msiScore)}%`,
          sub: msiLevel ? `${MSI_LEVEL_LABEL[msiLevel as PremiumLevel] ?? ''} premium` : 'premium over CBN',
          subColor: 'var(--text-muted)',
          icon: ICONS.zap,
          accent: msiTone,
          valueColor: msiTone,
          href: undefined as string | undefined,
        }
      : {
          label: `${timeRange.toUpperCase()} Spread`,
          value: `${symbol}${fmt(spreadRange)}`,
          sub: 'high vs low provider',
          subColor: 'var(--text-muted)',
          icon: ICONS.zap,
          accent: '#a855f7',
          valueColor: 'var(--text-primary)',
          href: undefined,
        },
  ]);
</script>

<!-- Supplementary info strip -->
<div class="flex items-center gap-x-4 mb-3 flex-nowrap overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

  <div class="flex items-center gap-1.5 flex-shrink-0">
    <div style="width:20px; height:20px; border-radius:6px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb, var(--accent) 15%, transparent); flex-shrink:0;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--accent)" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
    <div>
      <div style="font-size:12px; font-weight:600; color:var(--text-primary); line-height:1.2;">{indexContributors} Index Contributors</div>
      <div style="font-size:10px; color:var(--text-muted); line-height:1.2;">99% uptime</div>
    </div>
  </div>

  <div style="width:1px; height:28px; background:var(--card-border); flex-shrink:0;"></div>

  {#if highProvider}
    <a
      href={providerHref(highProvider.code)}
      class="flex items-center gap-1.5 flex-shrink-0 hover:opacity-75 transition-opacity"
      style="text-decoration:none;"
    >
      <ProviderLogo logo={highProvider.icon} name={highProvider.name} size={20} />
      <div>
        <div style="font-size:12px; font-weight:600; color:var(--text-primary); line-height:1.2;">{highProvider.name}</div>
        <div style="font-size:10px; color:#22c55e; line-height:1.2;">highest rate</div>
      </div>
    </a>
  {/if}

  {#if highProvider && lowProvider}
    <div style="width:1px; height:28px; background:var(--card-border); flex-shrink:0;"></div>
  {/if}

  {#if lowProvider}
    <a
      href={providerHref(lowProvider.code)}
      class="flex items-center gap-1.5 flex-shrink-0 hover:opacity-75 transition-opacity"
      style="text-decoration:none;"
    >
      <ProviderLogo logo={lowProvider.icon} name={lowProvider.name} size={20} />
      <div>
        <div style="font-size:12px; font-weight:600; color:var(--text-primary); line-height:1.2;">{lowProvider.name}</div>
        <div style="font-size:10px; color:#ef4444; line-height:1.2;">lowest rate</div>
      </div>
    </a>
  {/if}

</div>

<!-- Metric cards -->
<div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
  {#each metrics as m}
    <svelte:element
      this={m.href ? 'a' : 'div'}
      href={m.href}
      class="rounded-xl border {m.href ? 'transition-all hover:opacity-90 no-underline' : ''}"
      style="background: var(--page-bg); border-color: {m.href ? m.accent + '55' : 'var(--card-border)'}; padding: clamp(10px, 3vw, 16px); display:block;"
    >
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <span style="font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:var(--text-secondary); line-height:1.3;">{m.label}</span>
        <div style="width:22px; height:22px; border-radius:7px; display:flex; align-items:center; justify-content:center; background:{m.accent}1a; color:{m.accent}; flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{@html m.icon}</svg>
        </div>
      </div>
      <div class="text-[15px] sm:text-[18px] font-bold leading-none" style="font-family:var(--font-mono); color:{m.valueColor};">{m.value}</div>
      <div class="text-[10px] sm:text-[11px] mt-1" style="color:{m.subColor};">{m.sub}</div>
    </svelte:element>
  {/each}
</div>
