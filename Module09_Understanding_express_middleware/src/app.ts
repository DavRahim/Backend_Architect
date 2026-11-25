import fs from "fs";
import express, { type Application } from "express";
import { UserRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();

const corsOption = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Express Middleware
app.use(cors(corsOption));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
app.use(logger);
app.use(cookieParser());

app.get("/test", (req, res) => {
  //   res.send("Hello world");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "PH",
  });
});

// User API
app.use("/api/v1/users", UserRoute);
// profile API
app.use("/api/v1/profiles", profileRoute);
//Auth API
app.use("/api/v1/auth", authRoute);

// Global Error Handling Middleware;
app.use(globalErrorHandler);
export default app;
