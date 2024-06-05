import { getLastMessages, saveMessage } from "../services/chatService";
import { getOfflineUsers, getOnlineUsers } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";
import { colorGenerator } from "./colorGenerator";
import { handleSocketAdminConnection } from "./socketAdmin";

export const handleSocketConnection = async (socket: UserSocket, io: UserServer) => {
  const user = socket.data.user;
  const color = colorGenerator();

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
