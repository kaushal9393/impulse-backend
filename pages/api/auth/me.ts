import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/jwt";
import { connectToDatabase } from "@/lib/mongodb"; 
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase ();

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const user = await User.findById((decoded as any).id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}
