import fs from "fs";
import path from "path";
import { TBook } from "../../types/book";

const filePath = path.join(process.cwd(), "./src/database/db.json");
export const booksService = () => {
  const result = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(result);
};

export const createBook = (payload: TBook[]) => {
  fs.writeFileSync(filePath, JSON.stringify(payload));
};
