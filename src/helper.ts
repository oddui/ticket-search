/**
 * Regexp to match date time from the sample data files. It's almost in ISO 8601 format
 * but with an extra space between time and time zone.
 */
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\s([+-]\d{2}:\d{2})|Z$/i;

/**
 * Convert date time string to numbers.
 * @param str the input to parse
 * @returns The number of milliseconds since unix epoch in one item array. May return `NaN`.
 */
export function parseDateTime(str: string): number {
  // For date time from the sample data files, remove the extra space to make it valid ISO 8601.
  if (DATE_TIME.test(str)) str = str.split(/\s/).join("");
  return Date.parse(str);
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
