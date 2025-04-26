import * as zoomService from "../services/zoomService.js";

export const createMeeting = async (req, res) => {
  try {
    const meetingData = req.body;
    const meeting = await zoomService.createMeeting(meetingData);
    res.json(meeting);
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

export const getMeetingDetails = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meetingDetails = await zoomService.getMeetingDetails(meetingId);
    res.json(meetingDetails);
  } catch (error) {
    console.error("Error getting meeting details:", error.message);
    res.status(500).json({ error: "Failed to get meeting details" });
  }
};

export const generateSignature = (req, res) => {
  try {
    const { meetingNumber, role } = req.body;
    const signature = zoomService.generateSignature(meetingNumber, role);
    res.json({ signature });
  } catch (error) {
    console.error("Error generating signature:", error.message);
    res.status(500).json({ error: "Failed to generate signature" });
  }
};
