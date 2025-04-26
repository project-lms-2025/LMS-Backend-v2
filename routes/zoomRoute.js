import express from "express";
import generateZoomSignature from "../controllers/zoomController.js";

const router = express.Router();

// Define the route for generating the Zoom signature
router.post("/generate-signature", generateZoomSignature);

export default router;
