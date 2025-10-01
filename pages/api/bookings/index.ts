import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase }from '../../../lib/mongodb';
import Booking from '../../../models/Booking';
import Service from '../../../models/Service';
import User from '../../../models/User';
import { getTokenFromReq, verifyToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  if (req.method === 'POST') {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload: any = verifyToken(token);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { services: svcIds, sampleDate } = req.body;
    if (!Array.isArray(svcIds) || svcIds.length === 0) return res.status(400).json({ message: 'No services selected' });

    const services = await Service.find({ _id: { $in: svcIds }});
    let total = 0;
    const svcList = services.map(s => {
      total += s.price;
      return { service: s._id, price: s.price };
    });

    const booking = new Booking({
      user: user._id,
      services: svcList,
      total,
      sampleDate: sampleDate ? new Date(sampleDate) : undefined
    });
    await booking.save();
    return res.status(201).json(booking);
  }

  if (req.method === 'GET') {
    // list bookings (if admin -> all, else own)
    const token = getTokenFromReq(req);
    const payload: any = token ? verifyToken(token) : null;
    if (!payload) return res.status(401).json({ message: 'Unauthorized' });
    if (payload.role === 'admin') {
      const all = await Booking.find().populate('user').populate('services.service').lean();
      return res.json(all);
    } else {
      const mine = await Booking.find({ user: payload.id }).populate('services.service').lean();
      return res.json(mine);
    }
  }

  res.status(405).end();
}
