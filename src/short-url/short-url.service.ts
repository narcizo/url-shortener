import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { crc32 } from "crc";

import {
  CreateShortUrlRequest,
  CreateShortUrlResponse,
  GetShortUrlRequest,
  GetShortUrlResponse
} from "./dto/shortUrl.dto.js";
import { ShortUrl } from "./short-url.entity.js";

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectRepository(ShortUrl)
    private readonly shortUrlRepository: EntityRepository<ShortUrl>,
    private readonly em: EntityManager
  ) {}

  async createShortUrl({
    longUrl
  }: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
    const shortUrl = this.createHash(longUrl);

    const existing = await this.shortUrlRepository.findOne({ shortUrl });

    if (existing) {
      const newUrl = this.createShortUrl({
        longUrl: shortUrl + "different string"
      });
      return newUrl;
    }

    this.shortUrlRepository.create({ shortUrl, longUrl });
    await this.em.flush();

    return { shortUrl };
  }

  async getShorUrl({
    shortUrl
  }: GetShortUrlRequest): Promise<GetShortUrlResponse> {
    const entity = await this.shortUrlRepository.findOneOrFail({ shortUrl });
    return { longUrl: entity.longUrl };
  }

  private createHash(longUrl: string): string {
    return crc32(longUrl).toString(16);
  }
}
