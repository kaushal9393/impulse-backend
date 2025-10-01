import type { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: "Missing filePath" });
  }

  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: filePath as string,
      Expires: 60, // URL valid for 1 minute
    };

    const downloadURL = await s3.getSignedUrlPromise("getObject", params);

    res.status(200).json({ url: downloadURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
}
