import "reflect-metadata";

import { validate } from "./config/env.validation.js";
import { createMikroOrmConfig } from "./database/mikro-orm.options.js";

const env = validate(process.env);

export default createMikroOrmConfig((key) => env[key]);
