import { Test, TestingModule } from "@nestjs/testing";

import { ShortUrlController } from "../short-url.controller.js";
import { ShortUrlService } from "../short-url.service.js";

describe("ShortUrlController", () => {
  let controller: ShortUrlController;
  const service = { createShortUrl: vi.fn(), getLongUrl: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortUrlController],
      providers: [{ provide: ShortUrlService, useValue: service }]
    }).compile();

    controller = module.get(ShortUrlController);
  });

  it("delegates creation to the service", async () => {
    const response = {
      code: "1000000",
      shortUrl: "http://sho.rt/1000000",
      longUrl: "https://example.com"
    };
    service.createShortUrl.mockResolvedValue(response);

    await expect(
      controller.createShortUrl({ longUrl: "https://example.com" })
    ).resolves.toBe(response);
  });

  it("redirects to the long URL with a 302", async () => {
    service.getLongUrl.mockResolvedValue("https://example.com");

    await expect(controller.redirect({ code: "1000000" })).resolves.toEqual({
      url: "https://example.com",
      statusCode: 302
    });
    expect(service.getLongUrl).toHaveBeenCalledWith("1000000");
  });
});
