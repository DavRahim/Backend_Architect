import { pool } from "./db";

const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_active BOOLEAN DEFAULT true,
        role VARCHAR(20) DEFAULT 'user',

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()

        )
        `;

export const initDatabase = async () => {
  await pool.query(createTableQuery);
  console.log("Database Table created");
};
