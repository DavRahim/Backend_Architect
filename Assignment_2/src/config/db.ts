import { Pool } from "pg";
import config from "./configEnv";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'attendee'
          CHECK (role IN ('attendee', 'organizer')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        date TIMESTAMP NOT NULL,
        location VARCHAR(255) NOT NULL,
        total_seats INT NOT NULL CHECK (total_seats > 0),
        available_seats INT NOT NULL,
        price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
        organizer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT chk_available_seats
          CHECK (available_seats >= 0 AND available_seats <= total_seats)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        attendee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tickets_booked INT NOT NULL CHECK (tickets_booked > 0),
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
        status VARCHAR(20) NOT NULL DEFAULT 'confirmed'
          CHECK (status IN ('confirmed', 'cancelled')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    console.log("Database Crate Successfully!!");
  } catch (error) {
    console.log(error);
  }
};
