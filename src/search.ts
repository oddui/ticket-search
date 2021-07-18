import { readFile } from "fs/promises";
import path from "path";
import { Entity } from "./entity";
import UserSearch from "./entity-search/user-search";

class Search {
  private users = new UserSearch();

  constructor() {}

  /**
   *
   * @param folder the absolute path containing users.json, tickets.json, and organizations.json data files.
   */
  async readDataFiles(folder: string) {
    const [userData] = await Promise.all(
      ["users.json"].map((file) => {
        try {
          return readFile(path.resolve(folder, file), "utf8")
        } catch (e) {
          throw new Error(`Cannot find data file "${file}".`);
        }
      })
    );

    let userDocuments;
    try {
      userDocuments = JSON.parse(userData);
    } catch (e) {
      throw new Error(`Malformed users.json file.`);
    }

    this.users.addIndexesForAllFields();
    this.users.addDocuments(userDocuments);
  }

  search(entity: Entity, field: string, term: string) {
    switch (entity) {
      case "user":
        // TODO: link associated created tickets, and assigned tickets
        return this.users.search(field, term);
      case "ticket":
        // TODO: use ticket search
        return;
      case "organization":
        // TODO: use organization search
        // TODO: link associated users, and tickets
        return;
    }
  }
}

export default Search;
