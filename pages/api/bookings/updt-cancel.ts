import type { NextApiRequest, NextApiResponse } from "next";
import {connectToDatabase}from "../../../lib/mongodb";
import Booking from "../../../models/Booking";
import { authMiddleware } from "../../../lib/middleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "PUT") {
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json(booking);
  }

  if (req.method === "DELETE") {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json({ message: "Booking canceled successfully" });
  }

  res.status(405).end();
};

export default authMiddleware(["user", "admin"])(handler);
