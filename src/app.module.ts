import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Module, OnModuleInit, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";

import { EnvironmentVariables, validate } from "./config/env.validation.js";
import { createMikroOrmConfig } from "./database/mikro-orm.options.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) =>
        createMikroOrmConfig((key) => config.get(key, { infer: true }))
    }),
    HealthModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    }
  ]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.connect();
  }
}
