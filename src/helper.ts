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

/**
 * Type guard to check if input is an array of string.
 * @param input 
 * @returns 
 */
export function isArrayOfString(input: any): input is string[] {
  if (!Array.isArray(input)) return false;

  for (const item of input) {
    if (typeof item !== "string") return false;
  }
  return true;
}
