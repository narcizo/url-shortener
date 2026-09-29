import { plainToInstance } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync
} from "class-validator";

export class EnvironmentVariables {
  @IsInt()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  APP_BASE_URL: string;

  @IsString()
  PSQL_USER: string;

  @IsString()
  PSQL_PASSWORD: string;

  @IsString()
  PSQL_DB: string;

  @IsString()
  PSQL_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  PSQL_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  validated.APP_BASE_URL = (
    validated.APP_BASE_URL ?? `http://localhost:${validated.APP_PORT}`
  ).replace(/\/+$/, "");
  return validated;
}
