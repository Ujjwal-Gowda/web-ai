import express from "express";
import getChat from "chatcontroller";

const router = express.Router();

router.post("/chat", getChat);

export default router;
