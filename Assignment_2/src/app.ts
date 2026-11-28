import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "this is root route, Event & Ticket Booking Platform",
  });
});

// Auth Route
app.use("/api/v1/auth", authRouter);

export default app;
