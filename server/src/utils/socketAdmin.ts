import { Server, Socket } from "socket.io";
import { getOfflineUsers, getOnlineUsers, muteUser } from "../services/userService";

export const handleSocketAdminConnection = async (socket: Socket, io: Server) => {
  const offlineUsers = await getOfflineUsers();
  socket.emit("offlineUserList", offlineUsers);

  socket.on("muteUser", async (id: string) => {
    await muteUser(id);

    io.emit("activeUserList", getOnlineUsers());

    const offlineUsers = await getOfflineUsers();
    socket.emit("offlineUserList", offlineUsers);
  });
};
