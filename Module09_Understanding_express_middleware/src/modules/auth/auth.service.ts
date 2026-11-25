import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
  if (!user.rows[0].is_Active) {
    throw new Error("Access deny ,Account hasn't add");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToke = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
    expiresIn: "10d",
  });

  delete user.rows[0].password;
  return { accessToke, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access!!");
  }

  const decode = jwt.verify(
    token as string,
    config.refresh_secret,
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
    throw new Error("User Not found");
  }
  if (!user.rows[0].is_active) {
    throw new Error("Forbidden !!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntroDB,
  generateAccessToken,
};
