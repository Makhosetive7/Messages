import messages from "../../models/messages.js";
import { decryptAES, encryptAES } from "../../utils/crypto.js";

export const createMessages = async (req, res) => {
  try {
    const {
      sender,
      receiver,
      message,
      key,
      codeType,
      selfDestruct,
      unlockDuration,
      replyTo,
    } = req.body;

    if (!sender || !receiver || !message || !key) {
      return res.status(400).json({
        error:
          "Missing required fields. check if you are providing sender, receiver, message and key",
      });
    }

    const encrypted = encryptAES(message, key);
    let replyToSummary = null;

    //if replying fetch the original and decrypted preview
    if (replyTo) {
      const original = await messages.findById(replyTo);
      if (original) {
        const decryptedOriginal = decryptAES(original.content, key);
        replyToSummary = decryptedOriginal
          ? decryptedOriginal.slice(0, 25)
          : "unable to preview message";
      }
    }

    const newMessage = new messages({
      sender,
      receiver,
      content: encrypted,
      codeType: codeType || "aes",
      selfDestruct: selfDestruct || false,
      unlockDuration: unlockDuration || 120,
      replyTo: replyTo || null,
      replyToSummary: replyToSummary || null,
    });

    await newMessage.save();

    res.status(200).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    console.log("Failed creating message", error);
    res.status(500).json("server error");
  }
};
