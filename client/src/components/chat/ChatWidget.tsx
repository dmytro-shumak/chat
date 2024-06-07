import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth/useAuth";
import { useSocket } from "../../context/socket/useSocket";
import { LoadMessagesResponse, Message } from "../../types/message";
import MessageItem from "../message/MessageItem";

const ChatWidget = () => {
  const { on, emit, off } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastUserMessageTime, setLastUserMessageTime] = useState<string | undefined>();
  const [remainingTimeToSendMessage, setRemainingTimeToSendMessage] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    let intervalId: number;

    const updateRemainingTime = () => {
      const timeDifference = Date.now() - new Date(lastUserMessageTime!).getTime();
      const timeLeft = 15 - Math.floor(timeDifference / 1000);
      if (timeLeft > 0) {
        setRemainingTimeToSendMessage(timeLeft);
      } else {
        clearInterval(intervalId);
        setRemainingTimeToSendMessage(null);
      }
    };

    if (lastUserMessageTime) {
      updateRemainingTime();
      intervalId = setInterval(updateRemainingTime, 1000);
    }

    return () => clearInterval(intervalId);
  }, [lastUserMessageTime]);

  useEffect(() => {
    const handleLoadMessages = ({ messages, lastUserMessageTime }: LoadMessagesResponse) => {
      setMessages(messages);
      setLastUserMessageTime(lastUserMessageTime);
    };
    const handleNewMessage = (message: Message) => {
      if (user?.username === message.username) {
        setLastUserMessageTime(message.timestamp);
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    on("loadMessages", handleLoadMessages);
    on("message", handleNewMessage);

    return () => {
      off("loadMessages", handleLoadMessages);
      off("message", handleNewMessage);
    };
  }, [off, on, user?.username]);

  const shouldDisableMessageButton = useMemo(
    () => user?.isMuted || inputValue.trim() === "" || !!remainingTimeToSendMessage,
    [inputValue, remainingTimeToSendMessage, user?.isMuted]
  );

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
    <div className="max-w-[800px] w-full">
      <div className="min-h-72 h-[calc(100vh_-250px)] bg-gray-200 rounded-lg p-4 overflow-auto shadow-primary basis-2/3">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        disabled={user.isMuted}
        placeholder={user.isMuted ? "You are muted" : "Type a message..."}
        className="max-w-[800px] resize-none w-full min-h-20 mt-4 p-2 border border-gray-300 rounded disabled:bg-gray-200"
      />
      <div className="flex items-center mt-4 gap-4">
        <button
          onClick={handleSendMessage}
          className=" px-4 py-2 bg-blue-500 text-white rounded block disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={shouldDisableMessageButton}
        >
          Send
        </button>
        {remainingTimeToSendMessage && (
          <div className="text-red-600 font-bold text-lg p-1">{remainingTimeToSendMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;
