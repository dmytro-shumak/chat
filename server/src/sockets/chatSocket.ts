import { getLastMessageFromUser, getLastMessages, saveMessage } from "../services/chatService";
import { updateUserList } from "../services/userService";
import { UserServer, UserSocket } from "../types/socket";
import { colorGenerator } from "../utils/colorGenerator";
import { handleChatAdminSocketConnection } from "./chatAdminSocket";

export const handleChatSocketConnection = async (socket: UserSocket, io: UserServer) => {
  const user = socket.data.user;
  const color = colorGenerator();

  // Disconnect older connections with the same user
  io.sockets.sockets.forEach((s) => {
    if (String(s.data.user._id) === String(user._id) && s.id !== socket.id) {
      s.emit("disconnectUser", false);
      s.disconnect(true);
    }
  });

  // Load last 20 messages and last message from user
  const lastMessages = await getLastMessages();
  const lastUserMessage = await getLastMessageFromUser(user.username);
  socket.emit("loadMessages", {
    messages: lastMessages,
    lastUserMessageTime: lastUserMessage?.timestamp,
  });

  // Update user list
  updateUserList(io);

  // Handle admin connections
  if (user.role === "admin") {
    handleChatAdminSocketConnection(socket, io);
  }

  socket.on("sendMessage", async (message: string, callback?: (error?: string) => void) => {
    if (user.isMuted) {
      return callback?.("You are muted and cannot send messages.");
    }

    if (message.trim() === "") {
      return callback?.("Message cannot be empty");
    }

    if (message.length > 200) {
      return callback?.("Message is too long");
    }

    // Check if user is spamming
    const lastMessage = await getLastMessageFromUser(user.username);
    if (lastMessage) {
      const timeDifference = Date.now() - lastMessage.timestamp.getTime();
      if (timeDifference < 15_000) {
        return callback?.("Please wait 15 seconds before sending another message.");
      }
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
    // Update user list
    await updateUserList(io);
  });
};
