import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import {connectToDatabase} from "../../../lib/mongodb";
import Booking from "../../../models/Booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  if (req.method === "POST") {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("services");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const totalAmount = booking.services.reduce((sum: number, s: any) => sum + s.price, 0) * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: booking.services.map((s: any) => ({
        price_data: { currency: "usd", product_data: { name: s.name }, unit_amount: s.price * 100 },
        quantity: 1,
      })),
      success_url: `${req.headers.origin}/success?bookingId=${bookingId}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } else res.status(405).end();
}
