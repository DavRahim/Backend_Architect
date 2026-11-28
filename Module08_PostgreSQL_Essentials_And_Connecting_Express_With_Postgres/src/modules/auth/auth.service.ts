import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntroDB = async (payload: {
  email: string;
  password: string;
}) => {
  //  Check if the user exist,
  // check the password match
  // Check the user status
  // If pass al then generate jwt token

  const { email, password } = payload;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  if (user.rowCount === 0) {
    throw new Error("Invalid Credential");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!matchPassword) {
    throw new Error("Invalid Credential");
  }
  if (!user.rows[0].is_active) {
    throw new Error("Access dyenied ,Account hassen add");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
  };

  const accessToke = jwt.sign(jwtPayload, config.jwt_scect, {
    expiresIn: "1d",
  });

  delete user.rows[0].password;
  return { accessToke, user: user.rows[0] };
};

export const authService = {
  loginUserIntroDB,
};
