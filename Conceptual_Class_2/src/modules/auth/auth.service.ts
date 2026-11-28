import e from "express";
import { pool } from "../../config/db";
import { passwordHelpers } from "../../utils/passwordHelper";
import type { IUser } from "./auth.interface";
import { jwtHelpers } from "../../utils/jwtHelpers";

const register = async (payload: IUser) => {
  const { name, email, password, age, role } = payload;

  const hashedPassword = await passwordHelpers.hashPassword(password);
  console.log(hashedPassword);

  const result = await pool.query(
    `INSERT INTO users(name,email,password,age,role) VALUES
    ($1,$2,$3,$4,COALESCE($5, 'user')) RETURNING *`,
    [name, email, hashedPassword, age, role],
  );
  delete result.rows[0].password;
  return result.rows[0];
};

const login = async (email: string, password: string) => {
  const isUserExists = await pool.query<IUser>(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  const user = isUserExists.rows[0];

  if (!user || !passwordHelpers.compareHash(password, user.password)) {
    const error = new Error("Invalid Email or Password");
    throw error;
  }

  const token = jwtHelpers.generateToken({
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const authService = {
  register,
  login,
};
