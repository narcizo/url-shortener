import { Migration } from '@mikro-orm/migrations';

export class Migration20260927181251 extends Migration {

  override name = 'Migration20260927181251';

  override up(): void | Promise<void> {
    this.addSql(`create table "short_url" ("short_url" varchar(255) not null, "long_url" varchar(255) not null, primary key ("short_url"));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "short_url" cascade;`);
  }

}
