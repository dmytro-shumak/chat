import { post } from "./axios";

export interface LoginResponse {
  token: string;
  message: string;
}

export async function loginUser(username: string, password: string) {
  const data = await post<LoginResponse>("/auth/login", { username, password });
  return data;
}
