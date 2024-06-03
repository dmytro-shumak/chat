import { Server, Socket } from "socket.io";
import { getLastMessages, saveMessage } from "../services/chatService";
import { addUser, getUsers, removeUser } from "../services/userService";

export const handleSocketConnection = (socket: Socket, io: Server) => {
  const user = addUser((socket as any).user);

  socket.emit("message", { user: "admin", text: `${user.username}, welcome to the chat.` });
  socket.broadcast.emit("message", { user: "admin", text: `${user.username} has joined!` });

  socket.emit("loadMessages", getLastMessages());

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

    const newMessage = await saveMessage({ user: user.username, text: message });

    io.emit("message", newMessage);
    // callback();
  });

  socket.on("disconnect", () => {
    removeUser((socket as any).user.id);
    io.emit("message", { user: "admin", text: `${user.username} has left.` });
    io.emit("userList", getUsers());
  });
};
