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
  const user = await prisma.user.findMany();
  console.log(user);

  const newUser = await prisma.user.create({
    data: {
      name: "Ujjwal",
      email: "ujjwal@example.com",
      password: "123456",
    },
  });

  console.log("User created:", newUser);
  const message = await prisma.chat.create({
    data: {
      message: "Hello, this is my first message!",
      userId: newUser.id,
    },
  });

  console.log("Message created:", message);
}
main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });

app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log("server running on https://localhost:5000");
});
