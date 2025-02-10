import classData from '../data/classData.js';
import { generateId } from '../utils/idGenerator.js';

class ClassService {
    static async createClass(teacher_id, course_id, class_title, class_date_time, recording_url) {
        const class_id = generateId();
        const cls = { class_id, teacher_id, course_id, class_title, class_date_time, recording_url }; // Use "cls" here
        return classData.createClass(cls);
    }

    static async getClass(class_id) {
        return classData.getClassById(class_id);
    }

    static async getClassesByCourseId(course_id) {
        return classData.getClassesByCourseId(course_id);
    }

    static async updateClass(class_id, updatedClassData) {
        return classData.updateClass(class_id, updatedClassData);
    }

    static async deleteClass(class_id) {
        return classData.deleteClass(class_id);
    }
}

export default ClassService;