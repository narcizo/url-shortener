import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EnvironmentVariables } from "../config/env.validation.js";
import { decodeBase62, encodeBase62 } from "./base62.js";
import {
  CreateShortUrlRequest,
  CreateShortUrlResponse
} from "./dto/shortUrl.dto.js";
import { ShortUrl } from "./short-url.entity.js";

@Injectable()
export class ShortUrlService {
  constructor(
    private readonly em: EntityManager,
    private readonly config: ConfigService<EnvironmentVariables, true>
  ) {}

  async createShortUrl({
    longUrl
  }: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
    const existing = await this.em.findOne(ShortUrl, { longUrl });
    if (existing) return this.toResponse(existing);

    const shortUrl = this.em.create(ShortUrl, { longUrl });
    await this.em.flush();

    return this.toResponse(shortUrl);
  }

  async getLongUrl(code: string): Promise<string> {
    const shortUrl = await this.em.findOne(ShortUrl, {
      id: decodeBase62(code)
    });
    if (!shortUrl) throw new NotFoundException(`Short URL ${code} not found`);

    return shortUrl.longUrl;
  }

  private toResponse({ id, longUrl }: ShortUrl): CreateShortUrlResponse {
    const code = encodeBase62(id);
    const baseUrl = this.config.get("APP_BASE_URL", { infer: true });

    return { code, shortUrl: `${baseUrl}/${code}`, longUrl };
  }
}
