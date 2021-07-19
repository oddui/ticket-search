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

  constructor() {}

  /**
   *
   * @param folder the absolute path containing users.json, tickets.json, and organizations.json data files.
   */
  async readDataFiles(folder: string) {
    const [userData, ticketData, organizationData] = await Promise.all(
      ["users.json", "tickets.json", "organizations.json"].map((file) => {
        try {
          return readFile(path.resolve(folder, file), "utf8");
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
        // TODO: link associated created tickets, and assigned tickets
        return this.users.search(field, term);
      case "ticket":
        return this.tickets.search(field, term);
      case "organization":
        // TODO: link associated users, and tickets
        return this.organizations.search(field, term);
    }
  }
}

export default Search;
