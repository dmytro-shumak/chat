import { Document, Schema, model } from "mongoose";

// Define the Message interface

// Define the Message schema
const messageSchema = new Schema<IMessage>({
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 200,
  },
  color: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export interface IMessage extends Document {
  username: string;
  text: string;
  color: string;
  timestamp: Date;
}

// Create and export the Message model
const Message = model<IMessage>("Message", messageSchema);

export default Message;
