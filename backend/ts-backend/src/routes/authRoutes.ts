import express from "express";
import { supabase } from "../lib/supabaseclient";

const router = express.Router();

// Sign up
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  console.log("ok>>", data);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ user: data.user });
});

// Sign in
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session });
});

// Get user by token
router.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });
  res.json({ user: data.user });
});

export default router;
