import EntitySearch, { IndexType } from "./entity-search";

export const userFields = new Map<string, IndexType>([
  ["_id", "hash"],
  //["url", "trie"],
  ["external_id", "hash"],
  //["name", "trie"],
  //["alias", "trie"],
  ["created_at", "dateTimeBinarySearch"],
  ["active", "hash"],
  ["verified", "hash"],
  ["shared", "hash"],
  ["locale", "hash"],
  ["timezone", "hash"],
  ["last_login_at", "dateTimeBinarySearch"],
  //["email", "trie"],
  //["phone", "trie"],
  //["signature", "trie"],
  ["organization_id", "hash"],
  //["tags", "trie"],
  ["suspended", "hash"],
  ["role", "hash"],
]);

class UserSearch extends EntitySearch {
  fields = userFields;
}

export default UserSearch;
