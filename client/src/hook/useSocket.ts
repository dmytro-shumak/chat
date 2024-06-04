import { useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext/AuthContext";

export const useSocket = (serverUrl: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    let newSocket: Socket | null = null;
    if (token) {
      newSocket = io(serverUrl, {
        query: {
          token,
        },
      });

      setSocket(newSocket);
    }
    return () => {
      newSocket?.close();
    };
  }, [serverUrl, token]);

  return socket;
};
