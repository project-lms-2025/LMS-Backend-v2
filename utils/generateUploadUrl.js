import generatePresignedUrl from '../config/s3.js';

const generateUploadUrl = async (req, res) => {
  const { fileName, fileType } = req.query;

  try {
    const { success, presignedUrl, message } = await generatePresignedUrl(fileName, fileType);
    if (!success) {
      return res.status(500).json({ error: message });
    }
    res.status(200).json({ presignedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
};

export default generateUploadUrl;
