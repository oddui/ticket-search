import TrieMap from "standard-library-extensions/dist/util/TrieMap";
import { isArrayOfString } from "../helper";
import Tokenizer from "../tokenizer/tokenizer";
import SearchIndex, { Id, SearchDocument } from "./search-index";

class TrieIndex extends SearchIndex {
  private index = new TrieMap<Id[]>();

  constructor(private field: string, private tokenizer: Tokenizer) {
    super();
  }

  /**
   * Tokenize the field value and map the tokens to the document in the internal Trie.
   * @param doc
   * @returns
   */
  indexDocument(doc: SearchDocument) {
    const fieldValue = doc[this.field];
    let tokens: string[];
    if (typeof fieldValue === "string") {
      tokens = this.tokenizer.tokenize(fieldValue);
    } else if (isArrayOfString(fieldValue)) {
      tokens = fieldValue
        .map((token) => token.toLowerCase().trim())
        .filter(Boolean);
    } else {
      // Use empty string to index absent or non-string fields
      tokens = [""];
    }

    for (const token of tokens) {
      if (!this.index.has(token)) this.index.set(token, []);
      // @ts-expect-error: map entry defined above
      this.index.get(token).push(doc._id);
    }
    return this;
  }

  /**
   * Return ids that have been mapped to all tokens derived from the search term.
   * @param term
   * @returns
   */
  search(term: string) {
    const tokens = this.tokenizer.tokenize(term);
    if (!tokens.length) return this.index.get("") ?? [];

    const result = new Set(this.documentIdsWithPrefix(tokens[0]));
    for (const token of tokens) {
      const ids = new Set(this.documentIdsWithPrefix(token));
      for (const id of result) {
        if (!ids.has(id)) result.delete(id);
      }
    }
    return [...result];
  }

  private documentIdsWithPrefix(prefix: string) {
    return [...this.index.entriesWithPrefix(prefix)]
      .map(([_, ids]) => ids)
      .flat();
  }
}

export default TrieIndex;
