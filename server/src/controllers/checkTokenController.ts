import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkTokenController = (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);

  if (payload) {
    return res.status(200).json({ message: "Token is valid", user: payload });
  } else {
    return res.status(401).json({ message: "Invalid token" });
  }
};
