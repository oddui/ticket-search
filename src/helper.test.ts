import { isArrayOfString, parseDateTime } from "./helper";

describe("helpers", () => {
  describe("parseDateTime()", () => {
    it("parses date time string in the sample data files", () => {
      expect(typeof parseDateTime("2016-04-15T05:19:46 -10:00")).toBe("number");
    });
    it("parses ISO 8601 date time string", () => {
      expect(typeof parseDateTime(new Date().toISOString())).toBe("number");
    });
    it("return `NaN` for invalid date time string", () => {
      expect(parseDateTime("invalid time")).toBe(NaN);
    });
  });

  describe("isArrayOfString()", () => {
    it("returns true for array of string", () => {
      expect(isArrayOfString(["test"])).toBe(true);
    });
    it("returns false for non-arrays", () => {
      expect(isArrayOfString("test")).toBe(false);
    });
    it("returns false for array of non-string items", () => {
      expect(isArrayOfString([1])).toBe(false);
    });
  });
});
