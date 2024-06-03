import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if the token is present in the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Perform token verification logic here
  try {
    // Verify the token and extract the payload
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);

    if (payload) {
      // Call the next middleware or route handler
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
