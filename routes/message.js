import express from "express";
import { createMessages } from "../controllers/messages/createMessage.js";
import { receiveMessages } from "../controllers/messages/receiveMessage.js";
import { getThread } from "../controllers/messages/getThread.js";

const router = express.Router();

router.post("/send", createMessages);
router.get("/inbox", receiveMessages);
router.get("/thread", getThread);

export default router;
