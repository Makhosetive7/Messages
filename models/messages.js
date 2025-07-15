import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  content: {
    type: String, // encryption
    required: true,
  },
  codeType: {
    type: String,
    required: true,
    default: "aes",
  },
  read: {
    type: Boolean,
    default: false,
  },
  unloackedAt: {
    type: Date,
  },
  unloackDuration: {
    type: Number,
    default: 10,
  },
  selfDestruct: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("messages", messageSchema);
