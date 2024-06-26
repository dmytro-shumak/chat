import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../model/User";
import { generateToken } from "../utils/jwtUtils";

export const authController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Check if the username is at least 3 characters long
  if (username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters long." });
  }

  // Check if the username contains any special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(username)) {
    return res.status(400).json({ error: "Username can only contain letters and numbers." });
  }

  try {
    // Check if the user exists in MongoDB
    let user = await User.findOne({ username });
    if (!user) {
      // User does not exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10);

      let role = "user";
      const userCount = await User.countDocuments();
      if (!userCount) {
        role = "admin";
      }

      // Generate JWT token
      user = new User({ username, password: hashedPassword, role });
      await user.save();

      const token = generateToken(user.toJSON());
      return res.status(200).json({ message: "Login successful", token, user: user.toJSON() });
    }

    if (user.isBanned) {
      return res.status(401).json({ message: "You are banned" });
    }

    // Perform login
    if (await bcrypt.compare(password, user.password)) {
      // Successful login
      const token = generateToken(user.toJSON());
      return res.status(200).json({ message: "Login successful", token, user: user.toJSON() });
    }
    // Invalid password
    return res.status(401).json({ message: "Invalid password" });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};
