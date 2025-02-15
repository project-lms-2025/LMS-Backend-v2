import CourseAssignmentModel from "../models/CourseAssignmentModel.js";

class CourseAssignmentController {
  static async assignEntityToCourse(req, res) {
    const { course_id, entity } = req.body;

    try {
      const result = await CourseAssignmentModel.assignEntityToCourse(
        course_id,
        entity
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error assigning entity to course:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async bulkAssignEntitiesToCourses(req, res) {
    const { courseEntityAssignments } = req.body;

    try {
      const result = await CourseAssignmentModel.bulkAssignEntitiesToCourses(
        courseEntityAssignments
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error bulk assigning entities to courses:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}


export default CourseAssignmentController;