import fs from "fs";
import type { NextFunction, Request, Response } from "express";

const logger = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("Time:", Date.now());
  // console.log(req.method, req.url, "req.url");

  const log = `\nMethod : ${req.method} | URL: ${req.url} | Time: ${Date.now()}\n`;
  fs.appendFile("logger.txt", log, (err) => {
    console.log(log);
  });
  next();
};

export default logger;
