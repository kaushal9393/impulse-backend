// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";

type Data = {
  status: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }

    // Try connecting to the database
    await dbConnect();

    res.status(200).json({ status: "success", message: "Backend and DB are healthy" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({ status: "error", message: "Backend or DB not reachable" });
  }
}
