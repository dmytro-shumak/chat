import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const stringValidator = z.string().min(1);

export const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: stringValidator.parse(process.env.JWT_SECRET),
  MONGO_URI: stringValidator.parse(process.env.MONGO_URI),
};
