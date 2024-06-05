import { banUser, getOfflineUsers, getOnlineUsers, muteUser } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";

export const handleSocketAdminConnection = async (socket: UserSocket, io: UserServer) => {
  const offlineUsers = await getOfflineUsers(io);
  socket.emit("offlineUserList", offlineUsers);

  socket.on("muteUser", async (id: string) => {
    await muteUser(id, io);

    io.emit("userList", {
      onlineUsers: getOnlineUsers(io),
      offlineUsers: await getOfflineUsers(io),
    });
  });

  socket.on("banUser", async (id: string) => {
    await banUser(id, io);
    io.sockets.sockets.forEach((value) => {
      if (String(value.data.user._id) === id) {
        value.disconnect(true);
      }
    });

    io.emit("userList", {
      onlineUsers: getOnlineUsers(io),
      offlineUsers: await getOfflineUsers(io),
    });
  });
};
