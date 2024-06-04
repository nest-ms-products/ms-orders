import 'dotenv/config';
import * as joi from 'joi';
interface EnVars {
  PORT: number;
  MS_PRODUCTS_HOST: string;
  MS_PRODUCTS_PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    MS_PRODUCTS_HOST: joi.string().required(),
    MS_PRODUCTS_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const enVars: EnVars = value;

export const envs = {
  port: enVars.PORT,
  msProductsHost: enVars.MS_PRODUCTS_HOST,
  msProductsPort: enVars.MS_PRODUCTS_PORT,
  databaseUrl: enVars.DATABASE_URL,
  natsServers: enVars.NATS_SERVERS,
};
