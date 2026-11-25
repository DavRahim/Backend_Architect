import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(roles);
      // check if the token exist
      //   token verify
      //    check if the user exists
      //   Is the user status active

      //   console.log("this is procted routed");
      //   console.log(req.headers.authorization);

      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorize access",
        });
      }

      const decode = jwt.verify(
        token as string,
        config.jwt_secret,
      ) as JwtPayload;
      // console.log(decode);

      const user = await pool.query(
        `
    SELECT * FROM users WHERE email=$1
    `,
        [decode.email],
      );

      // console.log(user.rows[0]);
      if (user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not found",
        });
      }
      if (!user.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "Forbidden !!",
        });
      }
      //   console.log(req); req: {body: "", user: ""}

      //Roles = ["admin", "agent", "user"] ;
      // user.role = "admin",
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorize access !!",
        });
      }

      req.user = decode;
      //   console.log(req);

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
