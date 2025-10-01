import { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { amount, currency } = req.body;
    const order = await razorpay.orders.create({ amount: amount * 100, currency });
    return res.json(order);
  }
  res.status(405).end();
}
