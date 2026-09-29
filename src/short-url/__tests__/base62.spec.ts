import {
  decodeBase62,
  encodeBase62,
  MAX_ID,
  MIN_ID,
  SHORT_CODE_LENGTH,
  SHORT_CODE_PATTERN
} from "../base62.js";

describe("base62", () => {
  it("encodes the sequence bounds to the smallest and largest 7-char codes", () => {
    expect(encodeBase62(MIN_ID)).toBe("1000000");
    expect(encodeBase62(MAX_ID)).toBe("ZZZZZZZ");
  });

  it("keeps every id in range at exactly 7 chars", () => {
    for (const id of [MIN_ID, MIN_ID + 1, 1e12, 2_000_000_000_000, MAX_ID]) {
      const code = encodeBase62(id);
      expect(code).toHaveLength(SHORT_CODE_LENGTH);
      expect(code).toMatch(SHORT_CODE_PATTERN);
    }
  });

  it("round-trips encode/decode", () => {
    for (const id of [
      0,
      1,
      61,
      62,
      12_345,
      MIN_ID,
      1_234_567_890_123,
      MAX_ID
    ]) {
      expect(decodeBase62(encodeBase62(id))).toBe(id);
    }
  });

  it("rejects invalid input", () => {
    expect(() => encodeBase62(-1)).toThrow(RangeError);
    expect(() => encodeBase62(1.5)).toThrow(RangeError);
    expect(() => decodeBase62("abc-123")).toThrow(RangeError);
  });
});
