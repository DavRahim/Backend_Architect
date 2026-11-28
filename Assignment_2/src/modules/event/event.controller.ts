import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { eventService } from "./event.service";
import type { JwtPayload } from "jsonwebtoken";

const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { id } = req.user;
    const event = await eventService.createEventIntroDB(req.body, id);
    res
      .status(201)
      .json(ApiResponse.success(event, "Event created successfully"));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

const getAllEvents = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const events = await eventService.getAllEventsFromDB(search as string);
    res
      .status(200)
      .json(ApiResponse.success(events, "Events retrieved successfully"));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

const getSingleEvent = async (req: Request, res: Response) => {
  try {
    const event = await eventService.getSingleEventFromDB(
      req.params.id as string,
    );
    res
      .status(200)
      .json(ApiResponse.success(event, "Event retrieved successfully"));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};
const updateEvent = async (req: Request, res: Response) => {
  try {
    const UpdateEvent = await eventService.updateEventFromDB(
      req.params.id as string,
      req.body,
      req.user!,
    );

    res
      .status(200)
      .json(ApiResponse.success(UpdateEvent, "Event updated successfully"));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    await eventService.deleteEventFromDB(req.params.id as string, req.user!);
    res.status(200).json(ApiResponse.success("Event deleted successfully"));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

export const eventController = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
