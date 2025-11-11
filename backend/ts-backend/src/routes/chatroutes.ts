import express from "express";
import { getChat } from "../controllers/chatcontroller";
import { authenticateToken } from "../middleware/authware";
const router = express.Router();

router.post("/chat", authenticateToken, getChat);

export default router;
