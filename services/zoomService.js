import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Accessing Zoom OAuth credentials from environment variables
const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

// Step 1: Get Access Token from Zoom OAuth API
const getAccessToken = async () => {
  const tokenUrl = "https://zoom.us/oauth/token";

  // Create the basic authorization header
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  try {
    // Make a request to get the access token
    const response = await axios.post(tokenUrl, params, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Unable to fetch access token");
  }
};

// Step 2: Generate Zoom Signature using Access Token
const generateSignature = (accessToken, meetingNumber, role) => {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime() - 30000; // A timestamp 30 seconds before the current time
    const payload = {
      sdkKey: CLIENT_ID, // Your OAuth client ID
      mn: meetingNumber,
      role: role, // 1 for host, 0 for participant
      iat: timestamp,
      exp: timestamp + 5000, // Signature expiration time (5 seconds after the timestamp)
    };

    try {
      // Use the access token to fetch meeting information, etc., if needed

      // Generate the Zoom JWT signature using your Zoom SDK secret
      const signature = jwt.sign(payload, CLIENT_SECRET); // Use your OAuth client secret to sign the JWT
      resolve(signature);
    } catch (error) {
      reject(error);
    }
  });
};

// Step 3: Generate Zoom Signature by fetching access token
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
