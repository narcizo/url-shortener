import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity()
export class ShortUrl {
  @PrimaryKey()
  shortUrl!: string;

  @Property()
  longUrl!: string;
}
