import type { IncomingMessage, ServerResponse } from "http";
import productController from "../controllers/product.controller";

const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url; // product, /about
  const method = req.method;
  // console.log(url, method);

  if (url === "/" && method === "GET") {
    console.log("This root route");
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(JSON.stringify({ message: "This is root Route" }));
  } else if (url?.startsWith("/product")) {
    //  Product -> GET,PUT, POST
    productController(req, res);
  } else {
    res.writeHead(404, {
      "Content-type": "application/json",
    });
    res.end(JSON.stringify({ message: "This route is not defined" }));
  }
};

export default routeHandler;
