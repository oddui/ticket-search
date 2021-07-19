import SpaceTokenizer from "../tokenizer/space-tokenizer";
import TrieIndex from "./trie-index";

describe("TrieIndex", () => {
  const documents = [
    { _id: 1, subject: "A Catastrophe in Korea (North)" },
    { _id: 2, subject: "A Catastrophe in Micronesia" },
    { _id: 3, subject: "A Problem in Morocco" },
    { _id: 4, subject: "A Nuisance in Ghana" },
    { _id: 5, subject: ["Catastrophe", "Korea"] },
    { _id: 6 },
  ];
  let index: TrieIndex;

  beforeEach(() => {
    index = new TrieIndex("subject", new SpaceTokenizer());
    documents.forEach((doc) => index.indexDocument(doc));
  });

  it("uses tokenizer", () => {
    expect(index.search("north korea")).toEqual([1]);
  });

  it("matches full value", () => {
    expect(index.search("Catastrophe")).toEqual([1, 2, 5]);
  });

  it("matches prefix", () => {
    expect(index.search("Catas")).toEqual([1, 2, 5]);
  });

  it("return empty array if search miss", () => {
    expect(index.search("Melbourne")).toEqual([]);
  });

  describe("searches empty fields", () => {
    it("returns objects ids with the field absent", () => {
      expect(index.search("")).toEqual([6]);
    });

    it("returns empty array if no document having the field absent", () => {
      index = new TrieIndex("subject", new SpaceTokenizer());
      expect(index.search("")).toEqual([]);
    });
  });
});
