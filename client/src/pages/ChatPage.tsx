import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import MessageItem from "../components/message/MessageItem";
import UserPanel from "../components/user/UserPanel";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { useSocket } from "../hook/useSocket";
import { Message } from "../types/message";

const ChatPage: React.FC = () => {
  const { on, emit } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { user } = useContext(AuthContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    on("loadMessages", (messages: Message[]) => {
      setMessages(messages);
    });
    on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [on]);

  if (!user) {
    return null;
  }

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      emit("sendMessage", inputValue, (error?: string) => {
        if (!error) {
          setInputValue("");
        } else {
          toast.error(error);
        }
      });
    }
  };

  return (
    <div className="mb-24 p-8 h-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat</h1>
      <div className="flex gap-x-10 h-full">
        <div>
          <div className="max-w-[800px] min-h-72 h-[calc(100vh_-250px)] bg-gray-200 rounded-lg p-4 overflow-auto shadow-md basis-2/3">
            {messages.map((message, index) => (
              <MessageItem key={index} message={message} />
            ))}
          </div>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            disabled={user.isMuted}
            placeholder={user.isMuted ? "You are muted" : "Type a message..."}
            className="max-w-[800px] w-full min-h-16 mt-4 p-2 border border-gray-300 rounded disabled:bg-gray-200"
          />
          <button
            onClick={handleSendMessage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded block disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={user.isMuted || inputValue.trim() === ""}
          >
            Send
          </button>
        </div>
        <UserPanel />
      </div>
    </div>
  );
};

export default ChatPage;
