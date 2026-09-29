import { ReflectMetadataProvider } from "@mikro-orm/decorators/legacy";
import { Migrator } from "@mikro-orm/migrations";
import { defineConfig } from "@mikro-orm/postgresql";

import { EnvironmentVariables } from "../config/env.validation.js";
import { ShortUrl } from "../short-url/short-url.entity.js";

type EnvReader = <K extends keyof EnvironmentVariables>(
  key: K
) => EnvironmentVariables[K];

export function createMikroOrmConfig(env: EnvReader) {
  return defineConfig({
    host: env("PSQL_HOST"),
    port: env("PSQL_PORT"),
    user: env("PSQL_USER"),
    password: env("PSQL_PASSWORD"),
    dbName: env("PSQL_DB"),
    entities: [ShortUrl],
    metadataProvider: ReflectMetadataProvider,
    extensions: [Migrator],
    migrations: {
      path: "./dist/migrations",
      pathTs: "./src/migrations"
    }
  });
}
