export type Id = number | string;

export type SearchDocument = {
  _id: Id;
  [field: string]: number | string | string[] | boolean | undefined;
};

abstract class SearchIndex {
  abstract indexDocument(doc: SearchDocument): this;
  abstract search(term: string): Id[];
}

export default SearchIndex;
