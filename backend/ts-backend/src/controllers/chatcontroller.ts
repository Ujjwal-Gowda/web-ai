import { Request, Response } from "express";

export const getChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.send({ error: "no input found" });
    }
    const response = await fetch("http://localhost:8000/chat", {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
      method: "POST",
    });
    res.status(200).json({ message: response });
  } catch (error) { }
};
