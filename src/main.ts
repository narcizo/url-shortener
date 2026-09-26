import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { EnvironmentVariables } from "./config/env.validation.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const config =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  await app.listen(config.get("APP_PORT", { infer: true }));
}
await bootstrap();
