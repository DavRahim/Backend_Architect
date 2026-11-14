import { IncomingMessage, ServerResponse } from "http";
import { booksService, createBook } from "../services/books.service";
import { sendResponse } from "../utils/sendResponse";
import { TBook } from "../../types/book";
import { bodyParser } from "../utils/parseBody";

const bookController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split("/");

  const id = urlParams && urlParams[1] === "book" ? Number(urlParams[2]) : null;
  console.log(id);

  if (url === "/book" && method === "GET") {
    const books = booksService();
    try {
      if (books) {
        sendResponse(res, true, 200, "Books Found Successfully", books);
      }
    } catch (error) {
      sendResponse(res, true, 404, "Books Not Found Successfully");
    }
  } else if (method === "GET" && id !== null) {
    const books = booksService();
    const book = books.find((b: TBook) => b.id === id);
    if (!book) {
      sendResponse(res, true, 400, "Books Not Found");
    }
    try {
      sendResponse(res, true, 200, "Book Found Successfully", book);
    } catch (error) {
      sendResponse(res, true, 404, "Internal Server error");
    }
  } else if (url === "book" && method === "POST") {
    const body = await bodyParser(req);
    const newBook = {
      id: Date.now(),
      ...body,
    };
    const books = booksService();
    books.push(newBook);
    createBook(books);
    sendResponse(res, true, 201, "Book Crate Successfully", newBook);
  }
};

export default bookController;
