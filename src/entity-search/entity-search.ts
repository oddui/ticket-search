import HashIndex from "../search-index/hash-index";
import SearchIndex, { SearchDocument } from "../search-index/search-index";

export type FieldType = "hash" | "timestamp" | "string";

abstract class EntitySearch {
  protected indexes = new Map<string, SearchIndex>();
  protected documents = new Map<number, SearchDocument>();

  public abstract addIndex(field: string): this;
  public abstract addIndexesForAllFields(): this;
  public abstract search(field: string, term: string): SearchDocument[];
  protected abstract assertIsKnownField(field: string): void;

  getById(id: number) {
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

  protected _addIndex(field: string, fieldType: FieldType): this {
    let index;
    switch (fieldType) {
      case "hash":
        index = new HashIndex(field);
        break;
      default:
        throw new Error(`Unknown field type "${fieldType}".`);
    }
    this.indexes.set(field, index);
    return this;
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
