import { Router } from "express";
import { bookingController } from "./booking.controller";

export const bookingRouter = Router();

bookingRouter.post("/", bookingController.bookEventTicket);
