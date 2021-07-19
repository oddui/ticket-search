import DateTimeBinarySearchIndex from "./date-time-binary-search-index";

describe("DateTimeBinarySearchIndex", () => {
  const documents = [
    { _id: 1, created_at: "2016-04-15T05:19:46 -10:00" },
    { _id: 2, created_at: "2016-04-15T05:19:46 -10:00" },
    { _id: 3, created_at: "2016-07-28T05:29:25 -10:00" },
    { _id: 4, created_at: "2016-02-09T07:52:10 -11:00" },
    { _id: 5 },
  ];
  let index: DateTimeBinarySearchIndex;

  beforeEach(() => {
    index = new DateTimeBinarySearchIndex("created_at");
    documents.forEach((doc) => index.indexDocument(doc));
  });

  it("returns matched objects _ids", () => {
    expect(index.search("2016-04-15T05:19:46 -10:00")).toEqual([1, 2]);
  });

  it("returns objects ids with the field absent if search for empty string", () => {
    expect(index.search("")).toEqual([5]);
  });

  it("return empty array if search miss", () => {
    expect(index.search("2021-04-15T05:19:46 -10:00")).toEqual([]);
  });

  it("throws for invalid date time search term", () => {
    expect(() => index.search("2021-04-15T05:19:46Melbourne")).toThrowError(
      /invalid date time/i
    );
  });
});
