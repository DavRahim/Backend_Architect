import { createServer } from "http";
import routeHandler from "./routes/route1";

const server = createServer((req, res) => {
  console.log(req.url);

  routeHandler(req, res);
});

server.listen(3000, () => {
  console.log(" server is running successfully");
});
