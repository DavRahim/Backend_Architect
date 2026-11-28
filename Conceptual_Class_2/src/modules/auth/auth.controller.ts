import type { RequestHandler } from "express";
import sendResponse from "../../utils/senResponse";
import { authService } from "./auth.service";

const register: RequestHandler = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Register Successfully",
      data: user,
    });
    console.log(user);
  } catch (error: unknown) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Logged in Successfully",
      data: { user, token },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const authController = {
  register,
  login,
};
