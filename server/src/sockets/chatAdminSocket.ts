import { banUser, muteUser, updateUserList } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";

export const handleChatAdminSocketConnection = async (socket: UserSocket, io: UserServer) => {
  socket.on("muteUser", async (id: string) => {
    // Mute user
    const updatedUser = await muteUser(id, io);

    // Emit muteUserToggle event to the user
    if (updatedUser) {
      io.sockets.sockets.forEach((socket) => {
        if (String(socket.data.user._id) === id) {
          socket.emit("muteUserToggle", updatedUser.isMuted);
        }
      });
    }

    // Update user list
    await updateUserList(io);
  });

  socket.on("banUser", async (id: string) => {
    // Ban and disconnect user
    const updatedUser = await banUser(id, io);
    io.sockets.sockets.forEach((socket) => {
      if (String(socket.data.user._id) === id) {
        if (updatedUser) {
          socket.emit("disconnectUser", updatedUser.isBanned);
        }
        socket.disconnect(true);
      }
    });

    // Update user list
    await updateUserList(io);
  });
};
