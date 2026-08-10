/**
 * Free rows shown on the OHLC/index history tables before the rest gates
 * behind a day-pass/Pro unlock. Shared between the page loads (which decide
 * whether it's worth resolving day-pass status at all) and the tables
 * themselves (which decide how many rows to render) so the two can't drift.
 */
export const FREE_HISTORY_ROWS = 10;
