import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { PrismaClient } from "@prisma/client";
import chatRoutes from "./routes/chatroutes";
dotenv.config();

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = 5000;

prisma
  .$connect()
  .then(() => {
    console.log("✅ Prisma connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("❌ Prisma connection failed:", e.message);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
