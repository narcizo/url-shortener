const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

export const SHORT_CODE_LENGTH = 7;
export const SHORT_CODE_PATTERN = new RegExp(
  `^[0-9a-zA-Z]{${SHORT_CODE_LENGTH}}$`
);

// IDs in [62^6, 62^7 - 1] always encode to exactly 7 chars ("1000000".."ZZZZZZZ").
// The DB sequence is bounded to this range (see migrations).
export const MIN_ID = BASE ** (SHORT_CODE_LENGTH - 1);
export const MAX_ID = BASE ** SHORT_CODE_LENGTH - 1;

export function encodeBase62(id: number): string {
  if (!Number.isSafeInteger(id) || id < 0) {
    throw new RangeError(`Cannot encode ${id} to base62`);
  }
  if (id === 0) return ALPHABET[0];

  let code = "";
  for (let n = id; n > 0; n = Math.floor(n / BASE)) {
    code = ALPHABET[n % BASE] + code;
  }
  return code;
}

export function decodeBase62(code: string): number {
  let id = 0;
  for (const char of code) {
    const digit = ALPHABET.indexOf(char);
    if (digit === -1) {
      throw new RangeError(`Invalid base62 character "${char}"`);
    }
    id = id * BASE + digit;
  }
  return id;
}
