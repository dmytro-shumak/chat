import { LoginResponse } from "../types/auth";
import { post } from "./axios";

export async function loginUser(username: string, password: string) {
  const data = await post<LoginResponse>("/auth/login", { username, password });
  return data;
}
