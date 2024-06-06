import { FC, PropsWithChildren, createContext, useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { post } from "../../api/axios";
import { IUser } from "../../types/user";

interface AuthContextProps {
  token: string | null;
  user: IUser | null;
  loginAction: (username: string, password: string) => Promise<LoginResponse | undefined>;
  checkToken: () => Promise<LoginResponse | undefined>;
  resetToken: (removeTokenFromLocalStorage?: boolean) => void;
}

export interface LoginResponse {
  token: string;
  message: string;
  user: IUser;
}

export const AuthContext = createContext<AuthContextProps>(null!);

const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || "");
  const [user, setUser] = useState<IUser | null>(null);

  const navigate = useNavigate();
  const isUserDisconnected = useRef(false);

  const loginAction = async (username: string, password: string) => {
    try {
      const data = await post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      if (data) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);

        isUserDisconnected.current = false;
        navigate("/chat");

        return data;
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const checkToken = useCallback(async () => {
    if (!token || isUserDisconnected.current) {
      return;
    }

    try {
      const data = await post<LoginResponse>("/auth/check-token", null, {
        headers: {
          authorization: token,
        },
      });
      if (data) {
        setUser(data.user);
        navigate("/chat");

        return data;
      }
    } catch (err) {
      console.error(err);
    }
  }, [navigate, token]);

  const resetToken = useCallback((removeTokenFromLocalStorage?: boolean) => {
    setToken(null);
    isUserDisconnected.current = true;

    if (removeTokenFromLocalStorage) {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loginAction, checkToken, resetToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
