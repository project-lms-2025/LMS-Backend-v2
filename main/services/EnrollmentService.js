import EnrollmentModel from "../models/EnrollmentModel.js";

class EnrollmentService {
    
    static async joinCourse(student_id, course_id) {
        return EnrollmentModel.JoinCourse(student_id, course_id);
    }

    static async joinBatch(student_id, batch_id) {
        return EnrollmentModel.JoinBatch(student_id, batch_id);
    }

}

export default EnrollmentService;
