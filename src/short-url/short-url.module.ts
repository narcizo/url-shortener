import { Module } from "@nestjs/common";

import { ShortUrlController } from "./short-url.controller.js";
import { ShortUrlService } from "./short-url.service.js";

@Module({
  controllers: [ShortUrlController],
  providers: [ShortUrlService]
})
export class ShortUrlModule {}
