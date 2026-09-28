import { IsNotEmpty, IsUrl, MaxLength } from "class-validator";

export class CreateShortUrlRequest {
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  longUrl: string;
}

export type CreateShortUrlResponse = {
  shortUrl: string;
};

export class GetShortUrlRequest {
  @IsNotEmpty()
  shortUrl: string;
}

export type GetShortUrlResponse = {
  longUrl: string;
};
