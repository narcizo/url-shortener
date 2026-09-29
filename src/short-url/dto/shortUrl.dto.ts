import { IsUrl, Matches, MaxLength } from "class-validator";

import { SHORT_CODE_PATTERN } from "../base62.js";

export class CreateShortUrlRequest {
  @IsUrl({ require_protocol: true, protocols: ["http", "https"] })
  @MaxLength(2048)
  longUrl: string;
}

export type CreateShortUrlResponse = {
  code: string;
  shortUrl: string;
  longUrl: string;
};

export class ShortCodeParams {
  @Matches(SHORT_CODE_PATTERN, {
    message: "code must be 7 base62 characters"
  })
  code: string;
}
