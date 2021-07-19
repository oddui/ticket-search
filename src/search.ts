import { readFile } from "fs/promises";
import path from "path";
import { Entity } from "./entity";
import OrganizationSearch from "./entity-search/organization-search";
import TicketSearch from "./entity-search/ticket-search";
import UserSearch from "./entity-search/user-search";
import { SearchDocument } from "./search-index/search-index";

export type SearchResult =
  | SearchDocument
  | {
      submitted_tickets?: string[];
      assigned_tickets?: string[];
      users?: string[];
      tickets?: string[];
    };

/**
 * Read data files and route query to corresponding entity searches.
 */
class Search {
  private users = new UserSearch();
  private tickets = new TicketSearch();
  private organizations = new OrganizationSearch();

  /**
   * Load and index data files.
   * @param folder the absolute path containing users.json, tickets.json, and organizations.json data files.
   * @returns
   */
  async readDataFiles(folder: string) {
    const [userData, ticketData, organizationData] = await Promise.all(
      ["users.json", "tickets.json", "organizations.json"].map(async (file) => {
        try {
          const content = await readFile(path.resolve(folder, file), "utf8");
          return content;
        } catch (e) {
          throw new Error(`Failed to load data file "${file}".`);
        }
      })
    );

    let userDocuments;
    let ticketDocuments;
    let organizationDocuments;
    try {
      userDocuments = JSON.parse(userData);
    } catch (e) {
      throw new Error(`Malformed users.json file.`);
    }
    try {
      ticketDocuments = JSON.parse(ticketData);
    } catch (e) {
      throw new Error(`Malformed tickets.json file.`);
    }
    try {
      organizationDocuments = JSON.parse(organizationData);
    } catch (e) {
      throw new Error(`Malformed organizations.json file.`);
    }

    this.users.addIndexesForAllFields();
    this.users.addDocuments(userDocuments);
    this.tickets.addIndexesForAllFields();
    this.tickets.addDocuments(ticketDocuments);
    this.organizations.addIndexesForAllFields();
    this.organizations.addDocuments(organizationDocuments);
  }

  search(entity: Entity, field: string, term: string) {
    switch (entity) {
      case "user":
        return this.searchUsers(field, term);
      case "ticket":
        return this.searchTickets(field, term);
      case "organization":
        return this.searchOrganizations(field, term);
    }
  }

  private searchUsers(field: string, term: string): SearchResult[] {
    return this.users.search(field, term).map((result) => ({
      ...result,
      submitted_tickets: this.tickets
        .search("submitter_id", String(result._id))
        .map((ticket) => ticket.subject as string),
      ...result,
      assigned_tickets: this.tickets
        .search("assignee_id", String(result._id))
        .map((ticket) => ticket.subject as string),
      ...(result.organization_id && {
        organization: this.organizations.search(
          "_id",
          String(result.organization_id)
        )[0].name as string,
      }),
    }));
  }

  private searchTickets(field: string, term: string): SearchResult[] {
    return this.tickets.search(field, term).map((result) => ({
      ...result,
      ...(result.organization_id && {
        organization: this.organizations.search(
          "_id",
          String(result.organization_id)
        )[0].name as string,
      }),
      ...(result.submitter_id && {
        submitter: this.users.search("_id", String(result.submitter_id))[0]
          .name as string,
      }),
      ...(result.assignee_id && {
        assignee: this.users.search("_id", String(result.assignee_id))[0]
          .name as string,
      }),
    }));
  }

  private searchOrganizations(field: string, term: string): SearchResult[] {
    return this.organizations.search(field, term).map((result) => ({
      ...result,
      users: this.users
        .search("organization_id", String(result._id))
        .map((user) => user.name as string),
      tickets: this.tickets
        .search("organization_id", String(result._id))
        .map((ticket) => ticket.subject as string),
    }));
  }
}

export default Search;
