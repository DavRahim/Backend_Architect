import pg from "pg";
import config from ".";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.connection_string,
});
