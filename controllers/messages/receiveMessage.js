import messages from "../../models/messages.js";
import { decryptAES } from "../../utils/crypto.js";

export const receiveMessages = async (req, res) => {
  try {
    const { receiver, key } = req.query;

    if (!receiver || !key) {
      return res.status(400).json({
        error: "Missing required fields. Provide both 'receiver' and 'key'.",
      });
    }

    const now = new Date();

    const receivedMessages = await messages
      .find({ receiver, hiddenFromUser: false })
      .sort({ createdAt: -1 });

    const response = await Promise.all(
      receivedMessages.map(async (msg) => {
        if (msg.permanentlyLocked) {
          return {
            id: msg._id,
            sender: msg.sender,
            status: "Permanently Locked",
            encrypted: msg.content,
            createdAt: msg.createdAt,
          };
        }

        // Try decrypting
        const decrypted = decryptAES(msg.content, key);

        // Handle decryption failure
        if (!decrypted) {
          msg.failedAttempts = (msg.failedAttempts || 0) + 1;

          if (msg.failedAttempts >= 2) {
            msg.hiddenFromUser = true;
            msg.status = msg.selfDestruct ? 'deleted' : 'locked';
            msg.permanentlyLocked = !msg.selfDestruct;
            await msg.save();

            return {
              id: msg._id,
              sender: msg.sender,
              status: `Message ${msg.status} after 2 failed attempts`,
              encrypted: msg.content
            };
          }

          await msg.save();
          return {
            id: msg._id,
            sender: msg.sender,
            status: "Incorrect key",
            failedAttempts: msg.failedAttempts,
            encrypted: msg.content
          };
        }

        // Successful decryption
        // Mark first-time view
        if (!msg.read) {
          msg.read = true;
          msg.unlockedAt = now;
          msg.wasDecryptedOnce = true;
          msg.status = "unlocked";
          await msg.save();
        }

        // Check if unlock expired
        const unlockTime = msg.unlockedAt
          ? msg.unlockedAt.getTime() + msg.unlockDuration * 1000
          : null;

        if (unlockTime && now.getTime() > unlockTime) {
          msg.read = false;
          msg.unlockedAt = null;
          msg.status = "relocked";
          await msg.save();

          return {
            id: msg._id,
            sender: msg.sender,
            encrypted: msg.content,
            wasDecryptedOnce: true,
            status: "Message re-locked after timer",
            createdAt: msg.createdAt
          };
        }

        // Still within unlock window
        const secondsLeft = Math.floor((unlockTime - now.getTime()) / 1000);

        msg.deliveredAt = msg.deliveredAt || now;
        msg.seenAt = msg.seenAt || now;
        await msg.save();

        return {
          id: msg._id,
          sender: msg.sender,
          decrypted,
          encrypted: msg.content,
          createdAt: msg.createdAt,
          unlockExpiresIn: `${secondsLeft}s`,
          read: msg.read,
          wasDecryptedOnce: true,
          status: "Message unlocked"
        };
      })
    );

    res.status(200).json({ messages: response });
  } catch (error) {
    console.log("Failed receiving messages:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
