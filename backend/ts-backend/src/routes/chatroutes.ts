import express from "express";
import multer from "multer";
import { removeBackground } from "../controllers/rmbgcontroller";
import { getChat, history } from "../controllers/chatcontroller";
import { authenticateToken } from "../middleware/authware";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/chat", authenticateToken, getChat);
router.get("/history", authenticateToken, history);
router.post("/rmbg", upload.single("file"), removeBackground);
export default router;
