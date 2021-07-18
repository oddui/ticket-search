import HashIndex from "./hash-index";

describe("HashIndex", () => {
  const documents = [
    { _id: 1, role: "owner", active: true },
    { _id: 2, role: "admin", active: true },
    { _id: 3, role: "user", active: true },
    { _id: 4, role: "user", active: false },
    { _id: 5 },
  ];
  let index: HashIndex;

  describe("searches number field", () => {
    beforeEach(() => {
      index = new HashIndex("_id");
      documents.forEach((doc) => index.indexDocument(doc));
    });

    it("returns matched objects _ids", () => {
      expect(index.search("1")).toEqual([1]);
    });

    it("return empty array if search miss", () => {
      expect(index.search("0")).toEqual([]);
    });
  });

  describe("searches boolean field", () => {
    beforeEach(() => {
      index = new HashIndex("active");
      documents.forEach((doc) => index.indexDocument(doc));
    });

    it("returns matched objects _ids with boolean field being true", () => {
      expect(index.search("true")).toEqual([1, 2, 3]);
    });

    it("returns matched objects _ids with boolean field being false", () => {
      expect(index.search("false")).toEqual([4]);
    });

    it("returns objects ids with the field absent if search for empty string", () => {
      expect(index.search("")).toEqual([5]);
    });
  });

  describe("searches string field", () => {
    beforeEach(() => {
      index = new HashIndex("role");
      documents.forEach((doc) => index.indexDocument(doc));
    });

    it("returns matched objects _ids", () => {
      expect(index.search("user")).toEqual([3, 4]);
    });

    it("returns objects ids with the field absent if search for empty string", () => {
      expect(index.search("")).toEqual([5]);
    });

    it("return empty array if search miss", () => {
      expect(index.search("end-user")).toEqual([]);
    });
  });
});
