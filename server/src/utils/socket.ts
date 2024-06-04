import { Server, Socket } from "socket.io";
import { getLastMessages, saveMessage } from "../services/chatService";
import { addOnlineUser, getOnlineUsers, removeOnlineUser } from "../services/userService";
import { colorGenerator } from "./colorGenerator";
import { handleSocketAdminConnection } from "./socketAdmin";

export const handleSocketConnection = async (socket: Socket, io: Server) => {
  const user = addOnlineUser((socket as any).user);
  const color = colorGenerator();

  // socket.emit("message", { user: "admin", text: `${user.username}, welcome to the chat.` });
  // socket.broadcast.emit("message", { user: "admin", text: `${user.username} has joined!` });

  // Load last 20 messages
  const lastMessages = await getLastMessages();
  socket.emit("loadMessages", lastMessages);

  // Get active users
  io.emit("activeUserList", getOnlineUsers());

  // Get offline users if user is admin
  if (user.role === "admin") {
    handleSocketAdminConnection(socket, io);
  }

  socket.on("sendMessage", async (message: string, callback: (error?: string) => void) => {
    if (user.muted) {
      // return callback("You are muted and cannot send messages.");
      io.emit("message", {
        user: "admin",
        text: `${user.username} is muted and cannot send messages.`,
      });
    }

    const newMessage = await saveMessage({ username: user.username, text: message, color });

    io.emit("message", newMessage);
    // callback();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeOnlineUser((socket as any).user._id);
    // io.emit("message", { user: "admin", text: `${user.username} has left.` });
    io.emit("activeUserList", getOnlineUsers());
  });
};
