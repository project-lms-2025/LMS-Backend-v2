class EnrollmentController {
    
    static async joinCourse(req, res) {
        const { student_id, course_id } = req.body;
        
        try {
            const result = await EnrollmentService.joinCourse(student_id, course_id);
            res.status(200).json({ message: "Student successfully enrolled in course", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to enroll student in course" });
        }
    }

    static async joinBatch(req, res) {
        const { student_id, batch_id } = req.body;

        try {
            const result = await EnrollmentService.joinBatch(student_id, batch_id);
            res.status(200).json({ message: "Student successfully enrolled in batch", result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to enroll student in batch" });
        }
    }

}

export default EnrollmentController;
