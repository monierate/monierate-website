<script lang="ts">
	import AlertRow from './AlertRow.svelte';
    import type { Alert } from '$lib/types/alert.type';

	interface Provider {
		code: string;
		name: string;
		icon: string;
	}

	export let alerts: Alert[];
	export let providers: Provider[];
	export let auth: any;
</script>

<div class="mb-10 overflow-x-auto md:overflow-visible">
	<div class="min-w-[800px] md:min-w-auto">
		<table class="table-auto w-full border-separate border-spacing-y-4">
			<thead>
				<tr>
					<th class="p-4 text-left">Pairs, Providers</th>
					<th class="p-4 text-left">Channels</th>
					<th class="p-4 text-left">Interval</th>
					<th class="p-4 text-left">Last Trigger</th>
					<th class="p-4 text-left">Next Trigger</th>
					<th class="p-4 text-left"></th>
				</tr>
			</thead>
			<tbody>
				{#each alerts as alert}
					<AlertRow {alert} {providers} userTimezone={auth.userTimezone} />
				{/each}
			</tbody>
		</table>
	</div>
</div>
