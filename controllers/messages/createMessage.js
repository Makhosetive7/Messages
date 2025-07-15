import messages from "../../models/messages.js";
import {encryptAES} from "../../utils/crypto.js";

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
    } = req.body;

    if (!sender || !receiver || !message || !key) {
      return res.status(400).json({
        error:
          "Missing required fields. check if you are providing sender, receiver, message and key",
      });
    }

    const encrypted = encryptAES(message, key);

    const newMessage = new messages({
      sender,
      receiver,
      content: encrypted,
      codeType: codeType || "aes",
      selfDestruct: selfDestruct || false,
      unlockDuration: unlockDuration || 10,
    });

    await newMessage.save();

    res.status(200).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    console.log("Failed creating message", error);
    res.status(500).json("server error");
  }
};
