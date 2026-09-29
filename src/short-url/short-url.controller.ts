import { Body, Controller, Get, Param, Post, Redirect } from "@nestjs/common";

import {
  CreateShortUrlRequest,
  type CreateShortUrlResponse,
  ShortCodeParams
} from "./dto/shortUrl.dto.js";
import { ShortUrlService } from "./short-url.service.js";

@Controller()
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post("api/v1/data/shorten")
  createShortUrl(
    @Body() body: CreateShortUrlRequest
  ): Promise<CreateShortUrlResponse> {
    return this.shortUrlService.createShortUrl(body);
  }

  @Get(":code")
  @Redirect()
  async redirect(@Param() { code }: ShortCodeParams) {
    const url = await this.shortUrlService.getLongUrl(code);
    return { url, statusCode: 302 };
  }
}
