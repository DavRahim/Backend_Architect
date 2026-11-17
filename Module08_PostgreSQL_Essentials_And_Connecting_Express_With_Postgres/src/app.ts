import express, { type Application } from "express";
import { UserRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

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

export default app;
