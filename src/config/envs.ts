import 'dotenv/config';
import * as joi from 'joi';
interface EnVars {
  PORT: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const enVars: EnVars = value;

export const envs = {
  port: enVars.PORT,
};
