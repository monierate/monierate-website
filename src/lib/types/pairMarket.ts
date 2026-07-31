export interface PairChanger {
	changer_code: string;
	is_active: boolean;
	price_buy: number;
	price_sell: number;
	price_24hr: number;
	price_change_percent_24hr: number;
	trade_min: number;
	trade_max: number;
	updated_at: string;
}

export interface ChangerMeta {
	code: string;
	name: string;
	icon?: string;
	changer_tags?: string[];
	is_public?: boolean;
}

export interface MarketPair {
	code: string;
	is_active: boolean;
	price: { current: number };
	price_1hr: number;
	price_24hr: number;
	price_7d: number;
	price_30d: number;
	price_change_percent_24hr: number;
	changers: PairChanger[];
}
