import { z } from "zod";

const stringValidator = z.string().min(1);

export const config = {
  BACKEND_URL: stringValidator.parse(import.meta.env.VITE_BACKEND_URL),
};
