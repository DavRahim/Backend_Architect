import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";

const createEvent = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

export const eventController = {
  createEvent,
};
