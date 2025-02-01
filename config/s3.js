const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFile = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    return { success: true , Location:`https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`};
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    return { success: false, message: 'Error uploading file' };
  }
};

module.exports = { uploadFile };
