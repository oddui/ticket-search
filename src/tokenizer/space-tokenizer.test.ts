import SpaceTokenizer from "./space-tokenizer";

describe("SpaceTokenizer", () => {
  let tokenizer: SpaceTokenizer;

  beforeEach(() => (tokenizer = new SpaceTokenizer()));

  it("converts input into lower case", () => {
    expect(tokenizer.tokenize("Test")).toEqual(["test"]);
  });

  it("breaks input by white spaces", () => {
    expect(tokenizer.tokenize("Test me     \tnow")).toEqual([
      "test",
      "me",
      "now",
    ]);
  });

  it("removes surrounding brackets", () => {
    expect(tokenizer.tokenize("Test (me)")).toEqual(["test", "me"]);
  });
});
