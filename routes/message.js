import express from "express";
import {createMessages} from "../controllers/messages/createMessage.js";
import {receiveMessages} from "../controllers/messages/receiveMessage.js";

const router = express.Router();

router.post("/send", createMessages);
router.get("/inbox", receiveMessages);

export default router;
