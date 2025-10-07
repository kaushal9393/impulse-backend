import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { patientId, filePath } = req.body;
    await client.connect();
    const db = client.db("impulse_lab");
    const reports = db.collection("reports");

    const result = await reports.insertOne({
      patientId,
      filePath,
      uploadedAt: new Date(),
    });

    res.status(200).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to save report" });
  }
}
