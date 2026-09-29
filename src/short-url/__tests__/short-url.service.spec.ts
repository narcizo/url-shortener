import { EntityManager } from "@mikro-orm/postgresql";
import { NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { MIN_ID } from "../base62.js";
import { ShortUrl } from "../short-url.entity.js";
import { ShortUrlService } from "../short-url.service.js";

const LONG_URL = "https://example.com/some/long/path";

describe("ShortUrlService", () => {
  let service: ShortUrlService;
  const em = {
    findOne: vi.fn(),
    create: vi.fn(),
    flush: vi.fn()
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortUrlService,
        { provide: EntityManager, useValue: em },
        {
          provide: ConfigService,
          useValue: { get: () => "http://sho.rt" }
        }
      ]
    }).compile();

    service = module.get(ShortUrlService);
  });

  describe("createShortUrl", () => {
    it("creates a new entry and returns its 7-char code", async () => {
      em.findOne.mockResolvedValue(null);
      em.create.mockImplementation((_, data) =>
        Object.assign(new ShortUrl(), data)
      );
      em.flush.mockImplementation(() => {
        // The DB assigns the id on flush.
        em.create.mock.results[0].value.id = MIN_ID;
      });

      const result = await service.createShortUrl({ longUrl: LONG_URL });

      expect(em.create).toHaveBeenCalledWith(ShortUrl, { longUrl: LONG_URL });
      expect(em.flush).toHaveBeenCalledOnce();
      expect(result).toEqual({
        code: "1000000",
        shortUrl: "http://sho.rt/1000000",
        longUrl: LONG_URL
      });
    });

    it("returns the existing code when the long URL was already shortened", async () => {
      em.findOne.mockResolvedValue(
        Object.assign(new ShortUrl(), { id: MIN_ID + 1, longUrl: LONG_URL })
      );

      const result = await service.createShortUrl({ longUrl: LONG_URL });

      expect(em.create).not.toHaveBeenCalled();
      expect(em.flush).not.toHaveBeenCalled();
      expect(result.code).toBe("1000001");
    });
  });

  describe("getLongUrl", () => {
    it("looks up by the decoded id", async () => {
      em.findOne.mockResolvedValue(
        Object.assign(new ShortUrl(), { id: MIN_ID, longUrl: LONG_URL })
      );

      await expect(service.getLongUrl("1000000")).resolves.toBe(LONG_URL);
      expect(em.findOne).toHaveBeenCalledWith(ShortUrl, { id: MIN_ID });
    });

    it("throws NotFoundException for an unknown code", async () => {
      em.findOne.mockResolvedValue(null);

      await expect(service.getLongUrl("zzzzzzz")).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });
});
