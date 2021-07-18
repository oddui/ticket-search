import HashIndex from "../search-index/hash-index";
import SearchIndex, { SearchDocument } from "../search-index/search-index";

export type FieldType = "hash" | "timestamp" | "string";

abstract class EntitySearch {
  protected documents = new Map<number, SearchDocument>();
  protected indexes = new Map<string, SearchIndex>();
  protected abstract fields: Map<string, FieldType>;

  getDocumentById(id: number) {
    return this.documents.get(id);
  }

  addDocument(doc: SearchDocument) {
    this.documents.set(doc._id, doc);
    for (const [_, index] of this.indexes) {
      index.indexDocument(doc);
    }
    return this;
  }

  addDocuments(docs: SearchDocument[]): this {
    for (const doc of docs) {
      this.addDocument(doc);
    }
    return this;
  }

  addIndex(field: string): this {
    this.assertIsKnownField(field);

    const fieldType = this.fields.get(field) as FieldType;
    let index;
    switch (fieldType) {
      case "hash":
        index = new HashIndex(field);
        break;
      case "timestamp":
        // TODO: use binary search index
        index = new HashIndex(field);
        break;
      case "string":
        // TODO: use trie index with tokenizer
        index = new HashIndex(field);
        break;
    }
    this.indexes.set(field, index);
    return this;
  }

  addIndexesForAllFields() {
    for (const [field] of this.fields) {
      this.addIndex(field);
    }
    return this;
  }

  search(field: string, term: string) {
    this.assertIsKnownField(field);
    this.assertFieldIsIndexed(field);

    const index = this.indexes.get(field);
    // @ts-expect-error: index is present
    return index
      .search(term)
      .map((id) => this.documents.get(id))
      .filter<SearchDocument>(this.isSearchDocument);
  }

  protected assertIsKnownField(field: string) {
    if (!this.fields.has(field)) {
      throw new Error(`Unknown field "${field}".`);
    }
  }

  protected isSearchDocument(
    doc: SearchDocument | undefined
  ): doc is SearchDocument {
    return !!doc;
  }

  protected assertFieldIsIndexed(field: string) {
    if (!this.indexes.has(field)) {
      throw new Error(
        `Cannot search field "${field}". Please add index first.`
      );
    }
  }
}

export default EntitySearch;
