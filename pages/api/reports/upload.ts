import type { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    res.status(200).json({ uploadUrl });
  } else res.status(405).end();
}
