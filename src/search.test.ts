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
        expect(e.message).toMatch(/cannot find data file/i);
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
        });
      }
    });

    it("routes an organization search", () => {
      const results = search.search("organization", "_id", "101");
      for (const result of results) {
        expect(result).toMatchObject({
          _id: 101,
          details: "MegaCorp",
        });
      }
    });
  });
});
