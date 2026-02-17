<script lang="ts">
	import { notify } from '$lib/notification';
	import {
		delete_all_alert,
		delete_all_disabled_alert,
		delete_all_enabled_alert
	} from '$lib/services/alert.service';
	import Dialog from '$lib/components/Dialog.svelte';
	import { invalidate } from '$app/navigation';

	async function refresh() {
		await invalidate('app:data');
	}

	export let showConfirmAllAlertDeletion: boolean = false;
	export let showConfirmDisabledAlertDeletion: boolean = false;
	export let showConfirmEnabledAlertDeletion: boolean = false;

	async function deleteAllAlert() {
		const result = await delete_all_alert(fetch);
		if (result) {
			notify('All alerts deleted successfully');
			refresh();
		} else {
			notify('There was an error deleting all alerts');
		}
		showConfirmAllAlertDeletion = false;
	}

	async function deleteAllDisabledAlert() {
		const result = await delete_all_disabled_alert(fetch);
		if (result) {
			notify('All disabled alerts deleted successfully');
			refresh();
		} else {
			notify('There was an error deleting disabled alerts');
		}
		showConfirmDisabledAlertDeletion = false;
	}

	async function deleteAllEnabledAlert() {
		const result = await delete_all_enabled_alert(fetch);
		if (result) {
			notify('All enabled alerts deleted successfully');
			refresh();
		} else {
			notify('There was an error deleting enabled alerts');
		}
		showConfirmEnabledAlertDeletion = false;
	}
</script>

<Dialog
	bind:isOpen={showConfirmAllAlertDeletion}
	title="Are you sure you want to delete all your alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>

<Dialog
	bind:isOpen={showConfirmDisabledAlertDeletion}
	title="Are you sure you want to delete all your disabled alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllDisabledAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>

<Dialog
	bind:isOpen={showConfirmEnabledAlertDeletion}
	title="Are you sure you want to delete all your enabled alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllEnabledAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>
