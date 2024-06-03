import Message, { IMessage } from "../model/Message";

interface SaveMessageInput {
  user: string;
  text: string;
}

export const saveMessage = async ({ user, text }: SaveMessageInput): Promise<IMessage> => {
  const message = new Message({ user, text });
  await message.save();
  return message;
};

export const getLastMessages = async (): Promise<IMessage[]> => {
  return await Message.find().sort({ createdAt: -1 }).limit(20);
};
