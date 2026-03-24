<script lang="ts">
	export let href: string;
	export let nofollow: boolean = false;
</script>

<a 
	{href} rel={nofollow ? "noopener nofollow" : "noopener"} target="_blank" style="text-decoration: underline;">
	<slot />
</a>