import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { AuthContext } from "../AuthContext/AuthContext";

export interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
}

export const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  url: string;
  children: ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ url, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const socketInstance = io(url, {
      query: {
        token,
      },
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    [socket]
  );

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    [socket]
  );

  const off = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socket) {
        socket.off(event, callback);
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider value={{ socket, connected, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
};
