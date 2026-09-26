import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { validate } from "./config/env.validation.js";
import config from "./mikro-orm.config.js";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MikroOrmModule.forRoot(config)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
