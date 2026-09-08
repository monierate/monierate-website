<script lang="ts">
	import { page } from '$app/stores';

	/**
	 * Root error boundary.
	 *
	 * (main)/+error.svelte only catches errors thrown *inside* the (main) group's
	 * pages. Anything that fails in (main)/+layout.server.ts — or while rendering
	 * (main)/+layout.svelte itself — escapes that boundary, because a layout can't
	 * be its own fallback. Without a boundary here those errors fell through to
	 * SvelteKit's built-in default component, which renders nothing but "500
	 * Internal Error" inside a root layout that has no chrome: the blank page.
	 */
	$: status = $page.status;
	$: message = $page.error?.message ?? 'Something went wrong';
	$: errorId = ($page.error as App.Error | null)?.id;
</script>

<svelte:head>
	<title>{status} · Monierate</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap">
	<div class="inner">
		<p class="status">{status}</p>
		<h1>Whoops....</h1>
		<p class="message">{message}</p>
		<p class="hint">
			Wait a little and refresh this page. If it keeps failing, this page isn't coming back on its
			own — let us know.
		</p>

		<div class="actions">
			<a href="/" class="button">Back to home</a>
		</div>

		{#if errorId}
			<p class="ref">Reference: <code>{errorId}</code></p>
		{/if}
	</div>
</div>

<style>
	.wrap {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		background: var(--page-bg);
		color: var(--text-primary);
	}

	.inner {
		width: 100%;
		max-width: 32rem;
	}

	.status {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin: 0 0 0.5rem;
	}

	h1 {
		font-family: var(--font-head);
		font-size: 2.25rem;
		line-height: 1.15;
		font-weight: 700;
		margin: 0 0 0.75rem;
	}

	.message {
		font-size: 1.0625rem;
		color: var(--text-primary);
		margin: 0 0 0.5rem;
	}

	.hint {
		color: var(--text-secondary);
		margin: 0 0 1.75rem;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
	}

	.ref {
		margin: 1.75rem 0 0;
		font-size: 0.8125rem;
		color: var(--text-muted);
	}

	.ref code {
		font-family: var(--font-mono);
	}
</style>
