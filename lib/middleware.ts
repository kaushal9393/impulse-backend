import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./jwt";

export const authMiddleware = (roles: string[] = []) => {
  return (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    if (roles.length && !roles.includes((decoded as any).role))
      return res.status(403).json({ message: "Forbidden" });

    (req as any).user = decoded;
    return handler(req, res);
  };
};
