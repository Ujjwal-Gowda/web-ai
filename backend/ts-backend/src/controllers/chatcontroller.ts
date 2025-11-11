import { Request, Response } from "express";

export const getChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.send({ error: "no input found" });
    }
    const response = await fetch("http://localhost:8000/chat/", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
      method: "POST",
    });
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to get response from AI model",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
