import messages from "../../models/messages.js";

export const getThread = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ error: "Missing user 1 or user 2" });
    }

    const threadMessages = await messages
      .find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
        hiddenFromUser: false,
      })
      .sort({ createdAt: 1 });

    const result = threadMessages.map((msg) => ({
      id: msg._id,
      sender: msg.sender,
      receiver: msg.receiver,
      encrypted: msg.content,
      wasDecryptedOnce: msg.wasDecryptedOnce,
      status: msg.status,
      replyTo: msg.replyTo,
      replyToSummary: msg.replyToSummary,
      createdAt: msg.createdAt,
    }));
    res.status(200).json({ thread: result });
  } catch (error) {
    console.log("Failed fetching message thread", error);
    res.status(500).json({ error: "server error" });
  }
};
