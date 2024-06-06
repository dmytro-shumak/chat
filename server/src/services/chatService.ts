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

export const getLastMessageFromUser = async (username: string): Promise<IMessage | null> => {
  return await Message.findOne({ username }).sort({ timestamp: -1 });
};
