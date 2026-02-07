import { clientApiFetch } from '../api/client';

type AlertTypes = 'threshold' | 'periodic';

type ThresholdAlert = {
	type: AlertTypes;
};

type PeriodicAlert = {
	type: AlertTypes;
	quote: string;
	base: string;
	frequency: {
		type: 'interval' | 'hourly' | 'daily' | 'weekly' | 'monthly';
		value: number;
		day: number;
	};
	exchange: string[];
	channel: string[];
	note: string;
	disable_after_trigger: boolean;
	id: string;
	status: string;
};

/* ----------------------------- */
/* Create alert                  */
/* ----------------------------- */
export const create_alert = async (
	alert: PeriodicAlert | ThresholdAlert,
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/create',
		{
			method: 'POST',
			body: alert
		},
		fetch
	);

	if (!result) {
		console.log('Error creating alert', result);
		return false;
	}
	return result;
};

/* ----------------------------- */
/* Get all alerts                */
/* ----------------------------- */
export const get_all_alerts = async (
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/get_all',
		{ method: 'GET' },
		fetch
	);

	if (!result) {
		console.log('Error fetching all alert', result);
		return null;
	}
	return result;
};

/* ----------------------------- */
/* Get single alert              */
/* ----------------------------- */
export const get_alert = async (
	alert_id: string,
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/get_alert',
		{
			method: 'GET',
			params: { alert_id }
		},
		fetch
	);

	if (!result) {
		console.log('Error fetching alert', result);
		return null;
	}
	return result;
};

/* ----------------------------- */
/* Delete single alert           */
/* ----------------------------- */
export const delete_alert = async (
	id: string,
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/delete',
		{
			method: 'POST',
			body: { alert_id: id }
		},
		fetch
	);

	if (!result) {
		console.log('Error deleing alert', result);
		return false;
	}
	return true;
};

/* ----------------------------- */
/* Delete all alerts             */
/* ----------------------------- */
export const delete_all_alert = async (
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/delete_all',
		{ method: 'POST' },
		fetch
	);

	if (!result) {
		console.log('Error deleting all alert', result);
		return false;
	}
	return true;
};

/* ----------------------------- */
/* Delete disabled alerts        */
/* ----------------------------- */
export const delete_all_disabled_alert = async (
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/delete_all_disabled',
		{ method: 'POST' },
		fetch
	);

	if (!result) {
		console.log('Error deleting disabled alert', result);
		return false;
	}
	return true;
};

/* ----------------------------- */
/* Delete enabled alerts         */
/* ----------------------------- */
export const delete_all_enabled_alert = async (
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/delete_all_enabled',
		{ method: 'POST' },
		fetch
	);

	if (!result) {
		console.log('Error deleting alert', result);
		return false;
	}
	return true;
};

/* ----------------------------- */
/* Update alert                  */
/* ----------------------------- */
export const update_alert = async (
	alert: any,
	fetch: typeof globalThis.fetch
) => {
	const result = await clientApiFetch<any>(
		'/price_alert/update',
		{
			method: 'POST',
			body: alert
		},
		fetch
	);

	if (!result) {
		console.log('Error updating alert', result);
		return false;
	}
	return true;
};
