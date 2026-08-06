export type ProviderSortBy = 'default' | 'name_asc' | 'name_desc' | 'buy_asc' | 'buy_desc' | 'sell_asc' | 'sell_desc' | 'spread_asc' | 'spread_desc';

export interface Provider {
  id: string;
  name: string;
  type: 'P2P' | 'CEX' | 'Remittance' | 'Neobank' | 'OTC';
  logo: string;
}

export interface ProviderRate extends Provider {
  rate: number;
  buy: number;
  sell: number;
  rate_mid: number;
  rate_type: string;
  premium: number;
  premiumPct: number;
  delta24h: number;
  deltaPct: number;
  availability: number;
  lastUpdated: number;
  stale: boolean;
  spread: number;
  minTx: string;
  maxTx: string;
  score: number;
  tags: string[];
}

export interface Pair {
  code: string;
  display: string;
  base: string;
  quote: string;
  symbol: string;
  range: [number, number];
}

export interface HistoricalData {
  date: string;
  dateLabel: string;
  open: number;
  high: number;
  low: number;
  close: number;
  rate: number;
  volume: number;
}

export interface RateAlert {
  id: number;
  label: string;
  type: string;
  pair: string;
  condition: string;
  current: string;
  status: 'active' | 'paused';
  lastTriggered: string;
  count: number;
}

export interface Position {
  id: number;
  label: string;
  amount: number;
  currency: string;
  dueDate: string;
  budgetRate: number;
  currentRate: number;
  status: 'open' | 'closed';
}

export interface Conversion {
  id: number;
  date: string;
  amount: number;
  pair: string;
  rateAchieved: number;
  indexRate: number;
  provider: string;
}
