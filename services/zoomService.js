import axios from "axios";
import crypto from "crypto";

const ZOOM_ACCOUNT_ID = "YOUR_ACCOUNT_ID";
const ZOOM_CLIENT_ID = "YOUR_CLIENT_ID";
const ZOOM_CLIENT_SECRET = "YOUR_CLIENT_SECRET";

let zoomAccessToken = null;
let tokenExpiration = null;

export const getZoomAccessToken = async () => {
  if (zoomAccessToken && tokenExpiration && Date.now() < tokenExpiration) {
    return zoomAccessToken;
  }

  try {
    const authString = Buffer.from(
      `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      },
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    zoomAccessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000 - 60000;
    return zoomAccessToken;
  } catch (error) {
    console.error(
      "Error getting Zoom access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get Zoom access token");
  }
};

export const createMeeting = async (meetingData) => {
  const token = await getZoomAccessToken();

  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: meetingData.topic || "Zoom Meeting",
      type: 1,
      start_time: meetingData.start_time || new Date().toISOString(),
      duration: meetingData.duration || 60,
      timezone: meetingData.timezone || "UTC",
      agenda: meetingData.agenda || "",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: false,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        audio: "both",
        auto_recording: "none",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getMeetingDetails = async (meetingId) => {
  const token = await getZoomAccessToken();

  const response = await axios.get(
    `https://api.zoom.us/v2/meetings/${meetingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const generateSignature = (meetingNumber, role) => {
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(
    `${ZOOM_CLIENT_ID}${meetingNumber}${timestamp}${role}`
  ).toString("base64");
  const hash = crypto
    .createHmac("sha256", ZOOM_CLIENT_SECRET)
    .update(msg)
    .digest("base64");
  const signature = Buffer.from(
    `${ZOOM_CLIENT_ID}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString("base64");

  return signature;
};
