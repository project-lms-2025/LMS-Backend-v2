import courseData from '../data/courseData.js';
import { generateId } from '../utils/idGenerator.js';

class CourseService {
    static async createCourse(teacher_id, batch_id, course_name, allow_notes_download) {
        const course_id = generateId();
        const course = { course_id, teacher_id, batch_id, course_name, allow_notes_download };
        return courseData.createCourse(course);
    }

    static async getCourse(course_id) {
        return courseData.getCourseById(course_id);
    }

    static async getCoursesByBatchId(batch_id) {
        return courseData.getCoursesByBatchId(batch_id);
    }

    static async updateCourse(course_id, updatedCourseData) {
        return courseData.updateCourse(course_id, updatedCourseData);
    }

    static async deleteCourse(course_id) {
        return courseData.deleteCourse(course_id);
    }
}

export default CourseService;