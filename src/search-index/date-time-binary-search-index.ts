import TreeMap from "standard-library-extensions/dist/util/TreeMap";
import { parseDateTime } from "../helper";
import SearchIndex, { Id, SearchDocument } from "./search-index";

class DateTimeBinarySearchIndex extends SearchIndex {
  private index = new TreeMap<number, Id[]>();

  constructor(private field: string) {
    super();
  }

  indexDocument(doc: SearchDocument) {
    const fieldValue = doc[this.field];
    let value: number;
    if (typeof fieldValue === "string") {
      value = parseDateTime(fieldValue);
    } else {
      // Use NaN to index empty or invalid date time.
      value = NaN;
    }

    if (!this.index.has(value)) this.index.set(value, []);
    // @ts-expect-error: map entry defined above
    this.index.get(value).push(doc._id);
    return this;
  }

  search(term: string) {
    let key: number;
    if (term) {
      key = parseDateTime(term);
      if (Number.isNaN(key)) {
        throw new Error(`Invalid date time search term "${term}".`);
      }
    } else {
      key = NaN;
    }
    return this.index.get(key) ?? [];
  }
}

export default DateTimeBinarySearchIndex;
