<script lang="ts">
    import AdBanner from '$lib/components/banners/AdBanner.svelte';
    export let data;
</script>

<div style="background: var(--page-bg);">
    <div class="container">
       <AdBanner name="blog_home" isMobile={data.isMobile}/>
    </div>
</div>

<slot />