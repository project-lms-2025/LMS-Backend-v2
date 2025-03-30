import BatchEnrollmentModel from '../models/BatchEnrollmentModel.js';
import CourseModel from '../models/CourseModel.js';
import CourseService from '../services/CourseService.js';

class CourseController {
    static async createCourse(req, res) {
        try {
            const { batch_id, course_name, allow_notes_download } = req.body;
            const teacher_id = req.user_id;

            const newCourse = await CourseService.createCourse(teacher_id, batch_id, course_name, allow_notes_download);
            res.status(201).json(newCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create course' });
        }
    }

    static async getCourse(req, res) {
        try {
            const course = await CourseService.getCourse(req.params.course_id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.json(course);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get course' });
        }
    }

    static async getAllCourses(req, res) {
        try {
            const courses = await CourseService.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get all courses' });
        }
    }

    static async getCoursesByBatchId(req, res) {
        try {
            const courses = await CourseService.getCoursesByBatchId(req.params.batch_id);
            res.json(courses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get courses' });
        }
    }

    static async updateCourse(req, res) {
        try {
            const updatedCourse = await CourseService.updateCourse(req.params.course_id, req.body);
            res.json(updatedCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update course' });
        }
    }

    static async deleteCourse(req, res) {
        try {
            await CourseService.deleteCourse(req.params.course_id);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete course' });
        }
    }

    static async getEnrolledCourses(req, res) {
        try {
            const user_id = req.user_id;

            // Fetch batch IDs that the user is enrolled in
            const batchEnrollments = await BatchEnrollmentModel.getEnrollmentByUserId(user_id);
            console.log("these are batch enrollments",batchEnrollments);
            if (!batchEnrollments || batchEnrollments.length === 0) {
                return res.status(404).json({ error: 'User is not enrolled in any batches' });
            }

            // Extract batch IDs
            const batchIds = batchEnrollments.data.map(enrollment => enrollment.batch_id);
            // Fetch courses by batch IDs
            const courses = await CourseModel.getCoursesByBatchIds(batchIds);
            if (courses.length === 0) {
                return res.status(404).json({ error: 'No courses found for the enrolled batches' });
            }

            res.status(200).json({success: true, message: 'Fetched Courses successfully', data: courses });;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch enrolled courses' });
        }
    }
}

export default CourseController;