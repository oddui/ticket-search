/**
 * Preparing inputs for SearchIndex.
 */
abstract class Tokenizer {
  abstract tokenize(input: string): Array<string>;
}

export default Tokenizer;
