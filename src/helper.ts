/**
 * Convert date time string to numbers. The date time field in the data files are not in standard
 * format. Removing the space between time and offset makes is an ISO 8601 date time.
 *
 * @param str the input to parse
 * @returns The number of milliseconds since unix epoch in one item array. May return `NaN`.
 */
export function parseDateTime(str: string): number {
  return Date.parse(str.split(" ").join(""));
}
