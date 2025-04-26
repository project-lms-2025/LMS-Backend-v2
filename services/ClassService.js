import ClassModel from "../models/ClassModel.js";
import { generateUniqueId } from "../utils/idGenerator.js";
import axios from "axios";

class ClassService {
  static async generateOauthToken() {
    const zoomOAuthUrl = "https://zoom.us/oauth/token";
    const zoomAccountId = process.env.ZOOM_ACCOUNT_ID;
    const zoomClientId = process.env.ZOOM_CLIENT_ID;
    const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;

    // Base64 encode client ID and secret for Basic Auth
    const basicAuthToken = Buffer.from(
      `${zoomClientId}:${zoomClientSecret}`
    ).toString("base64");

    const oauthResponse = await axios.post(
      zoomOAuthUrl,
      new URLSearchParams({
        grant_type: "account_credentials",
        account_id: zoomAccountId,
      }),
      {
        headers: {
          Authorization: `Basic ${basicAuthToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return oauthResponse.data.access_token;
  }

  static async createZoomMeeting(class_title, class_date_time, accessToken) {
    const zoomMeetingUrl = "https://api.zoom.us/v2/users/me/meetings";
    const startTime = new Date(class_date_time).toISOString(); // Convert to Zoom's required format

    const meetingPayload = {
      topic: class_title,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration: 60, // Default to 60 minutes (adjust as needed)
      timezone: "UTC", // Or use req.user.timezone if available
      settings: {
        join_before_host: true,
        approval_type: 0, // Automatically approve registration
        mute_upon_entry: true,
      },
    };

    const zoomMeetingResponse = await axios.post(
      zoomMeetingUrl,
      meetingPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return zoomMeetingResponse.data;
  }

  static async createClass(
    teacher_id,
    course_id,
    class_title,
    class_date_time,
    recording_url
  ) {
    const zoom_access_token = await this.generateOauthToken();
    const zoomMeetingUrl = await this.createZoomMeeting(
      class_title,
      class_date_time,
      zoom_access_token
    );

    const class_id = generateUniqueId();
    const cls = {
      class_id,
      teacher_id,
      course_id,
      class_title,
      class_date_time,
      recording_url,
      zoom_meeting_url: zoomMeetingUrl.join_url,
      session_passcode: zoomMeetingUrl.password,
    }; // Use "cls" here
    return ClassModel.createClass(cls);
  }

  static async getClass(class_id) {
    return ClassModel.getClassById(class_id);
  }

  static async getClassesByCourseId(course_id) {
    return ClassModel.getClassesByCourseId(course_id);
  }

  static async getAllClasses() {
    return ClassModel.getAllClasses();
  }

  static async updateClass(class_id, updatedClassData) {
    return ClassModel.updateClass(class_id, updatedClassData);
  }

  static async deleteClass(class_id) {
    return ClassModel.deleteClass(class_id);
  }
}

export default ClassService;
