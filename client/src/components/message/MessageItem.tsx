import { FC } from "react";
import { Message } from "../../types/message";
import { getUserAvatar } from "../../utils/getUserAvatar";

interface Props {
  message: Message;
}

const MessageItem: FC<Props> = ({ message }) => {
  const { color, text, username } = message;

  return (
    <div className="flex items-start mb-2">
      <img
        src={getUserAvatar(username)}
        alt={`${username} avatar`}
        className="w-8 h-8 mr-2 rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-semibold" style={{ color }}>
          {username}:
        </span>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default MessageItem;
