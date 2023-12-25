import dotenv from "dotenv";
import { cleanEnv, str, port, bool } from 'envalid'

dotenv.config({
  path: `.env`,
});


const env = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  SERVICE_NAME: str(),
  JWT_SECRET: str(),
  LOG_FORMAT: str(),
  ORIGIN: str(),
  CREDENTIALS: bool(),

  PGADMIN_PORT: port(),
  PGADMIN_DEFAULT_EMAIL: str(),
  PGADMIN_DEFAULT_PASSWORD: str(),

  POSTGRES_PORT: port(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_USER: str(),

  DATABASE_URL: str(),
});

export const PORT = env.PORT;
export const ENV = env.NODE_ENV;
export const SERVICE_NAME = env.SERVICE_NAME;
export const JWT_SECRET = env.JWT_SECRET;
export const LOG_FORMAT = env.LOG_FORMAT;
export const ORIGIN = env.ORIGIN;
export const CREDENTIALS = env.CREDENTIALS;

export const PGADMIN_PORT = env.PGADMIN_PORT;
export const PGADMIN_DEFAULT_EMAIL = env.PGADMIN_DEFAULT_EMAIL;
export const PGADMIN_DEFAULT_PASSWORD = env.PGADMIN_DEFAULT_PASSWORD;

export const POSTGRES_PORT = env.POSTGRES_PORT;
export const POSTGRES_PASSWORD = env.POSTGRES_PASSWORD;
export const POSTGRES_USER = env.POSTGRES_USER;

export const DATABASE_URL = env.DATABASE_URL;
