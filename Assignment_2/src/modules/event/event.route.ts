import { Router } from "express";
import { eventController } from "./event.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { USER_ROLE } from "../../utils/global.type";

export const eventRouter = Router();

eventRouter.post(
  "/",
  authMiddleware(USER_ROLE.organizer),
  eventController.createEvent,
);

eventRouter.get("/", eventController.getAllEvents);
eventRouter.get("/:id", eventController.getSingleEvent);
eventRouter.patch(
  "/:id",
  authMiddleware(USER_ROLE.organizer),
  eventController.updateEvent,
);
eventRouter.delete(
  "/:id",
  authMiddleware(USER_ROLE.organizer),
  eventController.deleteEvent,
);
