import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";

export const checkTokenController = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof payload === "string" || !("_id" in payload)) {
      return res.status(200).json({ message: "Invalid token", user: payload });
    }

    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isBanned) {
      return res.status(401).json({ message: "The user has been banned" });
    }

    if (payload) {
      return res.status(200).json({ message: "Invalid token", user });
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
