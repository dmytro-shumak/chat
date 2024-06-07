import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Burger from "../components/burger/Burger";
import ChatWidget from "../components/chat/ChatWidget";
import UserPanel from "../components/user/UserPanel";
import { useAuth } from "../context/auth/useAuth";
import { useSocket } from "../context/socket/useSocket";

const ChatPage: React.FC = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const navigate = useNavigate();
  const { setUser, disconnectUser } = useAuth();
  const { on, off } = useSocket();

  const handleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
    setHasInteracted(true);
  };

  useEffect(() => {
    const handleUpdateUser = (isMuted: boolean) => {
      setUser((prevUserData) => {
        if (!prevUserData) {
          return prevUserData;
        }
        return {
          ...prevUserData,
          isMuted,
        };
      });
    };
    const handleBanUser = (isBanned: boolean) => {
      if (isBanned) {
        toast.error("You have been banned from the chat");
        disconnectUser();
        navigate("/login");
      }
    };

    on("muteUserToggle", handleUpdateUser);
    on("banUserToggle", handleBanUser);

    return () => {
      off("muteUserToggle", handleUpdateUser);
      off("banUserToggle", handleBanUser);
    };
  });

  return (
    <div className="mb-24 p-8 h-full">
      <header className="flex mb-4 items-center justify-between">
        <h1 className="text-2xl font-bold text-center ml-auto lg:mr-auto">Chat</h1>
        <Burger handleVisibility={handleChatVisibility} isVisible={isChatVisible} />
      </header>
      <div className="flex gap-x-10 h-full">
        <ChatWidget />
        <UserPanel isChatVisible={isChatVisible} hasInteractedWithBurger={hasInteracted} />
      </div>
    </div>
  );
};

export default ChatPage;
