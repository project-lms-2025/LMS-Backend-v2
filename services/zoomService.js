import axios from "axios";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;
const MEETING_NUMBER = process.env.ZOOM_MEETING_NUMBER; // Use the meeting number from .env file

// Step 1: Get Access Token from OAuth flow
const getAccessToken = async () => {
  const tokenUrl = "https://zoom.us/oauth/token";

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Unable to fetch access token");
  }
};

// Step 2: Generate Zoom Signature
const generateSignature = (accessToken, meetingNumber, role) => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime() - 30000; // A timestamp 30 seconds before the current time
    const payload = {
      sdkKey: CLIENT_ID, // Use your OAuth client ID as sdkKey
      mn: meetingNumber,
      role: role, // 1 for host, 0 for participant
      iat: timestamp,
      exp: timestamp + 5000, // Signature expiration time
    };

    try {
      const signature = jwt.sign(payload, CLIENT_SECRET); // Use the OAuth client secret to sign the JWT
      resolve(signature);
    } catch (error) {
      reject(error);
    }
  });
};

// Generate the signature by first getting the access token and then generating the Zoom signature
const generateZoomSignature = async (meetingNumber, role) => {
  try {
    const accessToken = await getAccessToken(); // Get the OAuth access token
    const signature = await generateSignature(accessToken, meetingNumber, role); // Generate the signature
    return signature;
  } catch (error) {
    console.error("Error generating Zoom signature:", error);
    throw new Error("Unable to generate Zoom signature");
  }
};

export default generateZoomSignature;
