import { ReflectMetadataProvider } from "@mikro-orm/decorators/legacy";
import { defineConfig } from "@mikro-orm/postgresql";

export default defineConfig({
  dbName: process.env.PSQL_DB ?? "urlShortener-nest",
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  metadataProvider: ReflectMetadataProvider
});
