import { generateUniqueId } from '../utils/idGenerator.js';
import CourseModel from "../models/CourseModel.js"

class CourseService {
    static async createCourse(teacher_id, batch_id, course_name, allow_notes_download) {
        const course_id = generateUniqueId();
        const course = { course_id, teacher_id, batch_id, course_name, allow_notes_download };
        return CourseModel.createCourse(course);
    }

    static async getCourse(course_id) {
        return CourseModel.getCourseById(course_id);
    }

    static async getAllCourses() {
        return CourseModel.getAllCourses();
    }

    static async getCoursesByBatchId(batch_id) {
        return CourseModel.getCoursesByBatchId(batch_id);
    }

    static async updateCourse(course_id, updatedCourseData) {
        return CourseModel.updateCourse(course_id, updatedCourseData);
    }

    static async deleteCourse(course_id) {
        return CourseModel.deleteCourse(course_id);
    }
}

export default CourseService;