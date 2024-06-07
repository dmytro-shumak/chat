import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useAuth } from "../auth/useAuth";
import { SocketContext } from "./SocketContext";

interface SocketProviderProps {
  url: string;
  children: ReactNode;
}

export const SocketProvider: FC<SocketProviderProps> = ({ url, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { token, disconnectUser } = useAuth();
  const navigate = useNavigate();

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
  }, [navigate, disconnectUser, token, url]);

  const emit = useCallback(
    (event: string, ...data: any[]) => {
      if (socket) {
        socket.emit(event, ...data);
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
