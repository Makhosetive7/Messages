import messages from "../../models/messages.js";
import { decryptAES } from "../../utils/crypto.js";

export const receiveMessages = async (req, res) => {
  try {
    const { receiver, key } = req.query;

    if (!receiver || !key) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide both 'receiver' and 'key'.",
      });
    }

    const receivedMessages = await messages
      .find({ receiver })
      .sort({ createdAt: -1 });

    const response = receivedMessages.map((msg) => ({
      id: msg._id,
      sender: msg.sender,
      encrypted: msg.content,
      decrypted:
        decryptAES(msg.content, key) || "[Message cannot be decrypted]",
      createdAt: msg.createdAt,
    }));

    res.status(200).json({ messages: response });
  } catch (error) {
    console.log("Failed receiving messages:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
