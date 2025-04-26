import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

const generateZoomSdkToken = (meetingNumber, role) => {
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const payload = {
    appKey: CLIENT_ID,
    sdkKey: CLIENT_ID,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp,
  };

  const sdkToken = jwt.sign(payload, CLIENT_SECRET, { algorithm: "HS256" });

  return sdkToken;
};

export default generateZoomSdkToken;
