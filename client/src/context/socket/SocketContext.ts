import { createContext } from "react";
import { SocketContextProps } from "../../types/socket";

export const SocketContext = createContext<SocketContextProps | undefined>(undefined);
