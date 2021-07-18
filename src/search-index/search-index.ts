export type SearchDocument = {
  _id: number;
  [field: string]: number | string | boolean;
};

abstract class SearchIndex {
  abstract indexDocument(doc: SearchDocument): this;
  abstract search(term: string): number[];
}

export default SearchIndex;
