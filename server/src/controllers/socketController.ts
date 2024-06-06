import { getLastMessages, saveMessage } from "../services/chatService";
import { getOfflineUsers, getOnlineUsers } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";
import { colorGenerator } from "../utils/colorGenerator";
import { handleSocketAdminConnection } from "./socketAdminController";

export const handleSocketConnection = async (socket: UserSocket, io: UserServer) => {
  const user = socket.data.user;
  const color = colorGenerator();

  // Disconnect older connections with the same user
  io.sockets.sockets.forEach((value) => {
    if (String(value.data.user._id) === String(user._id) && value.id !== socket.id) {
      value.disconnect(true);
    }
  });

  // Load last 20 messages
  const lastMessages = await getLastMessages();
  socket.emit("loadMessages", lastMessages);

  io.emit("userList", {
    onlineUsers: getOnlineUsers(io),
    offlineUsers: await getOfflineUsers(io),
  });

  // Get offline users if user is admin
  if (user.role === "admin") {
    handleSocketAdminConnection(socket, io);
  }

  socket.on("sendMessage", async (message: string, callback?: (error?: string) => void) => {
    if (user.isMuted) {
      return callback?.("You are muted and cannot send messages.");
    }

    if (message.length > 200) {
      return callback?.("Message is too long");
    }

    try {
      const normalizedMessage = message.replace(/\s{2,}/g, " ");
      const newMessage = await saveMessage({
        username: user.username,
        text: normalizedMessage,
        color,
      });
      io.emit("message", newMessage);

      callback?.();
    } catch (error) {
      callback?.("An error occurred while sending the message.");
    }
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected");

    io.emit("userList", {
      onlineUsers: getOnlineUsers(io),
      offlineUsers: await getOfflineUsers(io),
    });
  });
};
