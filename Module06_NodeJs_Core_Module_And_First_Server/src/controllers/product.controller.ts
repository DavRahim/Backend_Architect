import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productsService } from "../services/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  // products ->GET, POST,PUT

  const url = req.url;
  const method = req.method;
  console.log(url, method);
  const urlParams = url?.split("/");
  //   console.log(urlParams);["", "products", "/"]

  const id =
    urlParams && urlParams[1] === "product" ? Number(urlParams[2]) : null;
  // Get all Product
  if (url === "/products" && method === "GET") {
    const products = productsService();
    try {
      sendResponse(res, true, 200, "Product recvied Successfuly", products);
    } catch (error) {
      sendResponse(res, false, 404, "Internal server Error");
    }
  } else if (method === "GET" && id !== null) {
    const products = productsService();
    const product = products.find((p: IProduct) => p.id === id);
    if (!product) {
      sendResponse(res, false, 404, "product not found");
    }

    try {
      sendResponse(res, true, 200, "Product recvied Successfuly", product);
    } catch (error) {
      sendResponse(res, false, 404, "Internal server Error");
    }
  } else if (url === "/product" && method === "POST") {
    const body = await bodyParser(req);
    // console.log(body);

    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);

    const products = productsService();

    products.push(newProduct);

    createProduct(products);
    res.writeHead(201, {
      "Content-type": "application/json",
    });
    res.end(
      JSON.stringify({
        data: newProduct,
        message: "This is product Route",
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await bodyParser(req);
    const products = productsService();

    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, {
        "Content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          //   data: newProduct,
          message: "This is Not found product",
        }),
      );
    }
    // console.log(products[index], "dfs");
    products[index] = { id: products[index].id, ...body };
    createProduct(products);
    res.writeHead(201, {
      "Content-type": "application/json",
    });
    res.end(
      JSON.stringify({
        data: products[index],
        message: "product Update Successfully",
      }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = productsService();
    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, {
        "Content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          //   data: newProduct,
          message: "This is Not found product",
        }),
      );
    }

    products.splice(index, 1);
    createProduct(products);
    res.writeHead(201, {
      "Content-type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "product Delete Successfully",
      }),
    );
  }
};

export default productController;
