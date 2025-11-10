import cors from "cors";
import express from "express";
import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", () => {
  console.log("hello");
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});
app.listen(5000, () => {
  console.log("server running on https://localhost:5000");
});
export const prisma = new PrismaClient();
prisma
  .$connect()
  .then(() => console.log("✅ Prisma connected successfully"))
  .catch((e) => {
    console.error("❌ Prisma connection failed:", e.message);
  });
