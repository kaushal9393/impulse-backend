import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import Report from '../../../models/Report';
import Booking from '../../../models/Booking';
import { getTokenFromReq, verifyToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  if (req.method === 'POST') {
    // Upload a report (admin)
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload: any = verifyToken(token);
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { bookingId, fileUrl, notes } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(400).json({ message: 'Invalid booking' });
    const report = new Report({ booking: booking._id, fileUrl, notes, uploadedBy: payload.id });
    await report.save();
    return res.status(201).json(report);
  }

  if (req.method === 'GET') {
    const { bookingId } = req.query;
    const query: any = {};
    if (bookingId) query.booking = bookingId;
    const list = await Report.find(query).populate('booking').lean();
    return res.json(list);
  }

  res.status(405).end();
}
