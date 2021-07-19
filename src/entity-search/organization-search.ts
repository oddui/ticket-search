import EntitySearch, { IndexType } from "./entity-search";

export const organizationFields = new Map<string, IndexType>([
  ["_id", "hash"],
  ["url", "trie"],
  ["external_id", "hash"],
  ["name", "trie"],
  ["domain_names", "trie"],
  ["created_at", "dateTimeBinarySearch"],
  ["details", "trie"],
  ["shared_tickets", "hash"],
  ["tags", "trie"],
]);

class OrganizationSearch extends EntitySearch {
  fields = organizationFields;
}

export default OrganizationSearch;
