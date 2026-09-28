import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { ShortUrlController } from "./short-url.controller.js";
import { ShortUrl } from "./short-url.entity.js";
import { ShortUrlService } from "./short-url.service.js";

@Module({
  imports: [MikroOrmModule.forFeature([ShortUrl])],
  controllers: [ShortUrlController],
  providers: [ShortUrlService]
})
export class ShortUrlModule {}
