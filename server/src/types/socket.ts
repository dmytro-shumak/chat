import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IUser } from "../model/User";

export type UserServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { user: IUser }
>;

export type UserSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { user: IUser }
>;
