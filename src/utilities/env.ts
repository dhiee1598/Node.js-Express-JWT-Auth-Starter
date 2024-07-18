import "dotenv/config";
import { cleanEnv, num, port, str, url } from "envalid";

const env = cleanEnv(process.env, {
  PORT: port(),
  SERVER_URL: url(),
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  CONNECTION_URI: url(),
  FRONTEND_URL: url(),
  ACCESS_TOKEN_SECRET: str(),
  ACCESS_TOKEN_EXPIRATION: str(),
  REFRESH_TOKEN_SECRET: str(),
  REFRESH_TOKEN_EXPIRATION: str(),
  COOKIE_EXPIRATION_DAYS: num(),
});

export default env;
