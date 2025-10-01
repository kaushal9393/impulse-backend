import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import Booking from '../../../models/Booking';

const SECRET = process.env.PAYMENT_SECRET || 'mock_payment_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['x-payment-signature'] as string || '';
  if (sig !== SECRET) return res.status(401).json({ message: 'Invalid signature' });

  const { providerPaymentId, status } = req.body;
  const booking = await Booking.findOne({ 'payment.providerPaymentId': providerPaymentId });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (status === 'paid') {
    booking.payment = { ...booking.payment, paid: true };
    booking.status = 'confirmed';
  } else {
    booking.status = 'pending';
  }
  await booking.save();
  return res.json({ ok: true });
}
