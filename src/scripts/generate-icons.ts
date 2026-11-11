/**
 * Generates currency icons (static/icons/currencies) and pair icons
 * (static/icons/pair) from the SVG sources in src/scripts/icons/sources.
 *
 * Usage:
 *   npm run icons            # write only files that do not exist yet
 *   npm run icons -- --force # regenerate everything in the lists below
 *
 * Pair style matches the designed icons (MON-254): two overlapping circles on a
 * 345x192 canvas, base currency on the left drawn on top of the quote currency.
 * Hand-designed pair icons already in static/icons/pair are never overwritten
 * unless --force is passed.
 *
 * Sources:
 *   Fiat flags: circle-flags (MIT), https://github.com/HatScripts/circle-flags
 *   Crypto:     cryptocurrency-icons (CC0), https://github.com/spothq/cryptocurrency-icons
 *   xof.svg:    currency-flags (MIT), https://github.com/transferwise/currency-flags
 *   xaf.svg:    drawn in CEMAC flag colours (no public icon exists), pending design review
 *
 * To add a currency: drop {code}.svg into the sources folder and list it below.
 * To add a pair: add [base, quote] to PAIRS.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SOURCES = join(root, 'src', 'scripts', 'icons', 'sources');
const CURRENCY_DIR = join(root, 'static', 'icons', 'currencies');
const PAIR_DIR = join(root, 'static', 'icons', 'pair');

const force = process.argv.includes('--force');

/** Single-currency icons written to static/icons/currencies. */
const CURRENCIES = ['eth', 'aed', 'cny', 'xaf', 'xof', 'aud', 'jpy'];
const CURRENCY_SIZE = 256;

/** [base, quote] pairs written to static/icons/pair as {base}{quote}.png. */
const PAIRS: [string, string][] = [
	// Naira
	['aed', 'ngn'], ['cny', 'ngn'], ['ghs', 'ngn'], ['kes', 'ngn'],
	['xaf', 'ngn'], ['xof', 'ngn'], ['zar', 'ngn'],
	// Rand
	['eur', 'zar'], ['gbp', 'zar'], ['usdc', 'zar'], ['btc', 'zar'], ['eth', 'zar'],
	// Shilling
	['eur', 'kes'], ['gbp', 'kes'], ['usdc', 'kes'], ['btc', 'kes'], ['eth', 'kes'],
	// Cedi
	['eur', 'ghs'], ['gbp', 'ghs'], ['usdc', 'ghs'],
	// CFA franc
	['usdt', 'xaf'], ['usdt', 'xof'],
	// Other
	['usdt', 'eur'], ['eur', 'usdt'], ['usdt', 'cny']
];
const PAIR_W = 345;
const PAIR_H = 192;
const PAIR_QUOTE_X = PAIR_W - PAIR_H; // 153, same overlap as the designed icons

async function roundIcon(code: string, size: number): Promise<Buffer> {
	const svg = readFileSync(join(SOURCES, `${code}.svg`));
	const mask = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
	);
	return sharp(svg, { density: 600 })
		.resize(size, size, { fit: 'cover' })
		.composite([{ input: mask, blend: 'dest-in' }])
		.png()
		.toBuffer();
}

const writePng = (img: sharp.Sharp, file: string) =>
	img.png({ palette: true, quality: 95, compressionLevel: 9, effort: 10 }).toFile(file);

async function main() {
	let written = 0;
	let skipped = 0;

	for (const code of CURRENCIES) {
		const file = join(CURRENCY_DIR, `${code}.png`);
		if (existsSync(file) && !force) { skipped++; continue; }
		await writePng(sharp(await roundIcon(code, CURRENCY_SIZE)), file);
		written++;
		console.log(`currency  ${code}.png`);
	}

	for (const [base, quote] of PAIRS) {
		const file = join(PAIR_DIR, `${base}${quote}.png`);
		if (existsSync(file) && !force) { skipped++; continue; }
		const [b, q] = await Promise.all([roundIcon(base, PAIR_H), roundIcon(quote, PAIR_H)]);
		const canvas = sharp({
			create: { width: PAIR_W, height: PAIR_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
		}).composite([
			{ input: q, left: PAIR_QUOTE_X, top: 0 },
			{ input: b, left: 0, top: 0 }
		]);
		await writePng(sharp(await canvas.png().toBuffer()), file);
		written++;
		console.log(`pair      ${base}${quote}.png`);
	}

	console.log(`\n${written} written, ${skipped} skipped (already exist${force ? '' : ', use --force to regenerate'})`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
