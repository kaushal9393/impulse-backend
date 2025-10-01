import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const totalBookings = await Booking.countDocuments();
  const revenue = await Booking.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
  return res.json({ totalBookings, revenue: revenue[0]?.total || 0 });
}
