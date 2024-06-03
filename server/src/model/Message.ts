import { Document, Schema, model } from "mongoose";

// Define the Message interface

// Define the Message schema
const messageSchema = new Schema<IMessage>({
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 200,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export interface IMessage extends Document {
  user: string;
  text: string;
  timestamp: Date;
}

// Create and export the Message model
const Message = model<IMessage>("Message", messageSchema);

export default Message;
