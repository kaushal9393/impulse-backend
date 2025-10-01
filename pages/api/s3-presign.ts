import type { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, filetype, patientId } = req.body;

  try {
    const key = `reports/${Date.now()}-${filename}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Expires: 60,
      ContentType: filetype,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    // return signed url + file path
    res.status(200).json({ uploadURL, filePath: key, patientId });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}
