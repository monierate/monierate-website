import { json } from '@sveltejs/kit';
import { serverApiRequest } from '$lib/api/server';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	let urlParams = url.searchParams;

	const pair_code = urlParams.get('pair_code') || urlParams.get('code');

	if (!pair_code) {
		return json({ message: 'pair_code parameter is required' }, { status: 400 });
	}

	const response = await serverApiRequest('/pairs/get_pair', {
		method: 'GET',
		params: {
			code: pair_code
		}
	});

	if (!response.success) {
		return json({ message: response.error }, { status: 500 });
	}

	const data = response.data as any;

	if (data?.changers) {
		const all = data.changers as any[];

		data.changers = all.filter((changer: any) => changer.is_public === true);

		// Codes withheld on purpose, so consumers can tell "hidden" from "not quoting
		// this pair" and don't re-add them from another source.
		data.hidden_changers = all
			.filter((changer: any) => changer.is_public !== true)
			.map((changer: any) => changer.changer_code);
	}

	return json({data});
}
