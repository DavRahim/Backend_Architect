import { createServer } from "http";
import routeHandler from "./routes/route";
import config from "./config";

const server = createServer((req, res) => {
  //   console.log("Request", req);
  console.log("Response", req.url);
  console.log("Response", req.method);
  routeHandler(req, res);
});

server.listen(config.port, () => {
  console.log("server is running successfully");
});
