import { describe, expect, it } from 'vitest';
import { pickFooterProviders } from './footerProviders';

const names = new Map([
	['luno', 'Luno'],
	['bybit', 'Bybit'],
	['grey', 'Grey'],
	['binance_p2p', 'Binance P2P'],
	['divest', 'Divest'],
	['nala', 'Nala'],
	['mavapay', 'Mavapay'],
	['quidax', 'Quidax'],
	['busha', 'Busha'],
	['cedarmoney', 'Cedar.money'],
	['boundlesspay', 'Boundlesspay']
]);

const changer = (changer_code: string, extra: Record<string, unknown> = {}) => ({
	changer_code,
	is_public: true,
	is_active: true,
	...extra
});

const pair = (code: string, contributors: string[], changers: any[]) => ({
	code,
	index_contributors: contributors,
	changers
});

describe('pickFooterProviders', () => {
	it('lists contributors and tops up with two others when there are fewer than five', () => {
		const pairs = [
			pair(
				'usdtzar',
				['luno', 'bybit', 'grey', 'binance_p2p'],
				['luno', 'bybit', 'grey', 'binance_p2p', 'divest'].map((c) => changer(c))
			),
			pair(
				'usdzar',
				['luno', 'bybit', 'grey', 'binance_p2p'],
				['luno', 'bybit', 'grey', 'binance_p2p', 'nala', 'divest', 'mavapay'].map((c) => changer(c))
			)
		];

		expect(pickFooterProviders(pairs, 'ZAR', names)).toEqual([
			{ href: '/markets/usdtzar/luno', label: 'Convert USDT on Luno', name: 'Luno' },
			{ href: '/markets/usdtzar/bybit', label: 'Convert USDT on Bybit', name: 'Bybit' },
			{ href: '/markets/usdtzar/grey', label: 'Convert USDT on Grey', name: 'Grey' },
			{ href: '/markets/usdtzar/binance_p2p', label: 'Convert USDT on Binance P2P', name: 'Binance P2P' },
			{ href: '/markets/usdtzar/divest', label: 'Convert USDT on Divest', name: 'Divest' },
			{ href: '/markets/usdzar/nala', label: 'Convert USD on Nala', name: 'Nala' }
		]);
	});

	it('lists only contributors when there are five or more, across both pairs', () => {
		const pairs = [
			pair(
				'usdtngn',
				['quidax', 'busha', 'boundlesspay', 'bybit'],
				['quidax', 'busha', 'boundlesspay', 'bybit', 'divest'].map((c) => changer(c))
			),
			pair(
				'usdngn',
				['quidax', 'busha', 'cedarmoney', 'boundlesspay', 'bybit'],
				['quidax', 'busha', 'cedarmoney', 'boundlesspay', 'bybit', 'grey'].map((c) => changer(c))
			)
		];

		expect(pickFooterProviders(pairs, 'NGN', names).map((p) => p.href)).toEqual([
			'/markets/usdtngn/quidax',
			'/markets/usdtngn/busha',
			'/markets/usdtngn/boundlesspay',
			'/markets/usdtngn/bybit',
			'/markets/usdngn/cedarmoney'
		]);
	});

	it('skips hidden, inactive and unknown providers', () => {
		const pairs = [
			pair('usdtghs', ['quidax', 'bybit', 'fastforex'], [
				changer('quidax'),
				changer('bybit', { is_public: false }),
				changer('fastforex', { is_public: false }),
				changer('luno', { is_active: false }),
				changer('unlisted'),
				changer('divest')
			])
		];

		expect(pickFooterProviders(pairs, 'GHS', names).map((p) => p.href)).toEqual([
			'/markets/usdtghs/quidax',
			'/markets/usdtghs/divest'
		]);
	});

	it('returns nothing when the currency has no USDT or USD pair', () => {
		expect(pickFooterProviders([pair('eurngn', ['grey'], [changer('grey')])], 'XOF', names)).toEqual(
			[]
		);
	});
});
