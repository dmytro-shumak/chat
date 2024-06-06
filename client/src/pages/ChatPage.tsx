import React, { useState } from "react";
import Burger from "../components/burger/Burger";
import ChatWidget from "../components/chat/ChatWidget";
import UserPanel from "../components/user/UserPanel";

const ChatPage: React.FC = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
    setHasInteracted(true);
  };

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
