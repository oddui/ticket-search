import documents from "../../data/tickets.json";
import TicketSearch from "./ticket-search";

describe("TicketSearch", () => {
  let tickets: TicketSearch;

  beforeEach(() => {
    tickets = new TicketSearch();
    tickets.addIndexesForAllFields();
    tickets.addDocuments(documents);
  });

  it("getDocumentById()", () => {
    expect(
      tickets.getDocumentById("436bf9b0-1147-4c0a-8439-6f79833bff5b")
    ).toMatchObject({ _id: "436bf9b0-1147-4c0a-8439-6f79833bff5b" });
  });

  describe("search()", () => {
    it("throws error if field is not indexed", () => {
      expect(() => new TicketSearch().search("_id", "1")).toThrowError(
        /cannot search/i
      );
    });

    it("throws error for unknown field", () => {
      expect(() => tickets.search("release", "1")).toThrowError(
        /unknown field/i
      );
    });

    it("works", () => {
      const results = tickets.search(
        "_id",
        "436bf9b0-1147-4c0a-8439-6f79833bff5b"
      );
      for (const result of results) {
        expect(result).toHaveProperty(
          "_id",
          "436bf9b0-1147-4c0a-8439-6f79833bff5b"
        );
      }
    });
  });
});
