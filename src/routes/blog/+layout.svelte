<script lang="ts">
    import AdBanner from '$lib/components/AdBanner.svelte';
    export let data;
</script>

<div class="bg-white dark:bg-gray-800">
    <div class="container">
       <AdBanner name="blog_home" isMobile={data.isMobile}/>
    </div>
</div>

<slot />