import express from "express";
import generateZoomSignature from "../controllers/zoomController.js";

const router = express.Router();

/**
 * @swagger
 * /zoom/generate-signature:
 *   post:
 *     summary: Generate Zoom Meeting Signature
 *     description: Generates a Zoom meeting signature required to join or start a Zoom meeting.
 *     tags:
 *       - Zoom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - meetingNumber
 *               - role
 *             properties:
 *               meetingNumber:
 *                 type: string
 *                 example: "123456789"
 *                 description: Zoom Meeting Number.
 *               role:
 *                 type: integer
 *                 example: 1
 *                 description: Role of the user. 0 for attendee, 1 for host.
 *     responses:
 *       200:
 *         description: Successfully generated Zoom meeting signature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signature:
 *                   type: string
 *                   description: Generated Zoom meeting signature.
 *       400:
 *         description: Missing or invalid parameters.
 *       500:
 *         description: Server error while generating the signature.
 */

router.post("/generate-signature", generateZoomSignature);

export default router;
