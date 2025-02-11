import ClassModel from "../models/ClassModel.js"
import { generateUniqueId } from '../utils/idGenerator.js';

class ClassService {
    static async createClass(teacher_id, course_id, class_title, class_date_time, recording_url) {
        const class_id = generateUniqueId();
        const cls = { class_id, teacher_id, course_id, class_title, class_date_time, recording_url }; // Use "cls" here
        return ClassModel.createClass(cls);
    }

    static async getClass(class_id) {
        return ClassModel.getClassById(class_id);
    }

    static async getClassesByCourseId(course_id) {
        return ClassModel.getClassesByCourseId(course_id);
    }

    static async updateClass(class_id, updatedClassData) {
        return ClassModel.updateClass(class_id, updatedClassData);
    }

    static async deleteClass(class_id) {
        return ClassModel.deleteClass(class_id);
    }
}

export default ClassService;