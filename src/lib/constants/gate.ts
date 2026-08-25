/**
 * Free rows shown on the OHLC/index history tables before the rest gates
 * behind a day-pass/Pro unlock. Shared between the page loads (which decide
 * whether it's worth resolving day-pass status at all) and the tables
 * themselves (which decide how many rows to render) so the two can't drift.
 *
 * Must stay at or below the server-paginated tables' page size (20 — see
 * `OhlcTable.svelte`'s `pageSize` default): those hold only the current page in
 * memory, so a larger cap here would silently truncate to the page size instead
 * of showing what it promises.
 */
export const FREE_HISTORY_ROWS = 15;
