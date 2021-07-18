import EntitySearch, { FieldType } from "./entity-search";

export const userFields = new Map<string, FieldType>([
  ["_id", "hash"],
  //["url", "string"],
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

class UserSearch extends EntitySearch {
  fields = userFields;
}

export default UserSearch;
