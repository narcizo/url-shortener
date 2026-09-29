import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types.js";

import { AppModule } from "./../src/app.module.js";

describe("App (e2e)", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/health (GET)", async () => {
    const res = await request(app.getHttpServer()).get("/health").expect(200);
    expect(res.body.status).toBe("ok");
  });

  describe("short URLs", () => {
    // Unique per run so dedup doesn't hide a broken insert.
    const longUrl = `https://example.com/e2e/${Date.now()}`;

    it("shortens a URL, dedups it, and redirects to it", async () => {
      const server = app.getHttpServer();

      const created = await request(server)
        .post("/api/v1/data/shorten")
        .send({ longUrl })
        .expect(201);
      expect(created.body.code).toMatch(/^[0-9a-zA-Z]{7}$/);
      expect(created.body.shortUrl).toMatch(
        new RegExp(`/${created.body.code}$`)
      );
      expect(created.body.longUrl).toBe(longUrl);

      const again = await request(server)
        .post("/api/v1/data/shorten")
        .send({ longUrl })
        .expect(201);
      expect(again.body.code).toBe(created.body.code);

      await request(server)
        .get(`/${created.body.code}`)
        .expect(302)
        .expect("Location", longUrl);
    });

    it("rejects invalid long URLs", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/data/shorten")
        .send({ longUrl: "not-a-url" })
        .expect(400);
      await request(app.getHttpServer())
        .post("/api/v1/data/shorten")
        .send({ longUrl: "javascript:alert(1)" })
        .expect(400);
    });

    it("returns 404 for an unknown code", async () => {
      // Below the sequence minimum, so it can never exist.
      await request(app.getHttpServer()).get("/0000000").expect(404);
    });

    it("returns 400 for a malformed code", async () => {
      await request(app.getHttpServer()).get("/abc").expect(400);
    });
  });
});
