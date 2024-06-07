import { Socket } from "socket.io-client";

export interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
}
