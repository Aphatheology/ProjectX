import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

enum DBTypeEnum {
  MYSQL       = "mysql",
  POSTGRES    = "postgres",
  MSSQL       = "mssql",
}

interface EnvVars {
  NODE_ENV: string;
  PORT: string;
  DB_TYPE: DBTypeEnum;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRE_IN_MINUTE: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRE_IN_MINUTE: string;
  CLIENT_URL: string;
  SERVER_URL: string;
}

const envVarsSchema = Joi.object<EnvVars>({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.string().default('4000'),
  DB_TYPE: Joi.string().valid(...Object.values(DBTypeEnum)).required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRE_IN_MINUTE: Joi.number().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRE_IN_MINUTE: Joi.number().required(),
  CLIENT_URL: Joi.string().uri().required(),
  SERVER_URL: Joi.string().uri().required(),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    accessTokenSecret: envVars.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpireInMinute: envVars.JWT_ACCESS_TOKEN_EXPIRE_IN_MINUTE,
    refreshTokenExpireInMinute: envVars.JWT_REFRESH_TOKEN_EXPIRE_IN_MINUTE,
    refreshTokenSecret: envVars.JWT_REFRESH_TOKEN_SECRET,
  },
  db: {
    type: envVars.DB_TYPE,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
  },
  client: {
    url: envVars.CLIENT_URL,
  },
  server: {
    url: envVars.SERVER_URL,
  },
};

export default config;
