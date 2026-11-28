import app from "./app";
import config from "./config";
import { pool } from "./config/db";
import { initDatabase } from "./config/initDb";

const startServer = async () => {
  try {
    const time = await pool.query("SELECT NOW()");
    console.log("Database connected successfully on: ", time.rows[0].now);

    await initDatabase();

    app.listen(config.port, () => {
      console.log(`Server Listening on PORT: ${config.port} `);
    });
  } catch (error: any) {
    console.error("Failed to connect", error);
    process.exit(1);
  }
};

startServer();
