import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
async function main() {
  await prisma.$connect();
  const user = await prisma.user.findMany();
  console.log(user);
}
main()
  .then(() => console.log("Primsa connected"))
  .catch((e) => {
    console.error("prisma connection failed>>", e);
    prisma.$disconnect();
  });

app.use(
  "/auth",
  () => {
    console.log("hello");
  },
  authRoutes,
);

app.listen(5000, () => {
  console.log("server running on https://localhost:5000");
});
