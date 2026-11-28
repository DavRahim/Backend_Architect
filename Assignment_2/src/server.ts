import app from "./app";
import config from "./config/configEnv";
import { initDatabase } from "./config/db";

const main = async () => {
  await initDatabase();
  app.listen(config.port, () => {
    console.log(`Event & Ticket Booking Platform App On Port: ${config.port}`);
  });
};

main();
