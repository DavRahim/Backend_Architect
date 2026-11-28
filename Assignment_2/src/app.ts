import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";
import { eventRouter } from "./modules/event/event.route";
import { bookingRouter } from "./modules/booking/booking.route";

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
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

export default app;
