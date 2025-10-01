import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  if (req.method === "GET") {
    const services = await Service.find();
    return res.json(services);
  }

  if (req.method === "POST") {
    const { name, price, description } = req.body;
    const service = await Service.create({ name, price, description });
    return res.status(201).json(service);
  }

  res.status(405).end();
}
