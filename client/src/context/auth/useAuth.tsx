import { useContext } from "react";
import { AuthContextProps } from "../../types/auth";
import { AuthContext } from "./AuthContext";

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useContext must be used within a AuthProvider");
  }

  return context;
};
