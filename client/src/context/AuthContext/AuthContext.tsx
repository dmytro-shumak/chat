import { FC, PropsWithChildren, createContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../api/axios";
import { IUser } from "../../types/user";

interface AuthContextProps {
  token: string | null;
  user: IUser | null;
  loginAction: (username: string, password: string) => Promise<LoginResponse | undefined>;
  checkToken: () => Promise<LoginResponse | undefined>;
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
        navigate("/chat");

        return data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkToken = useCallback(async () => {
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

  return (
    <AuthContext.Provider value={{ token, user, loginAction, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
