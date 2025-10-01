import type { NextApiRequest, NextApiResponse } from "next";
import {connectToDatabase} from "../../../lib/mongodb";
import Service from "../../../models/Service";
import { authMiddleware } from "../../../lib/middleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "PUT") {
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json(service);
  }

  if (req.method === "DELETE") {
    const service = await Service.findByIdAndDelete(id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    return res.json({ message: "Service deleted successfully" });
  }

  res.status(405).end();
};

export default authMiddleware(["admin"])(handler);
