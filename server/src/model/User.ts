import { Document, Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isMuted: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the user interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  role: string;
  isMuted: boolean;
  isBanned: boolean;
}

// Create the user model
const User = model<IUser>("User", userSchema);

export default User;
