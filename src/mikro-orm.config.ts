import { ReflectMetadataProvider } from "@mikro-orm/decorators/legacy";
import { defineConfig } from "@mikro-orm/postgresql";

export default defineConfig({
  host: process.env.PSQL_HOST,
  port: Number(process.env.PSQL_PORT ?? 5432),
  dbName: process.env.PSQL_DB ?? "urlShortener-nest",
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  metadataProvider: ReflectMetadataProvider
});
