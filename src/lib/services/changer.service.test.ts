import { describe, expect, it } from 'vitest';
import { getAllChangers } from './changer.service';

// Serves `total` changers in pages, like /api/changers/get_all_changers.
const fakeApi = (total: number, inactive: string[] = []) => {
	const all = Array.from({ length: total }, (_, i) => ({
		code: `p${i + 1}`,
		is_active: !inactive.includes(`p${i + 1}`)
	}));
	const calls: string[] = [];

	const fetch = (async (input: RequestInfo | URL) => {
		const url = new URL(String(input), 'http://test');
		calls.push(url.search);
		const page = Number(url.searchParams.get('page'));
		const limit = Number(url.searchParams.get('limit'));
		const result = all.slice((page - 1) * limit, page * limit);
		return new Response(JSON.stringify({ data: { count: total, result, page } }));
	}) as typeof globalThis.fetch;

	return { fetch, calls };
};

describe('getAllChangers', () => {
	it('returns every provider in one request when they fit a page', async () => {
		const { fetch, calls } = fakeApi(102);
		const changers = await getAllChangers(fetch);
		expect(changers).toHaveLength(102);
		expect(calls).toHaveLength(1);
	});

	it('pages through the rest when there are more than one page holds', async () => {
		const { fetch, calls } = fakeApi(450);
		const changers = await getAllChangers(fetch);
		expect(changers).toHaveLength(450);
		expect(changers?.at(-1)?.code).toBe('p450');
		expect(calls).toHaveLength(3);
	});

	it('drops inactive providers', async () => {
		const { fetch } = fakeApi(5, ['p2', 'p4']);
		expect((await getAllChangers(fetch))?.map((c) => c.code)).toEqual(['p1', 'p3', 'p5']);
	});

	it('returns null when the API fails', async () => {
		const fetch = (async () => new Response('', { status: 500 })) as typeof globalThis.fetch;
		expect(await getAllChangers(fetch)).toBeNull();
	});
});
