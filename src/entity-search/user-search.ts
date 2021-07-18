import { SearchDocument } from "../search-index/search-index";
import EntitySearch, { FieldType } from "./entity-search";

class UserSearch extends EntitySearch {
  static Fields = new Map<string, FieldType>([
    ["_id", "hash"],
    ["url", "hash"],
    ["external_id", "hash"],
    //["name", "string"],
    //["alias", "string"],
    //["created_at", "timestamp"],
    ["active", "hash"],
    ["verified", "hash"],
    ["shared", "hash"],
    ["locale", "hash"],
    ["timezone", "hash"],
    //["last_login_at", "timestamp"],
    //["email", "string"],
    //["phone", "string"],
    //["signature", "string"],
    ["organization_id", "hash"],
    //["tags", "string"],
    ["suspended", "hash"],
    ["role", "hash"],
  ]);

  addIndex(field: string): this {
    this.assertIsKnownField(field);

    const fieldType = UserSearch.Fields.get(field);
    // @ts-expect-error: fieldType is asserted defined
    return this._addIndex(field, fieldType);
  }

  addIndexesForAllFields() {
    for (const [field] of UserSearch.Fields) {
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
      .map((id) => {
        const doc = this.documents.get(id);
        if (!doc) return;

        // TODO: add associations
        return doc;
      })
      .filter<SearchDocument>(this.isSearchDocument);
  }

  protected assertIsKnownField(field: string) {
    if (!UserSearch.Fields.has(field)) {
      throw new Error(`Unknown field "${field}".`);
    }
  }
}

export default UserSearch;
