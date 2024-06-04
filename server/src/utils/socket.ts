import { Server, Socket } from "socket.io";
import { getLastMessages, saveMessage } from "../services/chatService";
import { addUser, getUsers, removeUser } from "../services/userService";
import { colorGenerator } from "./colorGenerator";

export const handleSocketConnection = async (socket: Socket, io: Server) => {
  const user = addUser((socket as any).user);
  const color = colorGenerator();

  // socket.emit("message", { user: "admin", text: `${user.username}, welcome to the chat.` });
  // socket.broadcast.emit("message", { user: "admin", text: `${user.username} has joined!` });

  // Load last 20 messages
  const lastMessages = await getLastMessages();
  socket.emit("loadMessages", lastMessages);

  io.emit("userList", getUsers());

  socket.on("sendMessage", async (message: string, callback: (error?: string) => void) => {
    console.log("HERE?", callback);
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
    removeUser((socket as any).user.id);
    // io.emit("message", { user: "admin", text: `${user.username} has left.` });
    io.emit("userList", getUsers());
  });
};
