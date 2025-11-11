import fetch from "node-fetch";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authware";
import { prisma } from "../server";
export const getChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.userId;
    if (!message) {
      return res.status(400).json({ error: "No input found" });
    }
    if (!userId) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const response = await fetch("http://localhost:8000/chat/", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Python backend error: ${response.status}`);
    }

    const data = (await response.json()) as { response: string };
    try {
      await prisma.chat.create({
        data: {
          userId: userId,
          message: message,
          response: data.response,
        },
      });
    } catch (dbError) {
      console.error("Failed to save chat to database:", dbError);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to get response from AI model",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const history = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "unauthorized" });
    }
    try {
      const chats = await prisma.chat.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      res.status(200).json({ chats });
    } catch (dbError) {
      console.error("database failed to fetch", dbError);
    }
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
