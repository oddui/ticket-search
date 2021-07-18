import { readFile } from "fs/promises";
import path from "path";
import { Entity } from "./entity";
import UserSearch from "./entity-search/user-search";

class Search {
  private userSearch = new UserSearch();

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

    this.userSearch.addIndexesForAllFields();
    this.userSearch.addDocuments(userDocuments);
  }

  search(entity: Entity, field: string, term: string) {
    switch (entity) {
      case "user":
        return this.userSearch.search(field, term);
      case "ticket":
        return;
      case "organization":
        return;
    }
  }
}

export default Search;
