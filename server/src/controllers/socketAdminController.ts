import {
  banUser,
  getOfflineUsers,
  getOnlineUsers,
  muteUser,
  sendOfflineUsersToAdmins,
} from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";

export const handleSocketAdminConnection = async (socket: UserSocket, io: UserServer) => {
  const offlineUsers = await getOfflineUsers(io);
  socket.emit("offlineUserList", offlineUsers);

  socket.on("muteUser", async (id: string) => {
    await muteUser(id, io);

    // Get active users
    io.emit("onlineUserList", getOnlineUsers(io));

    // Send offline users to admins
    sendOfflineUsersToAdmins(io);
  });

  socket.on("banUser", async (id: string) => {
    await banUser(id, io);
    io.sockets.sockets.forEach((value) => {
      if (String(value.data.user._id) === id) {
        value.disconnect(true);
      }
    });

    // Get active users
    io.emit("onlineUserList", getOnlineUsers(io));

    // Send offline users to admins
    sendOfflineUsersToAdmins(io);
  });
};
