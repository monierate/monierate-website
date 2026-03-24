import { writable, get } from "svelte/store";

type FormatOptions = {
  locale?: string;
  useGrouping?: boolean;
  decimals?: number;
  currency?: string;
  style?: "decimal" | "currency";
};

export class NumberFormatter {
  private _formatted = writable("");
  private _raw = writable("");
  public inputElement: HTMLInputElement | null = null;

  private options: FormatOptions = {
    locale: "en-US",
    useGrouping: true,
    decimals: 0,
    style: "decimal",
  };

  constructor(initial?: string, opts?: FormatOptions) {
    if (initial) this.handler = initial;
    if (opts) this.setOptions(opts);
  }

  get handler() {
    return get(this._formatted);
  }

  set handler(newVal: string) {
    const raw = newVal.replace(/[^\d.-]/g, "");
    this._raw.set(raw);

    const formatted = this.formatNumber(raw);
    this._formatted.set(formatted);
  }

  get raw() {
    return get(this._raw);
  }

  get formatted() {
    return get(this._formatted);
  }

private formatNumber(value: string): string {
  if (!value) return "";

  const { locale, useGrouping, decimals } = this.options;

  // Split manually (NO number math)
  const [intPartRaw, fracPartRaw] = value.split(".");

  // Format integer part only
  const intNum = Number(intPartRaw || 0);
  if (isNaN(intNum)) return "";

  const intFormatted = new Intl.NumberFormat(locale, {
    useGrouping,
    maximumFractionDigits: 0,
  }).format(intNum);

  // If no decimals allowed
  if (!decimals || decimals === 0) {
    return intFormatted;
  }

  // Preserve fractional part exactly (NO rounding)
  const frac = fracPartRaw?.slice(0, decimals) ?? "";

  return fracPartRaw !== undefined
    ? `${intFormatted}.${frac}`
    : intFormatted;
}


  setOptions(newOpts: Partial<FormatOptions>) {
    this.options = { ...this.options, ...newOpts };

    // Reapply formatting
    const raw = get(this._raw);
    const formatted = this.formatNumber(raw);
    this._formatted.set(formatted);
  }

  reset() {
    this._raw.set("");
    this._formatted.set("");
  }

  format(value: string | number): string {
    const str =
      typeof value === "string"
        ? value.replace(/[^\d.-]/g, "")
        : value.toString();
    return this.formatNumber(str);
  }
}
