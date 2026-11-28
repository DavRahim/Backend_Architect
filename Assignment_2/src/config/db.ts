import { Pool } from "pg";
import config from "./configEnv";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDatabase = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'attendee',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);

    console.log("Database Crate Successfully!!");
  } catch (error) {
    console.log(error);
  }
};
