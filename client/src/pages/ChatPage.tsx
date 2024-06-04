import React, { useContext, useEffect, useState } from "react";
import MessageItem from "../components/message/MessageItem";
import UserPanel from "../components/user/UserPanel";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useSocket } from "../hook/useSocket";
import { Message } from "../types/message";
import { IUser } from "../types/user";

const ChatPage: React.FC = () => {
  const socket = useSocket("http://localhost:3000");
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { user } = useContext(AuthContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("loadMessages", (messages: Message[]) => {
      setMessages(messages);
    });
    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("userList", (users: IUser[]) => {
      setOnlineUsers(users);
    });
  }, [socket]);

  if (!user || !socket) return null;

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      socket.emit("sendMessage", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 mb-24">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="flex gap-x-10">
        <div>
          <div className="max-w-[800px] min-h-72 h-[calc(100vh_-250px)] bg-gray-200 rounded-lg p-4 overflow-auto shadow-md basis-2/3">
            {messages.map((message, index) => (
              <MessageItem key={index} message={message} />
            ))}
          </div>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="max-w-[800px] w-full min-h-16 mt-4 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSendMessage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded block"
          >
            Send
          </button>
        </div>
        <UserPanel onlineUsers={onlineUsers} />
      </div>
    </div>
  );
};

export default ChatPage;
