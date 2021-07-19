import path from "path";
import Search from "./search";

describe("Search", () => {
  let search: Search;

  beforeAll(() => {
    search = new Search();
    return search.readDataFiles(path.resolve(__dirname, "..", "data"));
  });

  describe("readDataFiles()", () => {
    it("throws if folder does not contain data files", async () => {
      expect.assertions(1);
      try {
        await search.readDataFiles("");
      } catch (e) {
        expect(e.message).toMatch(/failed to load data file/i);
      }
    });
  });

  describe("search()", () => {
    it("routes a user search", () => {
      const results = search.search("user", "_id", "1");
      for (const result of results) {
        expect(result).toMatchObject({
          _id: 1,
          role: "admin",
          organization: "Multron",
          submitted_tickets: [
            "A Nuisance in Kiribati",
            "A Nuisance in Saint Lucia",
          ],
          assigned_tickets: [
            "A Problem in Russian Federation",
            "A Problem in Malawi",
          ],
        });
      }
    });

    it("routes a ticket search", () => {
      const results = search.search(
        "ticket",
        "_id",
        "436bf9b0-1147-4c0a-8439-6f79833bff5b"
      );
      for (const result of results) {
        expect(result).toMatchObject({
          _id: "436bf9b0-1147-4c0a-8439-6f79833bff5b",
          via: "web",
          organization: "Zentry",
          submitter: "Elma Castro",
          assignee: "Harris Côpeland",
        });
      }
    });

    it("routes an organization search", () => {
      const results = search.search("organization", "_id", "101");
      for (const result of results) {
        expect(result).toMatchObject({
          _id: 101,
          details: "MegaCorp",
          users: [
            "Loraine Pittman",
            "Francis Bailey",
            "Haley Farmer",
            "Herrera Norman",
          ],
          tickets: [
            "A Drama in Portugal",
            "A Problem in Ethiopia",
            "A Problem in Turks and Caicos Islands",
            "A Problem in Guyana",
          ],
        });
      }
    });
  });
});
