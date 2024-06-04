import { FC } from "react";
import { Message } from "../../types/message";

interface Props {
  message: Message;
}

const MessageItem: FC<Props> = ({ message }) => {
  const { color, text, username } = message;

  return (
    <div className="flex items-start mb-2">
      <img
        src="https://gravatar.com/avatar/e30c2abedbceb2d4179e29273ef50eb3?size=256&cache=1717484638117"
        alt="Avatar"
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
