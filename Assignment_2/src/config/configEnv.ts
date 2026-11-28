import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires_in: (process.env.JWT_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"],
};

export default config;
