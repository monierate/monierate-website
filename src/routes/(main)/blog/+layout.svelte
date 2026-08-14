<script lang="ts">
    import AdBanner, { hasActiveAd } from '$lib/components/banners/AdBanner.svelte';
    export let data;
</script>

<div style="background: var(--page-bg);">
    <div class="container {hasActiveAd('blog_home') ? '' : 'pt-8'}">
       <AdBanner name="blog_home" isMobile={data.isMobile}/>
    </div>
</div>

<slot />