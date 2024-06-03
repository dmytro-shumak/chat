import jwt from "jsonwebtoken";
import { IUser } from "../model/User";

export const generateToken = (user: IUser) => {
  // Generate a JWT token using the _id parameter
  const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  return token;
};

export const verifyTokenSocket = (token: string, callback: (err: any, decoded?: any) => void) => {
  if (!token) return callback(new Error("Authentication error"));

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    callback(null, verified);
  } catch (err) {
    callback(err);
  }
};
