import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  //   console.log(req.body);
  try {
    const result = await userService.createUserIntroDB(req.body);
    // console.log(result);
    res.status(201).json({
      success: true,
      message: "User created!!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserFromDB();

    // console.log(result);

    res.status(200).json({
      success: true,
      message: "Users Received successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const result = await userService.getSingleUserFromDb(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    }
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "User Received successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await userService.updateUserFromDB(req.body, id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserFromDB(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  UpdateUser,
  deleteUser,
};
