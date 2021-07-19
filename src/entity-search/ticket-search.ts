import EntitySearch, { IndexType } from "./entity-search";

export const ticketFields = new Map<string, IndexType>([
  ["_id", "hash"],
  ["url", "trie"],
  ["external_id", "hash"],
  ["created_at", "dateTimeBinarySearch"],
  ["type", "hash"],
  ["subject", "trie"],
  ["description", "trie"],
  ["priority", "hash"],
  ["status", "hash"],
  ["submitter_id", "hash"],
  ["assignee_id", "hash"],
  ["organization_id", "hash"],
  ["tags", "trie"],
  ["has_incidents", "hash"],
  ["due_at", "dateTimeBinarySearch"],
  ["via", "hash"],
]);

class TicketSearch extends EntitySearch {
  fields = ticketFields;
}

export default TicketSearch;
