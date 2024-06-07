import { Dispatch, SetStateAction } from "react";
import { IUser } from "./user";

export interface LoginResponse {
  token: string;
  message: string;
  user: IUser;
}

export interface AuthContextProps {
  token: string | null;
  user: IUser | null;
  loginAction: (username: string, password: string) => Promise<LoginResponse | undefined>;
  checkToken: () => Promise<LoginResponse | undefined>;
  disconnectUser: (removeTokenFromLocalStorage?: boolean) => void;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}
