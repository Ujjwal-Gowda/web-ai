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
app.use("/ai", chatRoutes);

app.get("/health", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

prisma
  .$connect()
  .then(() => {
    console.log("✅ Prisma connected successfully");
  })
  .catch((e) => {
    console.error("❌ Prisma connection failed:", e.message);
    console.log("⚠️  Server is running but database operations will fail");
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
