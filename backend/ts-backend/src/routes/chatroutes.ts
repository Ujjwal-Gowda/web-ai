import express from "express";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import { getChat, history } from "../controllers/chatcontroller";
import { authenticateToken } from "../middleware/authware";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/chat", authenticateToken, getChat);
router.get("/history", authenticateToken, history);

router.post("/rmbg", upload.single("file"), async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ error: "No file uploaded" });

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await fetch("http://127.0.0.1:8000/remove-bg-base64", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as { image: string; filename: string };
  fs.unlinkSync(filePath);

  res.json({
    success: true,
    image: data.image,
    filename: data.filename,
  });
});

export default router;
