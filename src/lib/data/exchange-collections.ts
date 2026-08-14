/**
 * Curated directory collections — the programmatic-SEO layer over /exchanges.
 *
 * Each entry is one server-rendered collection page at `/exchanges/:slug`,
 * targeting a long-tail directory query ("otc desks in lagos"). Pages are
 * curated rather than generated from every facet permutation: the permutation
 * space is mostly empty, and near-empty programmatic pages drag down the whole
 * site's rankings. Add a combo here only when you expect it to hold changers.
 *
 * The facets map 1:1 onto `/changers/search_changers` query params. Multi-value
 * facets are OR'd by the API and must be sent comma-separated — repeating a
 * param is a 400.
 *
 * Collections whose facets return fewer than {@link MIN_COLLECTION_SIZE}
 * changers 404 (see the route's load) and stay out of the sitemap. That is the
 * expected state for the location- and licence-scoped combos until the changer
 * backfill (MON-136) populates `address.city`, `countries` and `licenses`.
 */

/** Query params understood by `/changers/search_changers`. */
export interface CollectionFacets {
	/** Changer tags, OR'd: `otc`, `offramp`, `onramp`, `remittance`, … */
	tags?: string[];
	/** Category names, OR'd: `Crypto Exchange`, … */
	categories?: string[];
	/** HQ city, matched against `address.city`. */
	city?: string;
	/** HQ state, matched against `address.state`. */
	state?: string;
	/** A country the changer serves, matched against `countries`. */
	country?: string;
	/** Only changers holding at least one licence. */
	licensed?: boolean;
	/** Licence issuer, e.g. `cbn`. */
	license_authority?: string;
	payment_methods?: string[];
	platforms?: string[];
	kyc_required?: boolean;
	verified?: boolean;
}

export interface CollectionFaq {
	question: string;
	answer: string;
}

export interface ExchangeCollection {
	/** URL segment: `/exchanges/:slug`. Stable — changing one loses its rankings. */
	slug: string;
	/** H1. `{year}` is substituted at render time. */
	heading: string;
	/** `<title>`. `{year}` is substituted. */
	title: string;
	/** Meta description. Keep under ~155 characters. */
	description: string;
	/** Short intro paragraph rendered under the H1. `{count}` and `{year}` are substituted. */
	intro: string;
	/** Anchor text used by the index page and by cross-links from profiles. */
	label: string;
	/** Filters passed to search_changers. */
	facets: CollectionFacets;
	/** 2–3 questions, rendered as prose and as FAQPage JSON-LD. */
	faqs: CollectionFaq[];
	/** Surfaced in the "popular collections" strip on /exchanges. */
	featured?: boolean;
}

/**
 * Thin-page guard. A collection resolving to fewer than this many changers is
 * not a directory page, it is a dead end — the route 404s instead of publishing
 * it, and the sitemap omits it.
 */
export const MIN_COLLECTION_SIZE = 3;

/** How many changers a collection page lists before paging out. */
export const COLLECTION_PAGE_SIZE = 20;

export const EXCHANGE_COLLECTIONS: ExchangeCollection[] = [
	/* ---------------------------------------------------------------- *
	 * Service collections — live on the `changer_tags` axis alone.
	 * ---------------------------------------------------------------- */
	{
		slug: 'crypto-offramp-platforms',
		heading: 'Best Crypto Off-Ramp Platforms ({year})',
		title: 'Best Crypto Off-Ramp Platforms ({year}) | Monierate',
		description:
			'Compare crypto off-ramp platforms that let you sell USDT, BTC and other crypto and withdraw straight to a bank account. Rates, fees and profiles on Monierate.',
		intro:
			'An off-ramp is any platform that turns crypto back into spendable cash. The {count} platforms below all support selling crypto — most commonly USDT — and paying the proceeds out to a local bank account. They are ranked by user rating, and each profile carries live rates, fee notes, payout times and payment methods.',
		label: 'Crypto off-ramp platforms',
		facets: { tags: ['offramp'] },
		featured: true,
		faqs: [
			{
				question: 'What is a crypto off-ramp?',
				answer:
					'A crypto off-ramp is a service that converts cryptocurrency into fiat money and pays it into a bank account, mobile money wallet, or card. It is the reverse of an on-ramp, which turns cash into crypto. Most platforms listed here do both.'
			},
			{
				question: 'How do I choose an off-ramp platform?',
				answer:
					'Compare three things before you move money: the rate you actually receive after fees, the settlement time, and whether the platform is licensed or has a long operating record. A slightly worse rate from an established, licensed platform is usually cheaper than a headline rate that settles late or not at all.'
			},
			{
				question: 'How long do crypto off-ramp withdrawals take?',
				answer:
					'Automated platforms typically settle a bank payout within minutes of the crypto confirming on-chain. Manual or over-the-counter desks can take longer, particularly for large amounts that need compliance review. Each profile page lists the platform’s stated settlement time where we have it.'
			}
		]
	},
	{
		slug: 'crypto-onramp-platforms',
		heading: 'Best Crypto On-Ramp Platforms ({year})',
		title: 'Best Crypto On-Ramp Platforms to Buy Crypto ({year}) | Monierate',
		description:
			'Compare crypto on-ramp platforms for buying USDT, BTC and other crypto with a bank transfer or card. Live rates, fees and platform profiles on Monierate.',
		intro:
			'An on-ramp is where money enters crypto. The {count} platforms below let you fund with a bank transfer, card or mobile money and receive crypto — usually USDT or BTC — in your wallet or exchange balance. They are ranked by user rating; open a profile for live buy rates, funding methods and limits.',
		label: 'Crypto on-ramp platforms',
		facets: { tags: ['onramp'] },
		featured: true,
		faqs: [
			{
				question: 'What is a crypto on-ramp?',
				answer:
					'An on-ramp is a service that converts fiat money into cryptocurrency. You pay with a bank transfer, debit card or mobile money and receive crypto in return, usually at a quoted rate that already includes the platform’s margin.'
			},
			{
				question: 'What does it cost to buy crypto through an on-ramp?',
				answer:
					'The headline fee is rarely the whole cost. Most of what you pay sits in the spread between the platform’s buy rate and the market rate, so compare the rate you are quoted for your amount rather than the advertised percentage fee. The rate tables on each profile page show the live buy price.'
			},
			{
				question: 'Do I need to complete KYC to buy crypto?',
				answer:
					'Almost always, yes. Platforms that settle to Nigerian bank accounts are subject to anti-money-laundering rules and will ask for identity documents before or shortly after your first trade. Each profile page flags whether KYC is required.'
			}
		]
	},
	{
		slug: 'remittance-apps',
		heading: 'Best Remittance Apps for Sending Money to Nigeria ({year})',
		title: 'Best Remittance Apps for Sending Money to Nigeria ({year}) | Monierate',
		description:
			'Compare remittance apps for sending money to Nigeria — live exchange rates, transfer fees, payout speed and platform profiles, ranked on Monierate.',
		intro:
			'These {count} remittance platforms move money across borders into Nigerian bank accounts and wallets. The rate matters more than the advertised fee on almost every corridor, so each profile carries the live rate alongside the platform’s fee notes, payout times and supported payment methods.',
		label: 'Remittance apps',
		facets: { tags: ['remittance'] },
		featured: true,
		faqs: [
			{
				question: 'What is the cheapest way to send money to Nigeria?',
				answer:
					'Cheapest almost never means lowest fee. A provider advertising a zero-fee transfer usually recovers the cost in a weaker exchange rate. Work out what the recipient actually receives — amount sent, minus fees, times the rate you are quoted — and compare that figure across the providers listed here.'
			},
			{
				question: 'How long does a transfer to Nigeria take?',
				answer:
					'Bank-transfer and wallet payouts from the major apps usually land the same day, and often within minutes. Transfers funded by a bank debit in the sending country can take an extra day or two to clear before the payout is released.'
			},
			{
				question: 'Are remittance apps safe to use?',
				answer:
					'The established ones are regulated as money-transmission businesses in the countries they send from, and hold customer funds separately from their own. Check the profile page for licences and operating history before your first large transfer, and start with a small amount on any platform you have not used.'
			}
		]
	},
	{
		slug: 'virtual-dollar-card-providers',
		heading: 'Best Virtual Dollar Card Providers in Nigeria ({year})',
		title: 'Best Virtual Dollar Card Providers in Nigeria ({year}) | Monierate',
		description:
			'Compare virtual dollar card providers in Nigeria — funding rates, card fees, decline rates and platform profiles, ranked on Monierate.',
		intro:
			'Virtual dollar cards let you pay for international subscriptions, ads and online purchases without a domiciliary account. The {count} providers below issue USD cards to Nigerian users; the profiles cover the rate you are charged when funding a card, the issuance and maintenance fees, and the funding methods each one accepts.',
		label: 'Virtual dollar card providers',
		facets: { tags: ['virtualcard'] },
		featured: true,
		faqs: [
			{
				question: 'What is a virtual dollar card?',
				answer:
					'A virtual dollar card is a USD-denominated card that exists only as a card number, expiry date and CVV — there is no plastic. You fund it in naira or crypto, and spend it anywhere online that accepts the card network, which is what makes it useful for subscriptions and international checkouts.'
			},
			{
				question: 'What does a virtual dollar card cost?',
				answer:
					'Expect three separate charges: a one-off issuance fee, a funding fee or exchange-rate margin each time you top up, and sometimes a monthly maintenance fee. The funding rate is usually the largest of the three, so compare that first.'
			},
			{
				question: 'Why do virtual dollar cards get declined?',
				answer:
					'The common causes are an insufficient balance once the merchant adds its own processing fee, a merchant that blocks the card’s issuing BIN, or the provider’s own issuer suspending a card range. Providers with a longer track record and their own issuing relationships tend to have fewer sudden outages.'
			}
		]
	},
	{
		slug: 'usd-account-providers',
		heading: 'Best USD Account Providers for Nigerians ({year})',
		title: 'Best USD Account Providers for Nigerians ({year}) | Monierate',
		description:
			'Compare providers offering USD accounts to Nigerians — receive dollars from abroad, hold a balance and convert at live rates. Profiles ranked on Monierate.',
		intro:
			'A USD account gives you dollar account details you can receive international payments into, without a traditional domiciliary account. The {count} providers below offer USD balances to Nigerian users; the profiles cover the conversion rate applied when you cash out, the funding routes each supports, and the paperwork required to open one.',
		label: 'USD account providers',
		facets: { tags: ['account'] },
		faqs: [
			{
				question: 'What is a USD account and how does it differ from a domiciliary account?',
				answer:
					'Both hold dollars. A domiciliary account is opened with a Nigerian bank and comes with a full banking relationship; the accounts listed here are usually provided through a fintech’s partner bank abroad, so they are faster to open and better suited to receiving payments from platforms and clients overseas.'
			},
			{
				question: 'Can I receive payments from anywhere into a USD account?',
				answer:
					'Not always. Some accounts accept only ACH or domestic US transfers, others also accept international SWIFT wires. If you are being paid by an overseas employer or marketplace, check which rails the provider supports before you share the details.'
			},
			{
				question: 'What rate do I get converting USD to naira?',
				answer:
					'Each provider sets its own conversion rate, and it is typically a few percent away from the mid-market rate. The live rate tables on each profile page show what the provider is quoting right now, which is the number to compare.'
			}
		]
	},
	{
		slug: 'nigerian-banks',
		heading: 'Nigerian Banks and Their Exchange Rates ({year})',
		title: 'Nigerian Banks and Their USD Exchange Rates ({year}) | Monierate',
		description:
			'Nigerian banks tracked on Monierate — compare the dollar rates each bank quotes, alongside profiles, USSD codes and payment channels.',
		intro:
			'The {count} banks below are tracked on Monierate for the rates they quote on card transactions and foreign-currency conversions. Bank rates move less often than exchange rates and usually sit closer to the official window than to the parallel market — useful as a reference point when you are comparing a fintech’s quote.',
		label: 'Nigerian banks',
		facets: { tags: ['bank'] },
		faqs: [
			{
				question: 'Why do bank rates differ from the rates on exchanges?',
				answer:
					'Banks price off the official market and add their own margin, while exchanges and fintechs price off the parallel market where supply and demand set the rate. The gap between the two is why the same dollar can be worth noticeably different amounts depending on where you convert it.'
			},
			{
				question: 'Which bank gives the best dollar rate?',
				answer:
					'It changes, and not always in the direction you would expect — the rate a bank applies to a card transaction abroad can differ from the one it quotes over the counter. Compare the current figures in the table above rather than relying on a bank’s reputation for being cheap.'
			}
		]
	},

	/* ---------------------------------------------------------------- *
	 * Location and licence collections. These depend on the changer
	 * backfill (address.city, countries, licenses) and 404 until it lands.
	 * ---------------------------------------------------------------- */
	{
		slug: 'crypto-exchanges-in-nigeria',
		heading: 'Best Crypto Exchanges in Nigeria ({year})',
		title: 'Best Crypto Exchanges in Nigeria ({year}) | Monierate',
		description:
			'A ranked directory of crypto exchanges serving Nigeria — live USDT and BTC rates, fees, licences and full platform profiles on Monierate.',
		intro:
			'These {count} crypto exchanges serve Nigerian users, letting you buy and sell USDT, BTC and other assets against the naira. They are ranked by user rating. Every profile carries live buy and sell rates, the platform’s fee and limit notes, its payment methods, and any licences it holds.',
		label: 'Crypto exchanges in Nigeria',
		facets: { tags: ['onramp', 'offramp'], country: 'nigeria' },
		featured: true,
		faqs: [
			{
				question: 'Is crypto trading legal in Nigeria?',
				answer:
					'Yes. Nigeria regulates digital assets rather than banning them: the Investments and Securities Act 2025 recognises digital assets as securities, and the SEC operates a registration regime for digital asset exchanges. Platforms registered under it are marked as licensed on their profile pages.'
			},
			{
				question: 'Which crypto exchange has the best rate in Nigeria?',
				answer:
					'It varies by asset, by direction and by hour — the exchange with the best USDT buy rate this morning is often not the one with the best sell rate this afternoon. The rate tables on Monierate update continuously, so compare the live figures for the trade you are actually making.'
			},
			{
				question: 'How do I avoid losing money on a Nigerian crypto exchange?',
				answer:
					'Trade on platforms with a licence or a long operating record, start with a small amount on anything new to you, and check the spread — the gap between buy and sell — rather than the buy price alone. A wide spread is where a platform recovers what it gives up on the headline rate.'
			}
		]
	},
	{
		slug: 'crypto-exchanges-in-lagos',
		heading: 'Best Crypto Exchanges in Lagos ({year})',
		title: 'Best Crypto Exchanges in Lagos ({year}) | Monierate',
		description:
			'Crypto exchanges headquartered in Lagos — live rates, fees, licences and profiles for each platform, ranked by rating on Monierate.',
		intro:
			'Lagos is where most of Nigeria’s crypto industry is based. The {count} exchanges below are headquartered in the city, which matters if you want a platform with a physical office you can reach, a local support team, or an on-the-ground presence for larger trades.',
		label: 'Crypto exchanges in Lagos',
		facets: { tags: ['onramp', 'offramp'], city: 'lagos' },
		featured: true,
		faqs: [
			{
				question: 'Does it matter where a crypto exchange is based?',
				answer:
					'For small online trades, rarely. It starts to matter when something goes wrong or when the amounts get large: a platform with a Lagos office has a support team in your timezone, a registered address, and usually a compliance process built around Nigerian rules.'
			},
			{
				question: 'Can I trade crypto in person in Lagos?',
				answer:
					'Some Lagos-based platforms operate an over-the-counter desk alongside their app, which is how most large trades are settled. Check the platform’s profile for a physical address and a stated minimum ticket size, and treat any dealer without both as an online-only counterparty.'
			}
		]
	},
	{
		slug: 'crypto-exchanges-in-abuja',
		heading: 'Best Crypto Exchanges in Abuja ({year})',
		title: 'Best Crypto Exchanges in Abuja ({year}) | Monierate',
		description:
			'Crypto exchanges headquartered in Abuja — compare live rates, fees, licences and platform profiles, ranked by rating on Monierate.',
		intro:
			'The {count} crypto exchanges below are headquartered in Abuja. A local base is worth something when you need in-person support or want to settle a large trade with a desk you can visit — though every platform here also serves customers nationwide through its app.',
		label: 'Crypto exchanges in Abuja',
		facets: { tags: ['onramp', 'offramp'], city: 'abuja' },
		faqs: [
			{
				question: 'Are there crypto exchanges based in Abuja?',
				answer:
					'Yes, though the sector is concentrated in Lagos. The platforms listed above are headquartered in Abuja; if none of them fits what you need, the Lagos-based and nationwide platforms on Monierate serve Abuja users through the same apps.'
			},
			{
				question: 'How do I sell crypto for naira in Abuja?',
				answer:
					'The usual route is an off-ramp platform that pays out to any Nigerian bank account, which works identically wherever you are. For larger amounts, an over-the-counter desk will quote a single price for the whole trade rather than filling it across the order book.'
			}
		]
	},
	{
		slug: 'otc-desks-in-lagos',
		heading: 'Best OTC Desks in Lagos ({year})',
		title: 'Best OTC Crypto Desks in Lagos ({year}) | Monierate',
		description:
			'Over-the-counter crypto desks in Lagos for large trades — minimum ticket sizes, settlement times, licences and profiles, ranked on Monierate.',
		intro:
			'An over-the-counter desk quotes one price for an entire trade instead of filling it across an order book, which is what you want above the size where slippage starts to cost real money. The {count} Lagos desks below are ranked by rating; each profile lists the minimum ticket size, settlement time and licences.',
		label: 'OTC desks in Lagos',
		facets: { tags: ['otc'], city: 'lagos' },
		featured: true,
		faqs: [
			{
				question: 'What is an OTC crypto desk?',
				answer:
					'An OTC desk trades directly with you rather than routing your order to a public order book. You ask for a size, the desk quotes a single all-in price, and the whole amount settles at that price. It exists because a large order placed on an exchange moves the price against itself.'
			},
			{
				question: 'What is the minimum trade size for an OTC desk?',
				answer:
					'Most desks set a floor somewhere in the tens of thousands of dollars, though it varies widely and some Nigerian desks go lower. Each profile page lists the desk’s stated minimum ticket size where we have it.'
			},
			{
				question: 'How do I trade safely with an OTC desk?',
				answer:
					'Deal with a registered entity that has a verifiable address and, ideally, a licence — the profiles here list both. Agree settlement terms in writing before funds move, split your first trade into a smaller test, and be wary of any desk that requires full payment upfront on an unproven relationship.'
			}
		]
	},
	{
		slug: 'otc-desks-in-nigeria',
		heading: 'Best OTC Crypto Desks in Nigeria ({year})',
		title: 'Best OTC Crypto Desks in Nigeria ({year}) | Monierate',
		description:
			'Over-the-counter crypto desks serving Nigeria — compare minimum sizes, settlement times, licences and desk profiles, ranked on Monierate.',
		intro:
			'These {count} over-the-counter desks serve Nigerian clients trading sizes too large for an order book. A desk quotes one price for the full amount and settles it as a single transaction, usually to a bank account. The profiles below cover minimum ticket sizes, settlement times, payment routes and licences.',
		label: 'OTC desks in Nigeria',
		facets: { tags: ['otc'], country: 'nigeria' },
		faqs: [
			{
				question: 'When should I use an OTC desk instead of an exchange?',
				answer:
					'When your order is large enough that filling it on an exchange would move the price against you, or when you need the whole amount settled at one agreed rate rather than at whatever the book gives you. Below that size, an ordinary exchange is cheaper.'
			},
			{
				question: 'Are OTC desks regulated in Nigeria?',
				answer:
					'Desks operating as registered digital asset service providers fall under the SEC regime introduced by the Investments and Securities Act 2025, and many also hold licences tied to their payment operations. The profiles here list each desk’s licences and issuing authority where we have them.'
			}
		]
	},
	{
		slug: 'licensed-crypto-exchanges-in-nigeria',
		heading: 'Licensed Crypto Exchanges in Nigeria ({year})',
		title: 'Licensed Crypto Exchanges in Nigeria ({year}) | Monierate',
		description:
			'Crypto exchanges serving Nigeria that hold a licence — see the issuing authority, licence type and status alongside live rates on Monierate.',
		intro:
			'Every platform below holds at least one licence recorded on its Monierate profile, with the issuing authority and status shown on the card. A licence is not a guarantee, but it means the platform has a regulator it answers to and a registered entity behind it — the two things you have recourse against if a trade goes wrong.',
		label: 'Licensed crypto exchanges in Nigeria',
		facets: { tags: ['onramp', 'offramp'], country: 'nigeria', licensed: true },
		featured: true,
		faqs: [
			{
				question: 'Which regulator licenses crypto exchanges in Nigeria?',
				answer:
					'The Securities and Exchange Commission registers digital asset exchanges and service providers, following the Investments and Securities Act 2025, which recognises digital assets as securities. Platforms that also move naira typically hold a separate CBN payment licence for that side of the business.'
			},
			{
				question: 'Does a licence mean my money is safe?',
				answer:
					'It means the platform is accountable to a regulator, has met a capital and compliance bar, and can be pursued through a formal channel if it fails you. It does not insure your balance. Treat a licence as one strong signal among several rather than a guarantee.'
			},
			{
				question: 'How can I verify a platform’s licence?',
				answer:
					'Each profile page names the issuing authority and, where the platform has published one, links to the licence record. Cross-check the entity name on the regulator’s own register — licences are issued to a legal entity, which is not always the brand name on the app.'
			}
		]
	},
	{
		slug: 'remittance-apps-in-nigeria',
		heading: 'Best Remittance Apps in Nigeria ({year})',
		title: 'Best Remittance Apps in Nigeria ({year}) | Monierate',
		description:
			'Remittance apps serving Nigeria — compare live payout rates, transfer fees, delivery speed and licences across providers on Monierate.',
		intro:
			'These {count} remittance providers serve Nigeria, paying transfers into local bank accounts and wallets. What the recipient actually receives depends far more on the exchange rate than on the advertised fee, so each profile carries the live rate next to the provider’s fee notes and payout times.',
		label: 'Remittance apps in Nigeria',
		facets: { tags: ['remittance'], country: 'nigeria' },
		faqs: [
			{
				question: 'How much does it cost to send money to Nigeria?',
				answer:
					'The visible fee is usually a small part of the cost. Most providers earn on the exchange rate, so two apps advertising the same fee can differ by several percent in what lands in the recipient’s account. Compare the payout amount, not the fee.'
			},
			{
				question: 'Can I receive money in dollars in Nigeria?',
				answer:
					'Yes, into a domiciliary or USD account rather than a naira account. Several providers listed here pay out in dollars, which is worth doing if you would otherwise convert twice — once at the provider’s rate and again when you need dollars back.'
			}
		]
	}
];

/* ------------------------------- lookups ------------------------------- */

const BY_SLUG = new Map(EXCHANGE_COLLECTIONS.map((c) => [c.slug, c]));

export function getCollection(slug: string): ExchangeCollection | undefined {
	return BY_SLUG.get(slug);
}

export function isCollectionSlug(slug: string): boolean {
	return BY_SLUG.has(slug);
}

/** Substitute the `{year}` and `{count}` placeholders used in the copy. */
export function fillCopy(
	template: string,
	values: { year?: number | string; count?: number | string } = {}
): string {
	return template
		.replace(/\{year\}/g, String(values.year ?? new Date().getFullYear()))
		.replace(/\{count\}/g, String(values.count ?? ''));
}

/**
 * Collections a changer plausibly belongs to, for the cross-links on its
 * profile page. Evaluated locally against the changer record rather than by
 * re-querying each collection, so linking costs no extra requests.
 *
 * A collection matches when the changer satisfies every facet it declares.
 * Facets we cannot evaluate from the record (payment methods, platforms) are
 * skipped rather than assumed — a wrong cross-link is worse than a missing one.
 */
export function collectionsForChanger(changer: any, limit = 4): ExchangeCollection[] {
	if (!changer) return [];

	const tags: string[] = (changer.changer_tags ?? []).map((t: string) => t?.toLowerCase());
	const categories: string[] = (changer.categories ?? [])
		.map((c: any) => (typeof c === 'string' ? c : c?.name))
		.filter(Boolean)
		.map((c: string) => c.toLowerCase());
	const countries: string[] = (changer.countries ?? [])
		.map((c: any) => (typeof c === 'string' ? c : c?.name ?? c?.code))
		.filter(Boolean)
		.map((c: string) => c.toLowerCase());
	const city = changer.address?.city?.toLowerCase();
	const state = changer.address?.state?.toLowerCase();
	const licensed = (changer.licenses ?? []).length > 0;

	const matches = EXCHANGE_COLLECTIONS.filter(({ facets }) => {
		if (facets.tags && !facets.tags.some((t) => tags.includes(t.toLowerCase()))) return false;
		if (facets.categories && !facets.categories.some((c) => categories.includes(c.toLowerCase())))
			return false;
		if (facets.country && !countries.includes(facets.country.toLowerCase())) return false;
		if (facets.city && city !== facets.city.toLowerCase()) return false;
		if (facets.state && state !== facets.state.toLowerCase()) return false;
		if (facets.licensed && !licensed) return false;
		if (facets.verified && !changer.is_verified) return false;
		if (facets.kyc_required && !changer.kyc_required) return false;
		if (
			facets.license_authority &&
			!(changer.licenses ?? []).some(
				(l: any) => l?.authority?.toLowerCase() === facets.license_authority?.toLowerCase()
			)
		)
			return false;
		return true;
	});

	// Most specific first — a page about "OTC desks in Lagos" is a better link
	// from a Lagos OTC desk's profile than the catch-all off-ramp collection.
	return matches
		.sort((a, b) => Object.keys(b.facets).length - Object.keys(a.facets).length)
		.slice(0, limit);
}
