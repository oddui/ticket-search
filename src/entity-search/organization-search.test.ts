import documents from "../../data/organizations.json";
import OrganizationSearch from "./organization-search";

describe("OrganizationSearch", () => {
  let organizations: OrganizationSearch;

  beforeEach(() => {
    organizations = new OrganizationSearch();
    organizations.addIndexesForAllFields();
    organizations.addDocuments(documents);
  });

  it("getDocumentById()", () => {
    expect(organizations.getDocumentById(101)).toMatchObject({ _id: 101 });
  });

  describe("search()", () => {
    it("throws error if field is not indexed", () => {
      expect(() => new OrganizationSearch().search("_id", "1")).toThrowError(
        /cannot search/i
      );
    });

    it("throws error for unknown field", () => {
      expect(() => organizations.search("size", "large")).toThrowError(/unknown field/i);
    });

    it("works", () => {
      const results = organizations.search("_id", "101");
      for (const result of results) {
        expect(result).toHaveProperty("_id", 101);
      }
    });
  });
});
