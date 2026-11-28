import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse";

const bookEventTicket = (req: Request, res: Response) => {
  try {
    console.log(req.body);
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

export const bookingController = {
  bookEventTicket,
};
