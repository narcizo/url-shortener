import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";

import {
  CreateShortUrlRequest,
  type CreateShortUrlResponse,
  GetShortUrlRequest,
  GetShortUrlResponse
} from "./dto/shortUrl.dto.js";
import { ShortUrlService } from "./short-url.service.js";

@Controller("short-url")
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post()
  async createShortUrl(
    @Body() body: CreateShortUrlRequest
  ): Promise<CreateShortUrlResponse> {
    const response = await this.shortUrlService.createShortUrl(body);

    return response;
  }

  @Get(":shortUrl")
  @HttpCode(302) //redirected
  async getLongUrl(
    @Param() param: GetShortUrlRequest
  ): Promise<GetShortUrlResponse> {
    const { shortUrl } = param;
    const response = await this.shortUrlService.getShorUrl({ shortUrl });

    return response;
  }
}
