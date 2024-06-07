import jwt from "jsonwebtoken";
import { config } from "../config";
import User, { IUser } from "../model/User";

export const generateToken = (user: IUser) => {
  // Generate a JWT token using the _id parameter
  const token = jwt.sign(user, config.JWT_SECRET, { expiresIn: "8h" });
  return token;
};

export const verifyTokenSocket = async (
  token: string,
  callback: (err: any, decoded?: any) => void
) => {
  if (!token) {
    return callback(new Error("Authentication error"));
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    if (typeof payload === "string" || !("_id" in payload)) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw new Error("The user not found");
    }
    if (user.isBanned) {
      throw new Error("The user has been banned");
    }

    callback(null, user.toJSON());
  } catch (err) {
    callback(err);
  }
};
