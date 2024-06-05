import Message, { IMessage } from "../model/Message";

interface SaveMessageInput {
  username: string;
  text: string;
  color: string;
}

export const saveMessage = async ({
  username,
  text,
  color,
}: SaveMessageInput): Promise<IMessage> => {
  const message = new Message({ username, text, color });
  await message.save();

  return message;
};

export const getLastMessages = async (): Promise<IMessage[]> => {
  return await Message.find().sort({ createdAt: -1 }).limit(20);
};
