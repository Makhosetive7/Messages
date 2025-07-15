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
    type: String,
    required: true,
  },
  codeType: {
    type: String,
    default: "aes",
  },
  read: {
    type: Boolean,
    default: false,
  },
  unlockedAt: {
    type: Date,
  },
  unlockDuration: {
    type: Number,
    default: 40,
  },
  selfDestruct: {
    type: Boolean,
    default: false,
  },
  failedAttempts: {
    type: Number,
    default: 0,
  },
  permanentlyLocked: {
    type: Boolean,
    default: false,
  },
  hiddenFromUser: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "active",
  },
  wasDecryptedOnce: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("messages", messageSchema);
