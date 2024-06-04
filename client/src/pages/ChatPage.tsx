import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";

interface Message {
  username: string;
  text: string;
  avatar: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { user } = useContext(AuthContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  if (!user) return null;

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage: Message = {
        username: user?.username,
        text: inputValue,
        avatar: "path/to/avatar.png",
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 mb-24">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="max-w-[800px] w-10/12 min-h-72 bg-gray-200 rounded-lg p-4 overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start mb-2">
            <img
              src="https://gravatar.com/avatar/e30c2abedbceb2d4179e29273ef50eb3?size=256&cache=1717484638117"
              alt="Avatar"
              className="w-8 h-8 mr-2 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-semibold">{message.username}: </span>
              <span>{message.text}</span>
            </div>
          </div>
        ))}
      </div>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="max-w-[800px] w-10/12 min-h-16 mt-4 p-2 border border-gray-300 rounded"
      />
      <button onClick={handleSendMessage} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
};

export default ChatPage;
