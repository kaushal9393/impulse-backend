import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Missing authorization code" });

    // Exchange code for access token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    });

    const { access_token, id_token } = tokenRes.data;

    // Decode ID token (contains user info)
    const googleUser = jwt.decode(id_token) as {
      email: string;
      name: string;
      picture: string;
      sub: string;
    };

    if (!googleUser?.email) return res.status(400).json({ message: "Google user info missing" });

    // Connect to DB
    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: "", // Not needed for OAuth users
        provider: "google",
        googleId: googleUser.sub,
        profileImage: googleUser.picture,
      });
    }

    // Generate local JWT for your app’s auth system
    const appToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token: appToken,
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error: any) {
    console.error("Google login error:", error.response?.data || error.message);
    res.status(500).json({ message: "Google login failed", error: error.message });
  }
}
