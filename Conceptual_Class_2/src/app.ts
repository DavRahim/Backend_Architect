import express, { type Application } from "express";
import authRouter from "./modules/auth/auth.route";
import logger from "./middleware/logger";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(logger);

app.get("/test", (req, res) => {
  //   res.send("Hello world");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});

app.use("/api/v1/auth", authRouter);

export default app;
