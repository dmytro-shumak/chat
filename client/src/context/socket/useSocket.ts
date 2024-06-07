import { useContext } from "react";
import { SocketContextProps } from "../../types/socket";
import { SocketContext } from "./SocketContext";

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
