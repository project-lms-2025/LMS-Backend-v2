import CourseService from '../services/courseService.js';

class CourseController {
    static async createCourse(req, res) {
        try {
            const { batch_id, course_name, allow_notes_download } = req.body;
            const teacher_id = req.user.user_id;

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
}

export default CourseController;