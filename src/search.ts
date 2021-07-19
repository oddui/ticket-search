import { readFile } from "fs/promises";
import path from "path";
import { Entity } from "./entity";
import OrganizationSearch from "./entity-search/organization-search";
import TicketSearch from "./entity-search/ticket-search";
import UserSearch from "./entity-search/user-search";

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
          throw new Error(`Cannot find data file "${file}".`);
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

  private searchUsers(field: string, term: string) {
    return this.users.search(field, term).map((result) => ({
      ...result,
      submitted_tickets: this.tickets
        .search("submitter_id", String(result._id))
        .map((ticket) => ticket.subject),
      ...result,
      assigned_tickets: this.tickets
        .search("assignee_id", String(result._id))
        .map((ticket) => ticket.subject),
    }));
  }

  private searchTickets(field: string, term: string) {
    return this.tickets.search(field, term);
  }

  private searchOrganizations(field: string, term: string) {
    return this.organizations.search(field, term).map((result) => ({
      ...result,
      users: this.users
        .search("organization_id", String(result._id))
        .map((user) => user.name),
      tickets: this.tickets
        .search("organization_id", String(result._id))
        .map((ticket) => ticket.subject),
    }));
  }
}

export default Search;
