export const fmt = (n: number | null | undefined, decimals = 2): string => {
	if (n == null) return '—';
	return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

export const fmtPct = (n: number): string => `${n >= 0 ? '+' : ''}${fmt(n)}%`;

export const timeAgo = (ts: number | null | undefined): string => {
	if (!ts) return '—';
	const sec = Math.floor((Date.now() - ts) / 1000);
	const min = Math.floor(sec / 60);
	if (min < 3) return '3 mins ago';
	if (min < 60) return `${min} mins ago`;
	const hr = Math.floor(min / 60);
	if (hr < 24) return `${hr}h ago`;
	return `${Math.floor(hr / 24)}d ago`;
};
