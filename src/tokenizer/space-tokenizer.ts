/**
 * Simple tokenizer that breaks input by white spaces.
 */
class SpaceTokenizer {
  /**
   * Breaks input by white space.
   * @param input
   * @returns
   */
  tokenize(input: string): string[] {
    return input
      .toLowerCase() // case insensitive
      .split(/\s+/) // break by white spaces
      .filter(token => token) // remove empty token
      .map((token) => { // remove surrounding brackets
        const match = token.match(/^\((.+)\)$/);
        if (!match) return token;
        return match[1];
      });
  }
}

export default SpaceTokenizer;
