import { BigIntType, type Opt } from "@mikro-orm/core";
import {
  Entity,
  Index,
  PrimaryKey,
  Property
} from "@mikro-orm/decorators/legacy";

@Entity()
export class ShortUrl {
  @PrimaryKey({
    type: new BigIntType("number"),
    generated: "by default as identity"
  })
  id!: number;

  @Property({ type: "text" })
  @Index({ type: "hash" })
  longUrl!: string;

  @Property({ type: "datetime", defaultRaw: "now()" })
  createdAt: Opt<Date> = new Date();
}
