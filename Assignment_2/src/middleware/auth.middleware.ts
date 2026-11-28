import type { NextFunction, Request, Response } from "express";
import type { Role } from "../utils/global.type";
import { ApiResponse } from "../utils/apiResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/configEnv";
import { pool } from "../config/db";

const authMiddleware = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      if (!header) {
        return res.status(401).json(ApiResponse.error("Unauthorize", 401));
      }
      const token = header.startsWith("Bearer ") ? header.slice(7) : header;
      if (!token) {
        return res
          .status(401)
          .json(ApiResponse.error("Unauthorize access", 401));
      }

      // Decode user
      const decode = jwt.verify(token, config.jwt_secret) as JwtPayload;

      // User search from DB
      const user = await pool.query(` SELECT * FROM users WHERE id=$1 `, [
        decode.id,
      ]);
      if (user.rowCount === 0) {
        return res.status(404).json(ApiResponse.error("User Not Found!!"));
      }

      //Roles = ["attendee", "organizer"] ;
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(403).json(ApiResponse.error("Unauthorize access !!"));
      }
      req.user = {
        id: decode.id,
        role: decode.role,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;
