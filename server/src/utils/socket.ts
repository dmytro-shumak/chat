import { getLastMessages, saveMessage } from "../services/chatService";
import { getOfflineUsers, getOnlineUsers } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";
import { colorGenerator } from "./colorGenerator";
import { handleSocketAdminConnection } from "./socketAdmin";

export const handleSocketConnection = async (socket: UserSocket, io: UserServer) => {
  const user = socket.data.user;
  const color = colorGenerator();

  // Disconnect older connections with the same user
  io.sockets.sockets.forEach((value) => {
    if (String(value.data.user._id) === String(user._id) && value.id !== socket.id) {
      console.log("HERE", user._id);
      value.disconnect(true);
    }
  });

  // Load last 20 messages
  const lastMessages = await getLastMessages();
  socket.emit("loadMessages", lastMessages);

  // Get active users
  io.emit("activeUserList", getOnlineUsers(io));

  // Get offline users
  const offlineUsers = await getOfflineUsers(io);
  io.emit("offlineUserList", offlineUsers);

  // Get offline users if user is admin
  if (user.role === "admin") {
    handleSocketAdminConnection(socket, io);
  }

  socket.on("sendMessage", async (message: string, callback: (error?: string) => void) => {
    if (user.isMuted) {
      // return callback("You are muted and cannot send messages.");
      return;
    }

    const newMessage = await saveMessage({ username: user.username, text: message, color });

    io.emit("message", newMessage);
    // callback();
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected");

    // Get active users
    io.emit("activeUserList", getOnlineUsers(io));

    // Get offline users
    const offlineUsers = await getOfflineUsers(io);
    io.emit("offlineUserList", offlineUsers);
  });
};
