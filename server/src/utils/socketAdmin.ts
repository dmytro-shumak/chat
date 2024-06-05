import { banUser, getOfflineUsers, getOnlineUsers, muteUser } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";

export const handleSocketAdminConnection = async (socket: UserSocket, io: UserServer) => {
  const offlineUsers = await getOfflineUsers();
  socket.emit("offlineUserList", offlineUsers);

  socket.on("muteUser", async (id: string) => {
    await muteUser(id);

    io.emit("activeUserList", getOnlineUsers());

    const offlineUsers = await getOfflineUsers();
    socket.emit("offlineUserList", offlineUsers);
  });

  socket.on("banUser", async (id: string) => {
    await banUser(id);
    io.sockets.sockets.forEach((value) => {
      if (value.data.user._id === id) {
        value.disconnect(true);
      }
    });

    io.emit("activeUserList", getOnlineUsers());

    const offlineUsers = await getOfflineUsers();
    socket.emit("offlineUserList", offlineUsers);
  });
};
