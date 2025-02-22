import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generatePresignedUrl = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `questions/${Date.now()}_${fileName}`,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);

  try {
    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    return { success: true, presignedUrl };
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    return { success: false, message: 'Error generating presigned URL' };
  }
};

export default generatePresignedUrl;
