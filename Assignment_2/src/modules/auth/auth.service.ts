import config from "../../config/configEnv";
import { pool } from "../../config/db";
import { passwordHelpers } from "../../utils/passwordHelpers";
import type { IUser } from "./auth.interface";
import jwt, { type SignOptions } from "jsonwebtoken";
const options: SignOptions = {
  expiresIn: "7d",
};
const signupUserIntroDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashedPassword = await passwordHelpers.hashPassword(password);

  const result = await pool.query(
    `
    INSERT INTO users (name,email,password,role) VALUES($1,$2,$3,COALESCE($4, 'attendee')) RETURNING *
    `,
    [name, email, hashedPassword, role],
  );
  delete result.rows[0].password;
  return result.rows[0];
};

const loginUserIntroDB = async (payload: {
  email: string;
  password: string;
}) => {
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
  const matchPassword = await passwordHelpers.compareHash(
    password,
    user.rows[0].password,
  );
  if (!matchPassword) {
    throw new Error("Invalid Credential");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };
  delete user.rows[0].password;
  const token = jwt.sign(jwtPayload, config.jwt_secret, options);
  return { token, jwtPayload };
};

export const authService = {
  signupUserIntroDB,
  loginUserIntroDB,
};
