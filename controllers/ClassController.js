import ClassService from '../services/ClassService.js';

class ClassController {
    static async createClass(req, res) {
        try {
            const { course_id, class_title, class_date_time, recording_url } = req.body;
            const teacher_email = req.email;

            const newClass = await ClassService.createClass(teacher_email, course_id, class_title, class_date_time, recording_url);
            res.status(201).json(newClass);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create class' });
        }
    }

    static async getClass(req, res) {
        try {
            const cls = await ClassService.getClass(req.params.class_id);
            if (!cls) {
                return res.status(404).json({ error: 'Class not found' });
            }
            res.json(cls);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get class' });
        }
    }

    static async getClassesByCourseId(req, res) {
        try {
            const classes = await ClassService.getClassesByCourseId(req.params.course_id);
            res.json(classes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get classes' });
        }
    }

    static async getAllClasses(req, res) {
        try {
            const classes = await ClassService.getAllClasses();
            res.json(classes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get all classes' });
        }
    }
    
    static async updateClass(req, res) {
        try {
            const updatedClass = await ClassService.updateClass(req.params.class_id, req.body);
            res.json(updatedClass);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update class' });
        }
    }

    static async deleteClass(req, res) {
        try {
            await ClassService.deleteClass(req.params.class_id);
            res.status(204).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete class' });
        }
    }
}

export default ClassController;