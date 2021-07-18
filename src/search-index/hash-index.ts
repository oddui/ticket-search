import SearchIndex, { SearchDocument } from "./search-index";

class HashIndex extends SearchIndex {
  private index = new Map<string, number[]>();

  constructor(private field: string) {
    super();
  }

  indexDocument(doc: SearchDocument) {
    let value: string;
    if ((this.field in doc)) {
      // Cast value to string. This should work well for number, boolean, and string types.
      value = String(doc[this.field]);
    } else {
      // Use empty string to index absent field.
      // This does mean that a field being absent, and it having explicit empty string value, are equivalent.
      value = "";
    }

		if (!this.index.has(value)) this.index.set(value, []);
		// @ts-expect-error: map entry defined above
    this.index.get(value).push(doc._id);
    return this;
  }

  search(term: string) {
    return this.index.get(term) ?? [];
  }
}

export default HashIndex;
