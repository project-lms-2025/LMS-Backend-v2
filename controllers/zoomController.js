import generateZoomSignature from "../services/zoomService.js";

const generateZoomSignatureHandler = async (req, res) => {
  try {
    const { meetingNumber, role } = req.body; // Expect meetingNumber and role (1 for host, 0 for participant)

    // Validate input
    if (!meetingNumber || !role) {
      return res.status(400).send("Meeting number and role are required");
    }

    const signature = await generateZoomSignature(meetingNumber, role);
    res.status(200).json({ signature });
  } catch (error) {
    console.error("Error generating Zoom signature:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default generateZoomSignatureHandler;
