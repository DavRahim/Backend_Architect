import { IncomingMessage, ServerResponse } from "http";
import bookController from "../controllers/book.controller";

const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    console.log("Is's a Root Routes");
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(JSON.stringify({ message: "It's a Root Route Bro!!!!" }));
  } else if (url?.startsWith("/book")) {
    console.log("Book Route is Running Bro!!");
    bookController(req, res);
  }

  console.log(url, method);
};

export default routeHandler;
