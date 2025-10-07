import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { connectToDatabase } from "@/lib/mongodb"; // make sure you have a MongoDB connection utility

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
