import documents from "../../data/users.json";
import UserSearch from "./user-search";

describe("UserSearch", () => {
  let users: UserSearch;

  beforeEach(() => {
    users = new UserSearch();
    users.addIndexesForAllFields();
    users.addDocuments(documents);
  });

  it("getDocumentById()", () => {
    expect(users.getDocumentById(1)).toMatchObject({ _id: 1 });
  });

  describe("search()", () => {
    it("throws error if field is not indexed", () => {
      expect(() => new UserSearch().search("_id", "1")).toThrowError(
        /cannot search/i
      );
    });

    it("throws error for unknown field", () => {
      expect(() => users.search("age", "1")).toThrowError(/unknown field/i);
    });

    it("works", () => {
      const results = users.search("_id", "1");
      for (const result of results) {
        expect(result).toHaveProperty("_id", 1);
      }
    });
  });
});
