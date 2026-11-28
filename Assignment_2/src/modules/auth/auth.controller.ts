import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { ApiResponse } from "../../utils/apiResponse";

const singUp = async (req: Request, res: Response) => {
  try {
    const user = await authService.signupUserIntroDB(req.body);
    res
      .status(201)
      .json(ApiResponse.success(user, "User registered successfully"));
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { jwtPayload: user, token } = await authService.loginUserIntroDB(
      req.body,
    );
    res
      .status(200)
      .json(ApiResponse.success({ token, user }, "Login successful"));
    console.log(user);
  } catch (error: any) {
    res.status(500).json(ApiResponse.error(error?.message, 500));
  }
};

export const authController = {
  singUp,
  login,
};
