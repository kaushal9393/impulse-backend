import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { patientId } = req.query;
    await client.connect();
    const db = client.db("impulse_lab");
    const reports = db.collection("reports");

    const files = await reports.find({ patientId }).toArray();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
}
